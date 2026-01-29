import stripe
from decimal import Decimal
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from events.models import UpfrontPlan, SubscriptionPlan
from payments.models import Payment
from events.utils.upfront_price_calc import calculate_final_plan_cost

stripe.api_key = settings.STRIPE_SECRET_KEY

class CreatePaymentIntentView(APIView):
    """
    Creates a Stripe PaymentIntent for various transaction types.
    This view acts as a centralized checkout service.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        item_type = request.data.get('item_type')
        details = request.data.get('details')

        if not item_type or not details:
            return Response(
                {"error": "item_type and details are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            amount_in_cents = 0
            metadata = {'item_type': item_type}
            order_object = None

            if item_type == 'UPFRONT_PLAN_MODIFY':
                plan_id = details.get('upfront_plan_id')
                upfront_plan = UpfrontPlan.objects.get(id=plan_id, user=request.user)
                order_object = upfront_plan.orderbase_ptr
                
                new_structure = {
                    'budget': Decimal(details['budget']),
                    'deliveries_per_year': int(details['deliveries_per_year']),
                    'years': int(details['years'])
                }
                
                server_side_costs = calculate_final_plan_cost(upfront_plan, new_structure)
                final_amount = server_side_costs['amount_owing']
                
                metadata.update({
                    'plan_id': plan_id,
                    'new_budget': str(new_structure['budget']),
                    'new_years': new_structure['years'],
                    'new_deliveries_per_year': new_structure['deliveries_per_year']
                })

            elif item_type == 'UPFRONT_PLAN_NEW':
                plan_id = details.get('upfront_plan_id')
                upfront_plan = UpfrontPlan.objects.get(id=plan_id, user=request.user)
                order_object = upfront_plan.orderbase_ptr
                final_amount = upfront_plan.total_amount
                metadata.update({'plan_id': plan_id})

            elif item_type == 'SUBSCRIPTION_PLAN_NEW':
                plan_id = details.get('subscription_plan_id')
                subscription_plan = SubscriptionPlan.objects.get(id=plan_id, user=request.user)
                order_object = subscription_plan.orderbase_ptr
                # For subscriptions, the initial payment could be a setup fee or first month.
                # Assuming the plan's 'price' field stores this initial amount.
                final_amount = subscription_plan.price
                metadata.update({
                    'plan_id': plan_id,
                    'stripe_price_id': details.get('stripe_price_id') # Must be passed from frontend
                })

            else:
                return Response(
                    {"error": f"Invalid item_type: {item_type}"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Ensure final_amount is a float or Decimal for calculations
            final_amount = Decimal(final_amount)

            if final_amount < 0:
                return Response(
                    {"error": "Invalid total amount for the payment intent."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            amount_in_cents = int(final_amount * 100)

            # For new plans, check for an existing pending payment to avoid duplicates
            if 'NEW' in item_type:
                 existing_payment = Payment.objects.filter(order=order_object, status='pending').first()
                 if existing_payment and existing_payment.stripe_payment_intent_id:
                    try:
                        payment_intent = stripe.PaymentIntent.retrieve(existing_payment.stripe_payment_intent_id)
                        # Only reuse if the amount is the same. If not, cancel old and create new.
                        if payment_intent.amount == amount_in_cents:
                            return Response({'clientSecret': payment_intent.client_secret})
                        else:
                            stripe.PaymentIntent.cancel(existing_payment.stripe_payment_intent_id)
                            existing_payment.delete()
                    except stripe.error.StripeError:
                        # The old payment intent might be invalid, proceed to create a new one
                        existing_payment.delete()
            
            # Create a new PaymentIntent with Stripe
            payment_intent = stripe.PaymentIntent.create(
                amount=amount_in_cents,
                currency=order_object.currency, # Assumes currency is on the base order model
                automatic_payment_methods={'enabled': True},
                metadata=metadata
            )

            # Create a corresponding Payment record in our database
            Payment.objects.create(
                user=request.user,
                order=order_object,
                stripe_payment_intent_id=payment_intent.id,
                amount=final_amount,
                status='pending'
            )

            return Response({'clientSecret': payment_intent.client_secret})

        except (UpfrontPlan.DoesNotExist, SubscriptionPlan.DoesNotExist):
             return Response({"error": "Plan not found or you don't have permission."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # It's good practice to log the exception here
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)