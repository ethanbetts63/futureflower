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

        print(f"\n--- Stripe Webhook Received ---")
        print(f"Payload: {payload.decode('utf-8')[:200]}...") # Log first 200 chars of payload
        print(f"Signature Header: {sig_header}")

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
            print(f"Webhook event constructed successfully: Type={event['type']}")
        except ValueError as e:
            # Invalid payload
            print(f"ERROR: Invalid webhook payload: {e}")
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except stripe.error.SignatureVerificationError as e:
            # Invalid signature
            print(f"ERROR: Invalid webhook signature: {e}")
            return Response(status=status.HTTP_400_BAD_REQUEST)

        # Handle the event
        if event['type'] == 'payment_intent.succeeded':
            payment_intent = event['data']['object']
            print(f"Processing payment_intent.succeeded for ID: {payment_intent['id']}")
            
            # Find the corresponding Payment in our database
            try:
                payment = Payment.objects.get(stripe_payment_intent_id=payment_intent['id'])
                print(f"Found Payment record (PK: {payment.pk}) for Stripe PaymentIntent ID: {payment_intent['id']}")
                payment.status = 'succeeded'
                payment.save()
                print(f"Payment record (PK: {payment.pk}) status updated to 'succeeded'.")
                
                # Activate the associated FlowerPlan
                if payment.flower_plan:
                    try:
                        flower_plan_to_activate = payment.flower_plan
                        flower_plan_to_activate.is_active = True
                        flower_plan_to_activate.save()
                        print(f"FlowerPlan (PK: {flower_plan_to_activate.pk}) activated (is_active=True).")

                        # Send a notification to the admin
                        send_admin_payment_notification(payment_id=payment.stripe_payment_intent_id)
                        print(f"Admin notification sent for payment: {payment.pk}.")

                    except FlowerPlan.DoesNotExist:
                        # This case is unlikely if the payment has a valid foreign key
                        print(f"CRITICAL ERROR: FlowerPlan (ID: {payment.flower_plan_id}) not found for payment (PK: {payment.pk}).")
                else:
                    print(f"CRITICAL ERROR: Payment (PK: {payment.pk}) succeeded but has no associated FlowerPlan (flower_plan_id is null).")

            except Payment.DoesNotExist:
                print(f"ERROR: Received successful payment intent for non-existent local Payment record ID: {payment_intent['id']}")
            except Exception as e:
                print(f"UNEXPECTED ERROR during payment_intent.succeeded processing for ID {payment_intent['id']}: {e}")

        elif event['type'] == 'payment_intent.payment_failed':
            payment_intent = event['data']['object']
            print(f"Processing payment_intent.payment_failed for ID: {payment_intent['id']}")
            try:
                payment = Payment.objects.get(stripe_payment_intent_id=payment_intent['id'])
                print(f"Found Payment record (PK: {payment.pk}) for Stripe PaymentIntent ID: {payment_intent['id']}")
                payment.status = 'failed'
                payment.save()
                print(f"Payment record (PK: {payment.pk}) status updated to 'failed'.")
            except Payment.DoesNotExist:
                print(f"ERROR: Received failed payment intent for non-existent local Payment record ID: {payment_intent['id']}")
            except Exception as e:
                print(f"UNEXPECTED ERROR during payment_intent.payment_failed processing for ID {payment_intent['id']}: {e}")

        print(f"--- Stripe Webhook Processed. Returning 200 OK. ---\n")
        # Passed signature verification, always return 200 to avoid Stripe retries
        return HttpResponse(status=200)