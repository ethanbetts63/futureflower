import stripe
from datetime import datetime, timedelta, time
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from events.models import SubscriptionPlan

stripe.api_key = settings.STRIPE_SECRET_KEY

def get_recurring_options(frequency: str) -> dict:
    """Maps plan frequency to Stripe's recurring interval options."""
    mapping = {
        'weekly': {'interval': 'week', 'interval_count': 1},
        'fortnightly': {'interval': 'week', 'interval_count': 2},
        'monthly': {'interval': 'month', 'interval_count': 1},
        'quarterly': {'interval': 'month', 'interval_count': 3},
        'bi-annually': {'interval': 'month', 'interval_count': 6},
        'annually': {'interval': 'year', 'interval_count': 1},
    }
    return mapping.get(frequency)

class CreateSubscriptionView(APIView):
    """
    Creates a Stripe Subscription with a trial period for a given SubscriptionPlan.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        subscription_plan_id = request.data.get('subscription_plan_id')
        if not subscription_plan_id:
            return Response({"error": "subscription_plan_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            plan = SubscriptionPlan.objects.get(id=subscription_plan_id, user=request.user)
        except SubscriptionPlan.DoesNotExist:
            return Response({"error": "SubscriptionPlan not found."}, status=status.HTTP_404_NOT_FOUND)

        if not all([plan.price_per_delivery, plan.price_per_delivery > 0, plan.start_date, plan.frequency]):
            return Response({"error": "Plan is missing price, start date, or frequency."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = request.user
            if not user.stripe_customer_id:
                customer = stripe.Customer.create(
                    email=user.email,
                    name=user.get_full_name(),
                    metadata={'user_id': user.id}
                )
                user.stripe_customer_id = customer.id
                user.save()

            recurring_options = get_recurring_options(plan.frequency)
            if not recurring_options:
                return Response({"error": f"Invalid frequency: {plan.frequency}"}, status=status.HTTP_400_BAD_REQUEST)

            # Trial ends 7 days before the first delivery date
            trial_end_date = plan.start_date - timedelta(days=7)
            trial_end_datetime = datetime.combine(trial_end_date, time.min)
            trial_end_timestamp = int(trial_end_datetime.timestamp())

            # Ensure trial end is in the future
            if trial_end_timestamp <= datetime.now().timestamp():
                return Response({"error": "The calculated start date for billing is in the past. Please select a later delivery date."}, status=status.HTTP_400_BAD_REQUEST)
                
            # Create the subscription using price_data instead of creating a new Price object
            subscription = stripe.Subscription.create(
                customer=user.stripe_customer_id,
                items=[{
                    "price_data": {
                        "currency": plan.currency.lower(),
                        "unit_amount": int(plan.price_per_delivery * 100),
                        "product": settings.STRIPE_SUBSCRIPTION_PRODUCT_ID,
                        "recurring": recurring_options,
                    }
                }],
                trial_end=trial_end_timestamp,
                payment_behavior='default_incomplete',
                payment_settings={'save_default_payment_method': 'on_subscription'},
                expand=['latest_invoice.payment_intent'],
                metadata={
                    'plan_id': plan.id,
                    'item_type': 'SUBSCRIPTION_PLAN_NEW' # Keep for webhook handler logic
                }
            )

            # Save the Stripe subscription ID to our plan immediately
            plan.stripe_subscription_id = subscription.id
            plan.save()
            
            client_secret = None
            if subscription.latest_invoice and subscription.latest_invoice.payment_intent:
                client_secret = subscription.latest_invoice.payment_intent.client_secret
            else:
                # This can happen if the trial is long and Stripe doesn't create a PI immediately
                # However, with default_incomplete, it should. We raise an error if not.
                raise Exception("Stripe did not return a PaymentIntent for the subscription's first invoice.")

            return Response({'clientSecret': client_secret})

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
