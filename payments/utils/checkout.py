from datetime import datetime, time, timedelta
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
    Start the Stripe payment for an order and record the matching pending
    Payment. Returns the client secret the browser confirms.

    One-time orders get a plain PaymentIntent. Recurring orders get a real
    Stripe Subscription created up front (see _start_subscription_payment);
    either way the browser receives a PaymentIntent client secret and confirms
    it with the same Payment Element flow.

    Both checkout entry points (guest and authenticated) go through here, so the
    amount Stripe charges and the amount recorded against the order cannot drift
    apart. Callers are responsible for authorizing the order and for calling
    validate_order_ready_for_payment first.
    """
    ensure_stripe_customer(order.user)

    if order.billing_mode == 'recurring':
        return _start_subscription_payment(order)

    return _start_one_time_payment(order)


def _first_charge_cents(order):
    """The amount of the first charge: total (discount included), clamped to
    Stripe's minimum before converting so the recorded Payment always matches
    what Stripe actually charges."""
    return int(max(Decimal(order.total_amount), STRIPE_MINIMUM_CHARGE) * 100)


def _record_pending_payment(order, payment_intent_id, amount_in_cents):
    from payments.models import Payment

    Payment.objects.create(
        user=order.user,
        order=order,
        stripe_payment_intent_id=payment_intent_id,
        amount=Decimal(amount_in_cents) / 100,
        status='pending',
    )


def _start_one_time_payment(order):
    amount_in_cents = _first_charge_cents(order)

    # A draft that briefly became recurring may have left an incomplete
    # subscription behind; cancel it so only one charge path exists.
    _cancel_incomplete_subscription(order)

    reused_secret = reuse_or_cancel_pending_payment_intent(order, amount_in_cents)
    if reused_secret:
        return reused_secret

    metadata = {'order_id': str(order.id), 'billing_mode': order.billing_mode}
    if order.discount_code:
        metadata['discount_code'] = order.discount_code.code

    payment_intent = stripe.PaymentIntent.create(
        amount=amount_in_cents,
        currency=order.currency.lower(),
        customer=order.user.stripe_customer_id,
        automatic_payment_methods={'enabled': True},
        metadata=metadata,
    )
    _record_pending_payment(order, payment_intent.id, amount_in_cents)
    return payment_intent.client_secret


def _start_subscription_payment(order):
    """
    Create the Stripe Subscription for a recurring order at checkout time.

    The subscription is created `default_incomplete` with:
      - a trial ending SUBSCRIPTION_CHARGE_LEAD_DAYS before the *second*
        delivery, so the recurring price bills on the charge-ahead schedule;
      - a one-off invoice item for the first delivery, which Stripe invoices
        immediately despite the trial — that first invoice's PaymentIntent is
        what the browser confirms, so money is taken at signup;
      - the recurring price built from the *undiscounted* subtotal, with any
        discount applied as a duration='once' coupon, so a code discounts the
        first delivery only and Stripe itself retires it afterwards.
    """
    from payments.utils.subscription_dates import (
        calculate_second_delivery_date,
        get_recurring_options,
    )

    reused_secret = _reuse_incomplete_subscription(order)
    if reused_secret:
        return reused_secret

    # A draft that switched from one_time may have left a plain PaymentIntent
    # behind; cancel it so only one charge path exists.
    reuse_or_cancel_pending_payment_intent(order, amount_in_cents=None)

    # Recurring deliveries are always full price: budget + delivery fee,
    # discount excluded.
    recurring_cents = int(Decimal(order.subtotal) * 100)

    second_delivery = calculate_second_delivery_date(order.start_date, order.frequency)
    trial_end_date = second_delivery - timedelta(days=settings.SUBSCRIPTION_CHARGE_LEAD_DAYS)
    trial_end_ts = int(datetime.combine(trial_end_date, time.min).timestamp())
    if trial_end_ts <= datetime.now().timestamp():
        trial_end_ts = int(datetime.now().timestamp() + 60)

    discounts = []
    discount_amount = Decimal(order.discount_amount or 0)
    if order.discount_code and discount_amount > 0:
        # Clamp so the first invoice stays at or above Stripe's minimum charge.
        max_off = Decimal(order.subtotal) - STRIPE_MINIMUM_CHARGE
        amount_off_cents = int(min(discount_amount, max_off) * 100)
        if amount_off_cents > 0:
            coupon = stripe.Coupon.create(
                duration='once',
                amount_off=amount_off_cents,
                currency=order.currency.lower(),
                name=order.discount_code.code,
            )
            discounts = [{'coupon': coupon.id}]

    metadata = {'order_id': str(order.id), 'billing_mode': order.billing_mode}
    if order.discount_code:
        metadata['discount_code'] = order.discount_code.code

    product = stripe.Product.create(name='FutureFlower Subscription')
    subscription = stripe.Subscription.create(
        customer=order.user.stripe_customer_id,
        items=[{
            'price_data': {
                'currency': order.currency.lower(),
                'unit_amount': recurring_cents,
                'product': product.id,
                'recurring': get_recurring_options(order.frequency),
            },
        }],
        # The first delivery, invoiced and charged right now.
        add_invoice_items=[{
            'price_data': {
                'currency': order.currency.lower(),
                'unit_amount': recurring_cents,
                'product': product.id,
            },
        }],
        trial_end=trial_end_ts,
        discounts=discounts,
        payment_behavior='default_incomplete',
        payment_settings={'save_default_payment_method': 'on_subscription'},
        expand=['latest_invoice.confirmation_secret'],
        metadata=metadata,
    )

    client_secret = subscription.latest_invoice.confirmation_secret.client_secret
    order.stripe_subscription_id = subscription.id
    order.save()

    # The client secret is "<pi id>_secret_<nonce>"; the webhook matches the
    # Payment record by the PaymentIntent id embedded in it.
    payment_intent_id = client_secret.split('_secret')[0]
    _record_pending_payment(order, payment_intent_id, _first_charge_cents(order))
    return client_secret


def _reuse_incomplete_subscription(order):
    """
    If the order already has an incomplete subscription whose first invoice
    matches the current total, reuse its client secret. Anything stale is
    cancelled and cleared so a fresh subscription can be created.
    """
    if not order.stripe_subscription_id:
        return None

    from payments.models import Payment

    expected_cents = _first_charge_cents(order)
    try:
        subscription = stripe.Subscription.retrieve(
            order.stripe_subscription_id,
            expand=['latest_invoice.confirmation_secret'],
        )
        invoice = getattr(subscription, 'latest_invoice', None)
        if (
            subscription.status == 'incomplete'
            and invoice is not None
            and invoice.amount_due == expected_cents
            and getattr(invoice, 'confirmation_secret', None)
        ):
            return invoice.confirmation_secret.client_secret
        if subscription.status in ('incomplete', 'trialing', 'active'):
            stripe.Subscription.cancel(order.stripe_subscription_id)
    except stripe.error.StripeError:
        pass

    order.stripe_subscription_id = None
    order.save(update_fields=['stripe_subscription_id'])
    Payment.objects.filter(order=order, status='pending').delete()
    return None


def _cancel_incomplete_subscription(order):
    """Cancel and clear a leftover incomplete subscription on the order."""
    if not order.stripe_subscription_id or order.status != 'pending_payment':
        return

    from payments.models import Payment

    try:
        stripe.Subscription.cancel(order.stripe_subscription_id)
    except stripe.error.StripeError:
        pass
    order.stripe_subscription_id = None
    order.save(update_fields=['stripe_subscription_id'])
    Payment.objects.filter(order=order, status='pending').delete()


def reuse_or_cancel_pending_payment_intent(order, amount_in_cents):
    """
    Looks for an existing pending Payment for this order. If a matching Stripe
    PaymentIntent exists with the same amount, its client secret is reused.
    Otherwise the stale PaymentIntent/Payment record is cleaned up so a new
    one can be created.

    Pass amount_in_cents=None to force cleanup without reuse.

    Returns a client secret to reuse, or None if the caller should create a
    new PaymentIntent.
    """
    from payments.models import Payment

    existing_payment = Payment.objects.filter(order=order, status='pending').first()
    if not existing_payment or not existing_payment.stripe_payment_intent_id:
        return None

    try:
        payment_intent = stripe.PaymentIntent.retrieve(existing_payment.stripe_payment_intent_id)
        if amount_in_cents is not None and payment_intent.amount == amount_in_cents:
            return payment_intent.client_secret
        stripe.PaymentIntent.cancel(existing_payment.stripe_payment_intent_id)
        existing_payment.delete()
    except stripe.error.StripeError:
        existing_payment.delete()

    return None
