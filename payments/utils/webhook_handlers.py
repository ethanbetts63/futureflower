# payments/utils/webhook_handlers.py
import stripe
from decimal import Decimal
from django.conf import settings
from payments.models import Payment
from users.models import User
from events.models import UpfrontPlan, SubscriptionPlan, Event
from dateutil.relativedelta import relativedelta

def handle_payment_intent_succeeded(payment_intent):
    """
    Handles the payment_intent.succeeded event from Stripe for various one-time payments.
    This is the fulfillment step of the checkout.
    """
    metadata = payment_intent.get('metadata', {})
    item_type = metadata.get('item_type')
    payment_intent_id = payment_intent['id']

    print(f"Processing payment_intent.succeeded for item_type: {item_type} (PI: {payment_intent_id})")

    if not item_type:
        print("Webhook received a payment_intent.succeeded event without an item_type. Skipping.")
        return

    try:
        # The payment record might not exist yet if this is the first payment of a subscription
        # created via CreateSubscriptionView. We use get_or_create.
        payment, created = Payment.objects.get_or_create(
            stripe_payment_intent_id=payment_intent_id,
            defaults={
                'user': User.objects.get(id=metadata['user_id']),
                'order': SubscriptionPlan.objects.get(id=metadata['plan_id']).orderbase_ptr if 'plan_id' in metadata else None,
                'amount': payment_intent['amount'] / 100.0,
                'status': 'pending'
            }
        )
        payment.status = 'succeeded'
        payment.save()
        print(f"Payment record (PK: {payment.pk}) status updated to 'succeeded'.")
        
        # --- Fulfillment Logic ---
        if item_type == 'UPFRONT_PLAN_MODIFY':
            plan_id = metadata['plan_id']
            plan_to_update = UpfrontPlan.objects.get(id=plan_id, user=payment.user)
            
            plan_to_update.budget = Decimal(metadata['new_budget'])
            plan_to_update.years = int(metadata['new_years'])
            plan_to_update.deliveries_per_year = int(metadata['new_deliveries_per_year'])
            plan_to_update.save()
            print(f"UpfrontPlan (PK: {plan_to_update.pk}) successfully modified.")

        elif item_type == 'UPFRONT_PLAN_NEW':
            plan_id = metadata['plan_id']
            plan_to_activate = UpfrontPlan.objects.get(id=plan_id, user=payment.user)
            plan_to_activate.status = 'active'
            plan_to_activate.save()
            print(f"UpfrontPlan (PK: {plan_to_activate.pk}) successfully activated.")

        elif item_type == 'SUBSCRIPTION_PLAN_NEW':
            # This is the first payment for a new subscription. The subscription was already created.
            # We just need to activate the plan in our system.
            plan_id = metadata['plan_id']
            plan_to_activate = SubscriptionPlan.objects.get(id=plan_id, user=payment.user)
            plan_to_activate.status = 'active'
            plan_to_activate.save()
            print(f"SubscriptionPlan (PK: {plan_to_activate.pk}) successfully activated.")

        else:
            print(f"Unhandled item_type '{item_type}' in payment_intent.succeeded webhook. No action taken.")

    except (Payment.DoesNotExist, UpfrontPlan.DoesNotExist, SubscriptionPlan.DoesNotExist, User.DoesNotExist) as e:
        print(f"CRITICAL ERROR: Model not found during webhook processing. PI ID: {payment_intent_id}. Error: {e}")
    except Exception as e:
        print(f"UNEXPECTED ERROR during payment_intent.succeeded processing. PI ID: {payment_intent_id}, Error: {e}")


def get_next_delivery_date(plan: SubscriptionPlan, last_event_date: datetime.date) -> datetime.date:
    """Calculates the next delivery date based on frequency."""
    frequency_map = {
        'weekly': relativedelta(weeks=1),
        'fortnightly': relativedelta(weeks=2),
        'monthly': relativedelta(months=1),
        'quarterly': relativedelta(months=3),
        'bi-annually': relativedelta(months=6),
        'annually': relativedelta(years=1),
    }
    delta = frequency_map.get(plan.frequency)
    if delta:
        return last_event_date + delta
    raise ValueError(f"Unknown frequency: {plan.frequency}")


def handle_invoice_payment_succeeded(invoice):
    """
    Handles the invoice.payment_succeeded event from Stripe for recurring subscription payments.
    """
    subscription_id = invoice.get('subscription')
    if not subscription_id:
        print("Webhook received an invoice.payment_succeeded event without a subscription ID. Skipping.")
        return

    try:
        subscription_plan = SubscriptionPlan.objects.get(stripe_subscription_id=subscription_id)
        print(f"Found SubscriptionPlan (PK: {subscription_plan.pk}) for Stripe Subscription ID: {subscription_id}")
        
        # Create a Payment record for this transaction
        payment = Payment.objects.create(
            user=subscription_plan.user,
            order=subscription_plan.orderbase_ptr,
            stripe_payment_intent_id=invoice.get('payment_intent'),
            amount=invoice.get('amount_paid') / 100.0,
            status='succeeded'
        )
        print(f"Created Payment record (PK: {payment.pk}) for invoice.")

        # Determine the next delivery date
        last_event = Event.objects.filter(order=subscription_plan.orderbase_ptr).order_by('-delivery_date').first()
        
        # The 'start_date' for the plan IS the first delivery date.
        # If no events exist, the delivery date is the plan's start_date.
        # If events exist, calculate the next one based on the last.
        if last_event:
            next_delivery_date = get_next_delivery_date(subscription_plan, last_event.delivery_date)
        else:
            next_delivery_date = subscription_plan.start_date

        # Create a new Event for the delivery that was just paid for
        Event.objects.create(
            order=subscription_plan.orderbase_ptr,
            delivery_date=next_delivery_date,
            message=subscription_plan.subscription_message
        )
        print(f"Created new Event for delivery on {next_delivery_date}.")

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
