# payments/utils/webhook_handlers.py
from decimal import Decimal
from datetime import timedelta
from django.conf import settings
from django.db import transaction
from payments.models import Payment
from events.models import UpfrontPlan, SubscriptionPlan, Event
from events.utils.delivery_dates import calculate_projected_delivery_dates
from payments.utils.subscription_dates import get_next_delivery_date
from payments.utils.send_admin_payment_notification import send_admin_payment_notification
from payments.utils.send_customer_payment_notification import send_customer_payment_notification
from data_management.utils.notification_factory import create_admin_event_notifications, create_customer_delivery_day_notification

def handle_payment_intent_succeeded(payment_intent):
    """
    Handles the payment_intent.succeeded event from Stripe for various single-delivery payments.
    This is the fulfillment step of the checkout.
    """
    payment_intent_id = payment_intent['id']
    metadata = payment_intent.get('metadata', {})
    item_type = metadata.get('item_type')

    print(f"Processing payment_intent.succeeded for item_type: {item_type} (PI: {payment_intent_id})")

    try:
        with transaction.atomic():
            # Retrieve the payment object that was created in the create_payment_intent view
            payment = Payment.objects.get(stripe_payment_intent_id=payment_intent_id)

            # Idempotency: if already processed, skip
            if payment.status == 'succeeded':
                print(f"Payment record (PK: {payment.pk}) already succeeded. Skipping duplicate webhook.")
                return

            # Update payment status
            payment.status = 'succeeded'
            payment.save()
            print(f"Payment record (PK: {payment.pk}) status updated to 'succeeded'.")

            # --- Discount & Commission Processing ---
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
            # Use the 'order' relation from the payment object to find the correct plan
            order = payment.order

            if item_type == 'UPFRONT_PLAN_MODIFY':
                plan_to_update = UpfrontPlan.objects.get(id=order.id)
                plan_to_update.budget = Decimal(metadata['new_budget'])
                plan_to_update.years = int(metadata['new_years'])
                plan_to_update.frequency = metadata['new_frequency']
                plan_to_update.save()
                print(f"UpfrontPlan (PK: {plan_to_update.pk}) successfully modified.")

            elif item_type == 'UPFRONT_PLAN_NEW':
                plan_to_activate = UpfrontPlan.objects.get(id=order.id)
                plan_to_activate.status = 'active'
                plan_to_activate.save()
                print(f"UpfrontPlan (PK: {plan_to_activate.pk}) successfully activated.")

                # Create all delivery events for this plan
                if not Event.objects.filter(order=plan_to_activate.orderbase_ptr).exists():
                    from partners.utils.commission_utils import get_referral_commission_amount
                    budget = getattr(plan_to_activate, 'budget', None)
                    commission_amount = get_referral_commission_amount(budget) if budget else None
                    draft_messages = plan_to_activate.draft_card_messages or {}
                    projected = calculate_projected_delivery_dates(
                        plan_to_activate.start_date,
                        plan_to_activate.frequency,
                        plan_to_activate.years,
                    )
                    events_to_create = [
                        Event(
                            order=plan_to_activate.orderbase_ptr,
                            delivery_date=d["date"],
                            message=draft_messages.get(str(d["index"]), ''),
                            commission_amount=commission_amount,
                        )
                        for d in projected
                    ]
                    Event.objects.bulk_create(events_to_create)
                    # Re-query to get DB-assigned PKs (bulk_create doesn't populate them on SQLite)
                    created_events = list(
                        Event.objects.filter(order=plan_to_activate.orderbase_ptr).order_by('delivery_date')
                    )
                    print(f"Created {len(created_events)} Events for UpfrontPlan (PK: {plan_to_activate.pk}).")
                    for event in created_events:
                        create_admin_event_notifications(event)
                        create_customer_delivery_day_notification(event)
                    send_customer_payment_notification(plan_to_activate.user, plan_to_activate)
                    send_admin_payment_notification(payment_intent_id, order=plan_to_activate)
                else:
                    print(f"Events for UpfrontPlan (PK: {plan_to_activate.pk}) already exist. Skipping duplicate.")

            elif item_type == 'SUBSCRIPTION_PLAN_NEW':
                plan_to_activate = SubscriptionPlan.objects.get(id=order.id)
                plan_to_activate.status = 'active'
                plan_to_activate.save()

                # 1. Create the first delivery Event
                if not Event.objects.filter(order=plan_to_activate.orderbase_ptr, delivery_date=plan_to_activate.start_date).exists():
                    from partners.utils.commission_utils import get_referral_commission_amount
                    sub_budget = getattr(plan_to_activate, 'budget', None)
                    sub_commission_amount = get_referral_commission_amount(sub_budget) if sub_budget else None
                    first_event = Event.objects.create(
                        order=plan_to_activate.orderbase_ptr,
                        delivery_date=plan_to_activate.start_date,
                        message=plan_to_activate.subscription_message,
                        commission_amount=sub_commission_amount,
                    )
                    create_admin_event_notifications(first_event)
                    create_customer_delivery_day_notification(first_event)
                    send_customer_payment_notification(plan_to_activate.user, plan_to_activate)
                    send_admin_payment_notification(payment_intent_id, order=plan_to_activate)

                # 2. Create the actual Stripe Subscription for future deliveries
                if not plan_to_activate.stripe_subscription_id:
                    import stripe
                    from datetime import datetime, time
                    from payments.utils.subscription_dates import get_recurring_options, calculate_second_delivery_date
                    
                    stripe.api_key = settings.STRIPE_SECRET_KEY
                    
                    # Calculate the trial end (7 days before the 2nd delivery)
                    second_delivery_date = calculate_second_delivery_date(plan_to_activate.start_date, plan_to_activate.frequency)
                    trial_end_date = second_delivery_date - timedelta(days=settings.SUBSCRIPTION_CHARGE_LEAD_DAYS)
                    trial_end_timestamp = int(datetime.combine(trial_end_date, time.min).timestamp())
                    
                    # Ensure trial end is in the future
                    if trial_end_timestamp <= datetime.now().timestamp():
                        trial_end_timestamp = int(datetime.now().timestamp() + 60)

                    # Use the payment method from the successful PaymentIntent
                    payment_method_id = payment_intent.get('payment_method')

                    subscription = stripe.Subscription.create(
                        customer=plan_to_activate.user.stripe_customer_id,
                        items=[{
                            "price_data": {
                                "currency": plan_to_activate.currency.lower(),
                                "unit_amount": int(plan_to_activate.total_amount * 100),
                                "product": settings.STRIPE_SUBSCRIPTION_PRODUCT_ID,
                                "recurring": get_recurring_options(plan_to_activate.frequency),
                            }
                        }],
                        trial_end=trial_end_timestamp,
                        default_payment_method=payment_method_id,
                        metadata={
                            'plan_id': plan_to_activate.id,
                            'item_type': 'SUBSCRIPTION_PLAN_RECURRING'
                        }
                    )
                    
                    plan_to_activate.stripe_subscription_id = subscription.id
                    plan_to_activate.save()
                    print(f"Stripe Subscription {subscription.id} created for plan {plan_to_activate.id}.")

            else:
                print(f"Unhandled item_type '{item_type}' in payment_intent.succeeded webhook. No action taken.")

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
            subscription_plan = SubscriptionPlan.objects.select_for_update().get(stripe_subscription_id=subscription_id)
            print(f"Found SubscriptionPlan (PK: {subscription_plan.pk}) for Stripe Subscription ID: {subscription_id}")

            # Create a Payment record for this transaction (idempotent via unique stripe_payment_intent_id)
            payment, created = Payment.objects.get_or_create(
                stripe_payment_intent_id=invoice.get('payment_intent'),
                defaults={
                    'user': subscription_plan.user,
                    'order': subscription_plan.orderbase_ptr,
                    'amount': invoice.get('amount_paid') / 100.0,
                    'status': 'succeeded',
                }
            )
            if created:
                print(f"Created Payment record (PK: {payment.pk}) for invoice.")
            else:
                print(f"Payment record (PK: {payment.pk}) already exists for this invoice. Skipping duplicate.")

            # Process referral commission for subscription payments
            try:
                from partners.utils.commission_utils import process_referral_commission
                process_referral_commission(payment)
            except Exception as e:
                print(f"Error processing referral commission for subscription: {e}")

            # Only create the next Event if the Payment was newly created (idempotency)
            if not created:
                print(f"Payment record (PK: {payment.pk}) already exists for this invoice. Skipping duplicate.")
                return

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
                delivery_date = get_next_delivery_date(subscription_plan)

            if delivery_date is None:
                print(f"WARNING: Could not determine delivery date for SubscriptionPlan (PK: {subscription_plan.pk}). Skipping Event creation.")
                return

            # Create a new Event for the delivery that was just paid for
            if not Event.objects.filter(order=subscription_plan.orderbase_ptr, delivery_date=delivery_date).exists():
                from partners.utils.commission_utils import get_referral_commission_amount
                rec_budget = getattr(subscription_plan, 'budget', None)
                rec_commission_amount = get_referral_commission_amount(rec_budget) if rec_budget else None
                new_event = Event.objects.create(
                    order=subscription_plan.orderbase_ptr,
                    delivery_date=delivery_date,
                    message=subscription_plan.subscription_message,
                    commission_amount=rec_commission_amount,
                )
                create_admin_event_notifications(new_event)
                create_customer_delivery_day_notification(new_event)
                send_admin_payment_notification(invoice.get('payment_intent', ''), order=subscription_plan)
                print(f"Created new Event for recurring delivery on {delivery_date}.")
            else:
                print(f"Event for delivery on {delivery_date} already exists. Skipping duplicate.")

    except SubscriptionPlan.DoesNotExist:
        print(f"CRITICAL ERROR: SubscriptionPlan not found for Stripe Subscription ID: {subscription_id}")
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


def handle_setup_intent_succeeded(setup_intent):
    """
    Handles the setup_intent.succeeded event. This is key for activating subscriptions with trial periods.
    """
    metadata = setup_intent.get('metadata', {})
    plan_id = metadata.get('subscription_plan_id')
    
    if not plan_id:
        print("Webhook received a setup_intent.succeeded event without a subscription_plan_id in metadata. Skipping.")
        return

    print(f"Processing setup_intent.succeeded for SubscriptionPlan: {plan_id}")
    
    try:
        with transaction.atomic():
            plan_to_activate = SubscriptionPlan.objects.get(id=plan_id)
            if plan_to_activate.status == 'active':
                print(f"SubscriptionPlan (PK: {plan_to_activate.pk}) already active. Skipping duplicate webhook.")
                return
            plan_to_activate.status = 'active'
            plan_to_activate.save()
            print(f"Successfully activated SubscriptionPlan (PK: {plan_to_activate.pk})")

    except SubscriptionPlan.DoesNotExist:
        print(f"CRITICAL ERROR: SubscriptionPlan not found for ID: {plan_id}")
    except Exception as e:
        print(f"UNEXPECTED ERROR during setup_intent.succeeded processing for plan {plan_id}: {e}")


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
            plan = SubscriptionPlan.objects.select_for_update().get(
                stripe_subscription_id=subscription_id
            )

            if plan.status == 'cancelled':
                print(f"SubscriptionPlan (PK: {plan.pk}) already cancelled. Skipping.")
                return

            plan.status = 'cancelled'
            plan.save()
            print(f"SubscriptionPlan (PK: {plan.pk}) marked as cancelled via webhook.")

            # Cancel remaining scheduled events and their notifications
            scheduled_events = plan.events.filter(status='scheduled')
            for event in scheduled_events:
                from data_management.models.notification import Notification
                Notification.objects.filter(
                    related_event=event, status='pending'
                ).update(status='cancelled')
                event.status = 'cancelled'
                event.save()

    except SubscriptionPlan.DoesNotExist:
        print(f"SubscriptionPlan not found for Stripe Subscription ID: {subscription_id}. Skipping.")
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


def handle_setup_intent_failed(setup_intent):
    """
    Handles the setup_intent.payment_failed event from Stripe.
    """
    # At this time, we will just log the failure.
    # In a full implementation, you might want to email the user.
    customer_id = setup_intent.get('customer')
    print(f"Processing setup_intent.failed for customer: {customer_id}")
    last_error = setup_intent.get('last_setup_error', {})
    error_message = last_error.get('message', 'No error message provided.')
    print(f"SetupIntent failed for customer {customer_id}. Reason: {error_message}")


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

