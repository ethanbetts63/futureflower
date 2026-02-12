import stripe
from decimal import Decimal
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from events.models import UpfrontPlan
from payments.models import Payment
from events.utils.upfront_price_calc import calculate_final_plan_cost

stripe.api_key = settings.STRIPE_SECRET_KEY


def validate_discount_code_for_payment(user, code_str):
    """Validate a discount code and return (discount_code_obj, error_message)."""
    from partners.models import DiscountCode
    try:
        discount_code = DiscountCode.objects.select_related('partner', 'partner__user').get(
            code__iexact=code_str
        )
    except DiscountCode.DoesNotExist:
        return None, "Invalid discount code."

    if not discount_code.is_active:
        return None, "This discount code is no longer active."
    if discount_code.partner.status != 'active':
        return None, "This discount code is not currently valid."
    if user == discount_code.partner.user:
        return None, "You cannot use your own discount code."
    if Payment.objects.filter(user=user, status='succeeded').exists():
        return None, "Discount codes are only available for first-time customers."

    return discount_code, None


class CreatePaymentIntentView(APIView):
    """
    Creates a Stripe PaymentIntent for various transaction types.
    This view acts as a centralized checkout service for single-delivery payments.
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
            user = request.user
            # Ensure user has a Stripe Customer ID
            if not user.stripe_customer_id:
                customer = stripe.Customer.create(
                    email=user.email,
                    name=user.get_full_name(),
                    metadata={'user_id': user.id}
                )
                user.stripe_customer_id = customer.id
                user.save()

            amount_in_cents = 0
            metadata = {'item_type': item_type}
            order_object = None

            if item_type == 'UPFRONT_PLAN_MODIFY':
                plan_id = details.get('upfront_plan_id')
                upfront_plan = UpfrontPlan.objects.get(id=plan_id, user=request.user)
                order_object = upfront_plan.orderbase_ptr

                new_structure = {
                    'budget': Decimal(details['budget']),
                    'frequency': details['frequency'],
                    'years': int(details['years'])
                }

                server_side_costs = calculate_final_plan_cost(upfront_plan, new_structure)
                final_amount = server_side_costs['amount_owing']

                metadata.update({
                    'plan_id': plan_id,
                    'new_budget': str(new_structure['budget']),
                    'new_years': new_structure['years'],
                    'new_frequency': new_structure['frequency']
                })

            elif item_type == 'UPFRONT_PLAN_NEW':
                plan_id = details.get('upfront_plan_id')
                upfront_plan = UpfrontPlan.objects.get(id=plan_id, user=request.user)
                order_object = upfront_plan.orderbase_ptr
                final_amount = upfront_plan.total_amount
                metadata.update({'plan_id': plan_id})

            else:
                return Response(
                    {"error": f"Invalid item_type for this endpoint: {item_type}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Ensure final_amount is a float or Decimal for calculations
            final_amount = Decimal(final_amount)

            # Handle discount code
            discount_code_str = details.get('discount_code')
            discount_code_obj = None
            if discount_code_str:
                discount_code_obj, error = validate_discount_code_for_payment(user, discount_code_str)
                if error:
                    return Response({"error": error}, status=status.HTTP_400_BAD_REQUEST)

                final_amount -= discount_code_obj.discount_amount
                # Floor at $0.50 for Stripe minimum
                if final_amount < Decimal('0.50'):
                    final_amount = Decimal('0.50')

                metadata['discount_code'] = discount_code_obj.code

                # Set referred_by_partner if not already set
                if not user.referred_by_partner:
                    user.referred_by_partner = discount_code_obj.partner
                    user.save(update_fields=['referred_by_partner'])

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
                customer=user.stripe_customer_id,
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

        except UpfrontPlan.DoesNotExist:
             return Response({"error": "Plan not found or you don't have permission."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # It's good practice to log the exception here
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)