import stripe
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from events.models import FlowerPlan
from payments.models import Payment

# Initialize the Stripe API key once
stripe.api_key = settings.STRIPE_SECRET_KEY

class CreatePaymentIntentView(APIView):
    """
    Creates a Stripe PaymentIntent for a given FlowerPlan.
    This view handles both new plan creations and plan modifications.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        flower_plan_id = request.data.get('flower_plan_id')
        
        # Data for modification, will be null for new plans
        amount_override = request.data.get('amount')
        budget = request.data.get('budget')
        years = request.data.get('years')
        deliveries_per_year = request.data.get('deliveries_per_year')

        if not flower_plan_id:
            return Response(
                {"error": "flower_plan_id is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            flower_plan = FlowerPlan.objects.get(id=flower_plan_id, user=request.user)
        except FlowerPlan.DoesNotExist:
            return Response(
                {"error": "FlowerPlan not found or you don't have permission."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Determine the amount for the payment intent
        if amount_override is not None:
            # Use the amount from the request for modifications
            final_amount = float(amount_override)
        else:
            # Fallback to the plan's total amount for new creations
            final_amount = flower_plan.total_amount

        if not final_amount or final_amount <= 0:
            return Response(
                {"error": "Invalid total amount for the payment intent."},
                status=status.HTTP_400_BAD_REQUEST
            )

        amount_in_cents = int(final_amount * 100)

        try:
            # For modifications, we always create a new payment intent.
            # For new plans, we check for an existing pending payment to avoid duplicates.
            if not flower_plan.is_active:
                existing_payment = Payment.objects.filter(flower_plan=flower_plan, status='pending').first()
                if existing_payment:
                    payment_intent = stripe.PaymentIntent.retrieve(existing_payment.stripe_payment_intent_id)
                    return Response({'clientSecret': payment_intent.client_secret})

            # Define metadata for the payment intent
            metadata = {
                'flower_plan_id': flower_plan.id,
                'user_id': request.user.id,
                # Always include structure data for the webhook
                'budget': budget if budget is not None else flower_plan.budget,
                'years': years if years is not None else flower_plan.years,
                'deliveries_per_year': deliveries_per_year if deliveries_per_year is not None else flower_plan.deliveries_per_year
            }

            # Create a new PaymentIntent with Stripe
            payment_intent = stripe.PaymentIntent.create(
                amount=amount_in_cents,
                currency=flower_plan.currency,
                automatic_payment_methods={'enabled': True},
                metadata=metadata
            )

            # Create a corresponding Payment record in our database
            Payment.objects.create(
                user=request.user,
                flower_plan=flower_plan,
                stripe_payment_intent_id=payment_intent.id,
                amount=final_amount, # Store the actual amount being charged
                status='pending'
            )

            return Response({
                'clientSecret': payment_intent.client_secret
            })

        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )