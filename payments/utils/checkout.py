from decimal import Decimal

import stripe
from django.conf import settings

stripe.api_key = settings.STRIPE_SECRET_KEY

# Stripe rejects charges below 50 cents.
STRIPE_MINIMUM_CHARGE = Decimal('0.50')


def ensure_stripe_customer(user):
    """
    Makes sure the user has a Stripe Customer ID, creating one if needed.
    """
    if not user.stripe_customer_id:
        customer = stripe.Customer.create(
            email=user.email,
            name=user.get_full_name(),
            metadata={'user_id': user.id}
        )
        user.stripe_customer_id = customer.id
        user.save()


def get_staff_override_amount(user, amount):
    """
    Staff/superuser override: always charge $1 for testing.
    """
    if user.is_staff or user.is_superuser:
        return Decimal('1.00')
    return amount


def validate_order_ready_for_payment(order):
    """
    Return why the order cannot be paid for yet, or None if it can.
    """
    if order.total_amount is None or order.total_amount <= 0:
        return 'Order amount must be greater than zero.'
    if order.billing_mode == 'recurring' and not all([order.start_date, order.frequency]):
        return 'Subscription details are incomplete.'
    return None


def start_order_payment(order):
    """
    Create — or reuse — the Stripe PaymentIntent for an order and record the
    matching pending Payment. Returns the client secret.

    Both checkout entry points (guest and authenticated) go through here, so the
    amount Stripe charges and the amount recorded against the order cannot drift
    apart. Callers are responsible for authorizing the order and for calling
    validate_order_ready_for_payment first.
    """
    from payments.models import Payment

    user = order.user
    ensure_stripe_customer(user)

    # Clamp before converting to cents so the recorded Payment always matches
    # what Stripe is actually charging.
    final_amount = max(
        get_staff_override_amount(user, Decimal(order.total_amount)),
        STRIPE_MINIMUM_CHARGE,
    )
    amount_in_cents = int(final_amount * 100)

    reused_secret = reuse_or_cancel_pending_payment_intent(order, amount_in_cents)
    if reused_secret:
        return reused_secret

    metadata = {'order_id': str(order.id), 'billing_mode': order.billing_mode}
    if order.discount_code:
        metadata['discount_code'] = order.discount_code.code

    kwargs = {
        'amount': amount_in_cents,
        'currency': order.currency.lower(),
        'customer': user.stripe_customer_id,
        'automatic_payment_methods': {'enabled': True},
        'metadata': metadata,
    }
    if order.billing_mode == 'recurring':
        # Card is kept on file so later deliveries can be billed off-session.
        kwargs['setup_future_usage'] = 'off_session'

    payment_intent = stripe.PaymentIntent.create(**kwargs)
    Payment.objects.create(
        user=user,
        order=order,
        stripe_payment_intent_id=payment_intent.id,
        amount=final_amount,
        status='pending',
    )
    return payment_intent.client_secret


def reuse_or_cancel_pending_payment_intent(order, amount_in_cents):
    """
    Looks for an existing pending Payment for this order. If a matching Stripe
    PaymentIntent exists with the same amount, its client secret is reused.
    Otherwise the stale PaymentIntent/Payment record is cleaned up so a new
    one can be created.

    Returns a client secret to reuse, or None if the caller should create a
    new PaymentIntent.
    """
    from payments.models import Payment

    existing_payment = Payment.objects.filter(order=order, status='pending').first()
    if not existing_payment or not existing_payment.stripe_payment_intent_id:
        return None

    try:
        payment_intent = stripe.PaymentIntent.retrieve(existing_payment.stripe_payment_intent_id)
        if payment_intent.amount == amount_in_cents:
            return payment_intent.client_secret
        stripe.PaymentIntent.cancel(existing_payment.stripe_payment_intent_id)
        existing_payment.delete()
    except stripe.error.StripeError:
        existing_payment.delete()

    return None
