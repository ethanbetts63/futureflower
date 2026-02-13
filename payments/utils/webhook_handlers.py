# payments/utils/webhook_handlers.py
from datetime import date, timedelta
from decimal import Decimal
from django.conf import settings
from django.db import transaction
from payments.models import Payment
from events.models import UpfrontPlan, SubscriptionPlan, Event
from events.utils.fee_calc import frequency_to_deliveries_per_year
from payments.utils.subscription_dates import get_next_delivery_date

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
                    dc = DiscountCode.objects.get(code__iexact=discount_code_str)
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
                    draft_messages = plan_to_activate.draft_card_messages or {}
                    deliveries_per_year = frequency_to_deliveries_per_year(plan_to_activate.frequency)
                    start = plan_to_activate.start_date or date.today()
                    interval_days = 365 / deliveries_per_year
                    events_to_create = []

                    for year in range(plan_to_activate.years):
                        for i in range(deliveries_per_year):
                            index = year * deliveries_per_year + i
                            days_offset = (year * 365) + (i * interval_days)
                            delivery_date = start + timedelta(days=days_offset)
                            events_to_create.append(
                                Event(
                                    order=plan_to_activate.orderbase_ptr,
                                    delivery_date=delivery_date,
                                    message=draft_messages.get(str(index), ''),
                                )
                            )

                    Event.objects.bulk_create(events_to_create)
                    print(f"Created {len(events_to_create)} Events for UpfrontPlan (PK: {plan_to_activate.pk}).")
                else:
                    print(f"Events for UpfrontPlan (PK: {plan_to_activate.pk}) already exist. Skipping duplicate.")

            else:
                # Note: This handler is now only for upfront payments.
                # Subscription activation is handled by setup_intent.succeeded.
                print(f"Unhandled item_type '{item_type}' in payment_intent.succeeded webhook. No action taken.")

    except Payment.DoesNotExist:
        print(f"CRITICAL ERROR: Payment object not found for PI ID: {payment_intent_id}. The webhook may have arrived before the initial request completed.")
    except UpfrontPlan.DoesNotExist:
        print(f"CRITICAL ERROR: Plan not found for Order ID: {payment.order.id} during webhook processing.")
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
            subscription_plan = SubscriptionPlan.objects.get(stripe_subscription_id=subscription_id)
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
            if created:
                try:
                    from partners.utils.commission_utils import process_referral_commission
                    process_referral_commission(payment)
                except Exception as e:
                    print(f"Error processing referral commission for subscription: {e}")

            # Only create the Event if the Payment was newly created (idempotency)
            if not created:
                return

            # Determine the next delivery date using the drift-free calculation
            next_delivery_date = get_next_delivery_date(subscription_plan)

            if next_delivery_date is None:
                print(f"WARNING: Could not determine next delivery date for SubscriptionPlan (PK: {subscription_plan.pk}). Skipping Event creation.")
                return

            # Create a new Event for the delivery that was just paid for
            if not Event.objects.filter(order=subscription_plan.orderbase_ptr, delivery_date=next_delivery_date).exists():
                Event.objects.create(
                    order=subscription_plan.orderbase_ptr,
                    delivery_date=next_delivery_date,
                    message=subscription_plan.subscription_message
                )
                print(f"Created new Event for delivery on {next_delivery_date}.")
            else:
                print(f"Event for delivery on {next_delivery_date} already exists. Skipping duplicate.")

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

