import stripe
from datetime import datetime, timedelta, time
from dateutil.relativedelta import relativedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from events.models import SubscriptionPlan
from payments.utils.subscription_dates import get_recurring_options, calculate_second_delivery_date

stripe.api_key = settings.STRIPE_SECRET_KEY

class CreateSubscriptionView(APIView):
    """
    Creates a Stripe PaymentIntent for the first delivery of a SubscriptionPlan.
    The actual subscription is created via webhook after this initial payment succeeds.
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

            amount_in_cents = int(plan.total_amount * 100)
            
            # Check for an existing pending payment to avoid duplicates
            from payments.models import Payment
            existing_payment = Payment.objects.filter(order=plan.orderbase_ptr, status='pending').first()
            if existing_payment and existing_payment.stripe_payment_intent_id:
                try:
                    payment_intent = stripe.PaymentIntent.retrieve(existing_payment.stripe_payment_intent_id)
                    if payment_intent.amount == amount_in_cents and payment_intent.status == 'requires_payment_method':
                        return Response({'clientSecret': payment_intent.client_secret})
                    # If status is different or amount changed, we'll create a new one
                except stripe.error.StripeError:
                    pass

            # Create the PaymentIntent for the first delivery
            payment_intent = stripe.PaymentIntent.create(
                amount=amount_in_cents,
                currency=plan.currency.lower(),
                customer=user.stripe_customer_id,
                setup_future_usage='off_session',
                automatic_payment_methods={'enabled': True},
                metadata={
                    'plan_id': plan.id,
                    'item_type': 'SUBSCRIPTION_PLAN_NEW'
                }
            )

            # Create a corresponding Payment record
            Payment.objects.create(
                user=request.user,
                order=plan.orderbase_ptr,
                stripe_payment_intent_id=payment_intent.id,
                amount=plan.total_amount,
                status='pending'
            )

            return Response({'clientSecret': payment_intent.client_secret})

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
