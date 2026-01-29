# payments/utils/webhook_handlers.py
import stripe
from payments.models import Payment
from events.models import UpfrontPlan, SubscriptionPlan, Event
from .send_admin_payment_notification import send_admin_payment_notification
from dateutil.relativedelta import relativedelta

def handle_payment_intent_succeeded(payment_intent):
    """
    Handles the payment_intent.succeeded event from Stripe, primarily for one-time upfront payments.
    """
    metadata = payment_intent.get('metadata', {})
    order_type = metadata.get('order_type')
    plan_id = metadata.get('plan_id')

    print(f"Processing payment_intent.succeeded for {order_type} with ID: {plan_id}")

    if order_type != 'upfront' or not plan_id:
        print(f"Webhook received a payment_intent.succeeded event but it was not for an upfront plan. Skipping. Order Type: {order_type}")
        return

    try:
        payment = Payment.objects.get(stripe_payment_intent_id=payment_intent['id'])
        print(f"Found Payment record (PK: {payment.pk})")
        payment.status = 'succeeded'
        payment.save()
        print(f"Payment record (PK: {payment.pk}) status updated to 'succeeded'.")

        plan_to_update = UpfrontPlan.objects.get(id=plan_id)
        
        new_budget = metadata.get('budget', plan_to_update.budget)
        new_years = metadata.get('years', plan_to_update.years)
        new_deliveries_per_year = metadata.get('deliveries_per_year', plan_to_update.deliveries_per_year)

        plan_to_update.budget = float(new_budget)
        plan_to_update.years = int(new_years)
        plan_to_update.deliveries_per_year = int(new_deliveries_per_year)
        plan_to_update.status = 'active'
        plan_to_update.save()
        print(f"UpfrontPlan (PK: {plan_to_update.pk}) updated and activated.")

        send_admin_payment_notification(payment_id=payment.stripe_payment_intent_id)
        print(f"Admin notification sent for payment: {payment.pk}.")

    except Payment.DoesNotExist:
        print(f"ERROR: Payment.DoesNotExist for Stripe PaymentIntent ID: {payment_intent['id']}")
    except UpfrontPlan.DoesNotExist:
        print(f"CRITICAL ERROR: UpfrontPlan (ID: {plan_id}) not found for payment.")
    except Exception as e:
        print(f"UNEXPECTED ERROR during payment_intent.succeeded processing for UpfrontPlan ID {plan_id}: {e}")

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
            stripe_payment_intent_id=invoice.get('payment_intent'), # Link to the PI of this invoice
            amount=invoice.get('amount_paid') / 100.0,
            status='succeeded'
        )
        print(f"Created Payment record (PK: {payment.pk}) for invoice.")

        # Determine the next delivery date
        last_event = Event.objects.filter(order=subscription_plan.orderbase_ptr).order_by('-delivery_date').first()
        if last_event:
            # Calculate next date based on the last one
            if subscription_plan.frequency == 'monthly':
                next_delivery_date = last_event.delivery_date + relativedelta(months=1)
            elif subscription_plan.frequency == 'quarterly':
                next_delivery_date = last_event.delivery_date + relativedelta(months=3)
            elif subscription_plan.frequency == 'bi-annually':
                next_delivery_date = last_event.delivery_date + relativedelta(months=6)
            elif subscription_plan.frequency == 'annually':
                next_delivery_date = last_event.delivery_date + relativedelta(years=1)
            else:
                print(f"ERROR: Unknown frequency '{subscription_plan.frequency}'")
                return 
        else:
            # This is the first delivery
            next_delivery_date = subscription_plan.start_date

        # Create a new Event for the delivery that was just paid for
        Event.objects.create(
            order=subscription_plan.orderbase_ptr,
            delivery_date=next_delivery_date,
            message=subscription_plan.subscription_message
        )
        print(f"Created new Event for delivery on {next_delivery_date}.")

        # If this is the first payment, activate the subscription
        if invoice.get('billing_reason') == 'subscription_create':
            subscription_plan.status = 'active'
            subscription_plan.save()
            print(f"SubscriptionPlan (PK: {subscription_plan.pk}) status updated to 'active'.")
            send_admin_payment_notification(payment_id=payment.stripe_payment_intent_id)
            print(f"Admin notification sent for new subscription: {subscription_plan.pk}.")

    except SubscriptionPlan.DoesNotExist:
        print(f"CRITICAL ERROR: SubscriptionPlan not found for Stripe Subscription ID: {subscription_id}")
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
