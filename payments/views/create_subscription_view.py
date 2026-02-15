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
        if not settings.STRIPE_SUBSCRIPTION_PRODUCT_ID:
            return Response({"error": "STRIPE_SUBSCRIPTION_PRODUCT_ID is not configured in Django settings."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        subscription_plan_id = request.data.get('subscription_plan_id')
        if not subscription_plan_id:
            return Response({"error": "subscription_plan_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            plan = SubscriptionPlan.objects.get(id=subscription_plan_id, user=request.user)
        except SubscriptionPlan.DoesNotExist:
            return Response({"error": "SubscriptionPlan not found."}, status=status.HTTP_404_NOT_FOUND)

        if not all([plan.total_amount, plan.total_amount > 0, plan.start_date, plan.frequency]):
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

            # Trial ends based on the setting days before the first delivery date
            trial_end_date = plan.start_date - timedelta(days=settings.SUBSCRIPTION_CHARGE_LEAD_DAYS)
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
                        "unit_amount": int(plan.total_amount * 100),
                        "product": settings.STRIPE_SUBSCRIPTION_PRODUCT_ID,
                        "recurring": recurring_options,
                    }
                }],
                trial_end=trial_end_timestamp,
                payment_behavior='default_incomplete',
                payment_settings={'save_default_payment_method': 'on_subscription'},
                metadata={
                    'plan_id': plan.id,
                    'item_type': 'SUBSCRIPTION_PLAN_NEW'
                }
            )

            # Save the Stripe subscription ID to our plan immediately
            plan.stripe_subscription_id = subscription.id
            plan.save()
            
            client_secret = None
            if subscription.pending_setup_intent:
                # The pending_setup_intent is an ID string, so we need to retrieve the full object
                setup_intent = stripe.SetupIntent.retrieve(subscription.pending_setup_intent)
                
                # Add metadata to the SetupIntent to link it to our local plan
                stripe.SetupIntent.modify(
                    setup_intent.id,
                    metadata={'subscription_plan_id': plan.id}
                )
                
                client_secret = setup_intent.client_secret
            
            if not client_secret:
                raise Exception("Stripe did not return a client_secret for a pending SetupIntent.")

            return Response({'clientSecret': client_secret})

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
