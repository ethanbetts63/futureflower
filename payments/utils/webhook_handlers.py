# payments/utils/webhook_handlers.py
from decimal import Decimal
from datetime import timedelta
from django.conf import settings
from django.db import transaction
from payments.models import Payment
from events.models import OrderBase, Event
from payments.utils.subscription_dates import get_next_delivery_date
from payments.utils.send_admin_payment_notification import send_admin_payment_notification
from payments.utils.send_customer_payment_notification import send_customer_payment_notification
from data_management.utils.notification_factory import create_admin_event_notifications, create_customer_delivery_day_notification


def _activate_order(order):
    order.status = 'active'
    order.save()


def _create_first_event(order, payment_intent_id):
    """
    Creates the single delivery Event for a one-time or recurring order's
    first delivery. Idempotent.
    """
    if Event.objects.filter(order=order, delivery_date=order.start_date).exists():
        print(f"First event for Order (PK: {order.pk}) already exists. Skipping duplicate.")
        return

    from partners.utils.commission_utils import get_referral_commission_amount
    commission_amount = get_referral_commission_amount(order.budget) if order.budget else None
    message = order.subscription_message or (order.draft_card_messages or {}).get('0', '')

    event = Event.objects.create(
        order=order,
        delivery_date=order.start_date,
        message=message,
        commission_amount=commission_amount,
    )
    create_admin_event_notifications(event)
    create_customer_delivery_day_notification(event)
    send_customer_payment_notification(order.user, order)
    send_admin_payment_notification(payment_intent_id, order=order)


def _create_stripe_subscription_for_order(order, payment_method_id):
    """
    Creates the actual Stripe Subscription for future deliveries of a
    recurring order, once the first delivery has been paid for. Idempotent.
    """
    if order.stripe_subscription_id:
        return

    import stripe
    from datetime import datetime, time
    from payments.utils.subscription_dates import get_recurring_options, calculate_second_delivery_date

    stripe.api_key = settings.STRIPE_SECRET_KEY

    second_delivery_date = calculate_second_delivery_date(order.start_date, order.frequency)
    trial_end_date = second_delivery_date - timedelta(days=settings.SUBSCRIPTION_CHARGE_LEAD_DAYS)
    trial_end_timestamp = int(datetime.combine(trial_end_date, time.min).timestamp())

    if trial_end_timestamp <= datetime.now().timestamp():
        trial_end_timestamp = int(datetime.now().timestamp() + 60)

    product = stripe.Product.create(name="FutureFlower Subscription")

    subscription = stripe.Subscription.create(
        customer=order.user.stripe_customer_id,
        items=[{
            "price_data": {
                "currency": order.currency.lower(),
                "unit_amount": int(order.total_amount * 100),
                "product": product.id,
                "recurring": get_recurring_options(order.frequency),
            }
        }],
        trial_end=trial_end_timestamp,
        default_payment_method=payment_method_id,
        metadata={'order_id': order.id},
    )

    order.stripe_subscription_id = subscription.id
    order.save()
    print(f"Stripe Subscription {subscription.id} created for order {order.id}.")


def handle_payment_intent_succeeded(payment_intent):
    """
    Handles the payment_intent.succeeded event from Stripe. This is the
    fulfillment step of checkout, dispatched by the order's billing_mode.
    """
    payment_intent_id = payment_intent['id']

    try:
        with transaction.atomic():
            payment = Payment.objects.get(stripe_payment_intent_id=payment_intent_id)

            # Idempotency: if already processed, skip
            if payment.status == 'succeeded':
                print(f"Payment record (PK: {payment.pk}) already succeeded. Skipping duplicate webhook.")
                return

            payment.status = 'succeeded'
            payment.save()
            print(f"Payment record (PK: {payment.pk}) status updated to 'succeeded'.")

            # --- Discount & Commission Processing ---
            metadata = payment_intent.get('metadata', {})
            discount_code_str = metadata.get('discount_code')
            if discount_code_str:
                try:
                    from partners.models import DiscountCode, DiscountUsage
                    dc = DiscountCode.objects.get(code__iexact=discount_code_str, is_active=True)
                    if not DiscountUsage.objects.filter(payment=payment).exists():
                        DiscountUsage.objects.create(
                            discount_code=dc,
                            user=payment.user,
                            payment=payment,
                            discount_applied=dc.discount_amount,
                        )
                        print(f"DiscountUsage created for Payment {payment.pk}")
                except Exception as e:
                    print(f"Error creating DiscountUsage: {e}")

            try:
                from partners.utils.commission_utils import process_referral_commission
                process_referral_commission(payment)
            except Exception as e:
                print(f"Error processing referral commission: {e}")

            # --- Fulfillment Logic ---
            order = payment.order
            print(f"Processing payment_intent.succeeded for Order {order.id} (billing_mode: {order.billing_mode})")

            if order.billing_mode == 'one_time':
                _activate_order(order)
                _create_first_event(order, payment_intent_id)

            elif order.billing_mode == 'recurring':
                _activate_order(order)
                _create_first_event(order, payment_intent_id)
                payment_method_id = payment_intent.get('payment_method')
                _create_stripe_subscription_for_order(order, payment_method_id)

            else:
                print(f"Unhandled billing_mode '{order.billing_mode}' for Order {order.id}. No action taken.")

    except Payment.DoesNotExist:
        print(f"CRITICAL ERROR: Payment object not found for PI ID: {payment_intent_id}. The webhook may have arrived before the initial request completed.")
    except Exception as e:
        print(f"UNEXPECTED ERROR during payment_intent.succeeded processing. PI ID: {payment_intent_id}, Error: {e}")


def handle_invoice_payment_succeeded(invoice):
    """
    Handles the invoice.payment_succeeded event from Stripe for recurring subscription payments.
    """
    subscription_id = invoice.get('subscription')
    if not subscription_id:
        print("Webhook received an invoice.payment_succeeded event without a subscription ID. Skipping.")
        return

    try:
        with transaction.atomic():
            order = OrderBase.objects.select_for_update().get(stripe_subscription_id=subscription_id)
            print(f"Found Order (PK: {order.pk}) for Stripe Subscription ID: {subscription_id}")

            # Create a Payment record for this transaction (idempotent via unique stripe_payment_intent_id)
            payment, created = Payment.objects.get_or_create(
                stripe_payment_intent_id=invoice.get('payment_intent'),
                defaults={
                    'user': order.user,
                    'order': order,
                    'amount': invoice.get('amount_paid') / 100.0,
                    'status': 'succeeded',
                }
            )
            if created:
                print(f"Created Payment record (PK: {payment.pk}) for invoice.")
            else:
                print(f"Payment record (PK: {payment.pk}) already exists for this invoice. Skipping duplicate.")
                return

            # Process referral commission for subscription payments
            try:
                from partners.utils.commission_utils import process_referral_commission
                process_referral_commission(payment)
            except Exception as e:
                print(f"Error processing referral commission for subscription: {e}")

            # Determine the delivery date for this specific payment.
            # Since we charge exactly 14 days before delivery, the delivery date
            # is the date the invoice was created plus 7 days.
            invoice_created_ts = invoice.get('created')
            if invoice_created_ts:
                from datetime import date
                invoice_date = date.fromtimestamp(invoice_created_ts)
                delivery_date = invoice_date + timedelta(days=settings.SUBSCRIPTION_CHARGE_LEAD_DAYS)
            else:
                # Fallback to the drift-free calculation if timestamp is missing
                delivery_date = get_next_delivery_date(order)

            if delivery_date is None:
                print(f"WARNING: Could not determine delivery date for Order (PK: {order.pk}). Skipping Event creation.")
                return

            # Create a new Event for the delivery that was just paid for
            if not Event.objects.filter(order=order, delivery_date=delivery_date).exists():
                from partners.utils.commission_utils import get_referral_commission_amount
                commission_amount = get_referral_commission_amount(order.budget) if order.budget else None
                new_event = Event.objects.create(
                    order=order,
                    delivery_date=delivery_date,
                    message=order.subscription_message,
                    commission_amount=commission_amount,
                )
                create_admin_event_notifications(new_event)
                create_customer_delivery_day_notification(new_event)
                send_admin_payment_notification(invoice.get('payment_intent', ''), order=order)
                print(f"Created new Event for recurring delivery on {delivery_date}.")
            else:
                print(f"Event for delivery on {delivery_date} already exists. Skipping duplicate.")

    except OrderBase.DoesNotExist:
        print(f"CRITICAL ERROR: Order not found for Stripe Subscription ID: {subscription_id}")
    except ValueError as e:
        print(f"ERROR: Could not determine next delivery date. Error: {e}")
    except Exception as e:
        print(f"UNEXPECTED ERROR during invoice.payment_succeeded processing for Subscription ID {subscription_id}: {e}")


def handle_payment_intent_failed(payment_intent):
    """
    Handles the payment_intent.payment_failed event from Stripe.
    """
    print(f"Processing payment_intent.payment_failed for ID: {payment_intent['id']}")
    try:
        payment = Payment.objects.get(stripe_payment_intent_id=payment_intent['id'])
        payment.status = 'failed'
        payment.save()
        print(f"Payment record (PK: {payment.pk}) status updated to 'failed'.")
    except Payment.DoesNotExist:
        print(f"ERROR: Received failed payment intent for non-existent local Payment record ID: {payment_intent['id']}")
    except Exception as e:
        print(f"UNEXPECTED ERROR during payment_intent.payment_failed processing for ID {payment_intent['id']}: {e}")


def handle_subscription_deleted(subscription):
    """
    Handles the customer.subscription.deleted event from Stripe.
    Acts as a safety net for cancellations that happen outside our API
    (e.g. payment failure, manual cancellation in Stripe dashboard).
    """
    subscription_id = subscription.get('id')
    if not subscription_id:
        print("Webhook received customer.subscription.deleted without a subscription ID. Skipping.")
        return

    print(f"Processing customer.subscription.deleted for Stripe Subscription ID: {subscription_id}")

    try:
        with transaction.atomic():
            order = OrderBase.objects.select_for_update().get(
                stripe_subscription_id=subscription_id
            )

            if order.status == 'cancelled':
                print(f"Order (PK: {order.pk}) already cancelled. Skipping.")
                return

            order.status = 'cancelled'
            order.save()
            print(f"Order (PK: {order.pk}) marked as cancelled via webhook.")

            # Cancel remaining scheduled events and their notifications
            scheduled_events = order.events.filter(status='scheduled')
            for event in scheduled_events:
                from data_management.models.notification import Notification
                Notification.objects.filter(
                    related_event=event, status='pending'
                ).update(status='cancelled')
                event.status = 'cancelled'
                event.save()

    except OrderBase.DoesNotExist:
        print(f"Order not found for Stripe Subscription ID: {subscription_id}. Skipping.")
    except Exception as e:
        print(f"UNEXPECTED ERROR during customer.subscription.deleted for {subscription_id}: {e}")


def handle_account_updated(account):
    """
    Handles the account.updated event from Stripe for Connect accounts.
    Marks the partner as onboarding complete when payouts are enabled.
    """
    account_id = account.get('id')
    if not account_id:
        return

    if account.get('payouts_enabled'):
        from partners.models import Partner
        updated = Partner.objects.filter(
            stripe_connect_account_id=account_id,
            stripe_connect_onboarding_complete=False,
        ).update(stripe_connect_onboarding_complete=True)
        if updated:
            print(f"Partner with Stripe account {account_id} marked as onboarding complete.")
        else:
            print(f"account.updated for {account_id}: already complete or not found.")


def handle_transfer_created(transfer):
    """
    Handles the transfer.created event from Stripe.
    Marks the associated Payout as completed and the linked Commission as paid.
    """
    transfer_id = transfer.get('id')
    if not transfer_id:
        print("transfer.created event received without a transfer ID. Skipping.")
        return

    print(f"Processing transfer.created for transfer ID: {transfer_id}")

    try:
        from partners.models import Payout
        payout = Payout.objects.get(stripe_transfer_id=transfer_id)

        if payout.status == 'completed':
            print(f"Payout (PK: {payout.pk}) already completed. Skipping.")
            return

        payout.status = 'completed'
        payout.save()
        print(f"Payout (PK: {payout.pk}) marked as completed.")

        # Find and update the linked commission via PayoutLineItem
        line_item = payout.line_items.filter(commission__isnull=False).first()
        if line_item and line_item.commission:
            commission = line_item.commission
            commission.status = 'paid'
            commission.save()
            print(f"Commission (PK: {commission.pk}) marked as paid.")

    except Payout.DoesNotExist:
        print(f"No Payout found for transfer ID: {transfer_id}. Skipping.")
    except Exception as e:
        print(f"UNEXPECTED ERROR during transfer.created processing for {transfer_id}: {e}")
