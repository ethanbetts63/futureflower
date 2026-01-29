# payments/utils/webhook_handlers.py
import stripe
from decimal import Decimal
from django.conf import settings
from payments.models import Payment
from users.models import User
from events.models import UpfrontPlan, SubscriptionPlan, Event
from dateutil.relativedelta import relativedelta

def _get_or_create_stripe_customer(user: User, payment_method_id: str) -> str:
    """Gets a Stripe Customer ID or creates one if it doesn't exist."""
    if user.stripe_customer_id:
        # User is already a customer, just attach the new payment method for future use.
        stripe.PaymentMethod.attach(payment_method_id, customer=user.stripe_customer_id)
        stripe.Customer.modify(user.stripe_customer_id, invoice_settings={'default_payment_method': payment_method_id})
        print(f"Attached new payment method to existing Stripe Customer: {user.stripe_customer_id}")
        return user.stripe_customer_id
    
    # Create a new Stripe Customer
    customer = stripe.Customer.create(
        email=user.email,
        name=user.get_full_name(),
        payment_method=payment_method_id,
        invoice_settings={'default_payment_method': payment_method_id},
    )
    user.stripe_customer_id = customer.id
    user.save()
    print(f"Created new Stripe Customer: {customer.id}")
    return customer.id

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
        payment = Payment.objects.get(stripe_payment_intent_id=payment_intent_id)
        payment.status = 'succeeded'
        payment.save()
        print(f"Payment record (PK: {payment.pk}) status updated to 'succeeded'.")
        
        user = payment.user

        # --- Fulfillment Logic ---
        if item_type == 'UPFRONT_PLAN_MODIFY':
            plan_id = metadata['plan_id']
            plan_to_update = UpfrontPlan.objects.get(id=plan_id, user=user)
            
            plan_to_update.budget = Decimal(metadata['new_budget'])
            plan_to_update.years = int(metadata['new_years'])
            plan_to_update.deliveries_per_year = int(metadata['new_deliveries_per_year'])
            plan_to_update.save()
            print(f"UpfrontPlan (PK: {plan_to_update.pk}) successfully modified.")

        elif item_type == 'UPFRONT_PLAN_NEW':
            plan_id = metadata['plan_id']
            plan_to_activate = UpfrontPlan.objects.get(id=plan_id, user=user)
            plan_to_activate.status = 'active'
            plan_to_activate.save()
            print(f"UpfrontPlan (PK: {plan_to_activate.pk}) successfully activated.")

        elif item_type == 'SUBSCRIPTION_PLAN_NEW':
            plan_id = metadata['plan_id']
            stripe_price_id = metadata['stripe_price_id']
            plan_to_activate = SubscriptionPlan.objects.get(id=plan_id, user=user)

            # This payment was for the initial amount. Now, create the recurring subscription.
            payment_method_id = payment_intent.get('payment_method')
            customer_id = _get_or_create_stripe_customer(user, payment_method_id)

            subscription = stripe.Subscription.create(
                customer=customer_id,
                items=[{'price': stripe_price_id}],
                expand=['latest_invoice.payment_intent'],
            )
            
            plan_to_activate.stripe_subscription_id = subscription.id
            plan_to_activate.status = 'active'
            plan_to_activate.save()
            print(f"SubscriptionPlan (PK: {plan_to_activate.pk}) activated with Stripe Subscription ID: {subscription.id}")

        else:
            print(f"Unhandled item_type '{item_type}' in payment_intent.succeeded webhook. No action taken.")
            return # Avoid sending a generic notification for unhandled types

    except Payment.DoesNotExist:
        print(f"ERROR: Payment.DoesNotExist for Stripe PaymentIntent ID: {payment_intent_id}")
    except (UpfrontPlan.DoesNotExist, SubscriptionPlan.DoesNotExist):
        print(f"CRITICAL ERROR: Plan not found for payment. Metadata: {metadata}")
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

        # If this is the first payment since subscription creation, send admin notification.
        # The 'subscription_create' reason is on the PaymentIntent, not subsequent invoices.
        # We rely on the handle_payment_intent_succeeded to fire for the first payment.
        # So we only need to handle recurring payment notifications here if desired.

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
