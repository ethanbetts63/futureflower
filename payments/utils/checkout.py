import stripe
from django.conf import settings

stripe.api_key = settings.STRIPE_SECRET_KEY


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
    from decimal import Decimal
    if user.is_staff or user.is_superuser:
        return Decimal('1.00')
    return amount


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
