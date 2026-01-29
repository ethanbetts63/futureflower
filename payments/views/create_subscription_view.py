# payments/views/create_subscription_view.py
import stripe
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from events.models import SubscriptionPlan
from users.models import User
from payments.models import Payment

stripe.api_key = settings.STRIPE_SECRET_KEY

class CreateSubscriptionView(APIView):
    """
    Creates a Stripe Subscription for a given SubscriptionPlan.
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

        if not plan.price_per_delivery or plan.price_per_delivery <= 0:
            return Response({"error": "Invalid price for subscription."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = request.user
            # Find or create a Stripe Customer
            if user.stripe_customer_id:
                customer = stripe.Customer.retrieve(user.stripe_customer_id)
            else:
                customer = stripe.Customer.create(
                    email=user.email,
                    name=f"{user.first_name} {user.last_name}",
                    metadata={'user_id': user.id}
                )
                user.stripe_customer_id = customer.id
                user.save()

            # Create a Product and Price for this specific plan's details
            product = stripe.Product.create(name=f"ForeverFlower Subscription for {user.email}")
            price = stripe.Price.create(
                product=product.id,
                unit_amount=int(plan.price_per_delivery * 100),
                currency=plan.currency.lower(),
                recurring={"interval": "month" if plan.frequency == "monthly" else "year", "interval_count": 1}, # Simplified for now
            )

            # Create the subscription
            subscription = stripe.Subscription.create(
                customer=customer.id,
                items=[{"price": price.id}],
                payment_behavior='default_incomplete',
                payment_settings={'save_default_payment_method': 'on_subscription'},
                expand=['latest_invoice.payment_intent'],
                metadata={
                    'order_type': 'subscription',
                    'plan_id': plan.id
                }
            )

            # Save the Stripe subscription ID to our plan
            plan.stripe_subscription_id = subscription.id
            plan.save()
            
            # The client secret for the first payment
            client_secret = subscription.latest_invoice.payment_intent.client_secret

            return Response({'clientSecret': client_secret})

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
