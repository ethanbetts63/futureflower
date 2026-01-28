import stripe
from django.conf import settings
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from rest_framework.permissions import AllowAny
from payments.models import Payment
from events.models import UpfrontPlan
from payments.utils.send_admin_payment_notification import send_admin_payment_notification

class StripeWebhookView(APIView):
    """
    Listens for webhook events from Stripe.
    This view is responsible for handling payment confirmations and updating
    the payment status and activating the associated UpfrontPlan.
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
            metadata = payment_intent.get('metadata', {})
            upfront_plan_id = metadata.get('upfront_plan_id')

            print(f"Processing payment_intent.succeeded for UpfrontPlan ID: {upfront_plan_id}")

            if not upfront_plan_id:
                print(f"CRITICAL ERROR: 'upfront_plan_id' not found in metadata for PaymentIntent ID: {payment_intent['id']}")
                return HttpResponse(status=200) # Return 200 to prevent Stripe retries

            try:
                # Find the corresponding Payment record
                payment = Payment.objects.get(stripe_payment_intent_id=payment_intent['id'])
                print(f"Found Payment record (PK: {payment.pk}) for Stripe PaymentIntent ID: {payment_intent['id']}")
                payment.status = 'succeeded'
                payment.save()
                print(f"Payment record (PK: {payment.pk}) status updated to 'succeeded'.")

                # Fetch the UpfrontPlan to update it
                plan_to_update = UpfrontPlan.objects.get(id=upfront_plan_id)
                
                # Get new structure from metadata, with fallbacks to the plan's current state
                new_budget = metadata.get('budget', plan_to_update.budget)
                new_years = metadata.get('years', plan_to_update.years)
                new_deliveries_per_year = metadata.get('deliveries_per_year', plan_to_update.deliveries_per_year)

                # Universal update logic
                plan_to_update.budget = float(new_budget)
                plan_to_update.years = int(new_years)
                plan_to_update.deliveries_per_year = int(new_deliveries_per_year)
                plan_to_update.status = 'active' # Activate the plan using the new status field

                plan_to_update.save()
                print(f"UpfrontPlan (PK: {plan_to_update.pk}) updated and activated.")
                print(f"  - Budget: {plan_to_update.budget}")
                print(f"  - Years: {plan_to_update.years}")
                print(f"  - Deliveries/Year: {plan_to_update.deliveries_per_year}")
                print(f"  - Status: {plan_to_update.status}")


                # Send a notification to the admin
                send_admin_payment_notification(payment_id=payment.stripe_payment_intent_id)
                print(f"Admin notification sent for payment: {payment.pk}.")

            except Payment.DoesNotExist:
                print(f"ERROR: Received successful payment intent for non-existent local Payment record ID: {payment_intent['id']}")
            except UpfrontPlan.DoesNotExist:
                print(f"CRITICAL ERROR: UpfrontPlan (ID: {upfront_plan_id}) not found for payment (PK: {payment.pk}).")
            except Exception as e:
                print(f"UNEXPECTED ERROR during payment_intent.succeeded processing for UpfrontPlan ID {upfront_plan_id}: {e}")


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