import stripe
from django.conf import settings
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from rest_framework.permissions import AllowAny
from payments.models import Payment
from events.models import FlowerPlan
from payments.utils.send_admin_payment_notification import send_admin_payment_notification

class StripeWebhookView(APIView):
    """
    Listens for webhook events from Stripe.
    This view is responsible for handling payment confirmations and updating
    the payment status and activating the associated FlowerPlan.
    """
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        event = None

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except ValueError as e:
            # Invalid payload
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except stripe.error.SignatureVerificationError as e:
            # Invalid signature
            return Response(status=status.HTTP_400_BAD_REQUEST)

        # Handle the event
        if event['type'] == 'payment_intent.succeeded':
            payment_intent = event['data']['object']
            
            # Find the corresponding Payment in our database
            try:
                payment = Payment.objects.get(stripe_payment_intent_id=payment_intent['id'])
                payment.status = 'succeeded'
                payment.save()
                
                # Activate the associated FlowerPlan
                if payment.flower_plan:
                    try:
                        flower_plan_to_activate = payment.flower_plan
                        flower_plan_to_activate.is_active = True
                        flower_plan_to_activate.save()

                        # Send a notification to the admin
                        send_admin_payment_notification(payment_id=payment.stripe_payment_intent_id)

                    except FlowerPlan.DoesNotExist:
                        # This case is unlikely if the payment has a valid foreign key
                        print(f"CRITICAL ERROR: FlowerPlan with ID {payment.flower_plan.id} not found for payment {payment.id}.")
                        return HttpResponse(status=200)
                else:
                    print(f"CRITICAL ERROR: Payment {payment.id} succeeded but has no associated FlowerPlan.")

            except Payment.DoesNotExist:
                print(f"Error: Received successful payment intent for non-existent charge ID: {payment_intent['id']}")
                return HttpResponse(status=200)

        elif event['type'] == 'payment_intent.payment_failed':
            payment_intent = event['data']['object']
            try:
                payment = Payment.objects.get(stripe_payment_intent_id=payment_intent['id'])
                payment.status = 'failed'
                payment.save()
            except Payment.DoesNotExist:
                print(f"Error: Received failed payment intent for non-existent charge ID: {payment_intent['id']}")
                return HttpResponse(status=200)

        # Passed signature verification
        return HttpResponse(status=200)