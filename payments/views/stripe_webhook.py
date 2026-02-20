import stripe
from django.conf import settings
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from payments.utils.webhook_handlers import (
    handle_payment_intent_succeeded,
    handle_invoice_payment_succeeded,
    handle_payment_intent_failed,
    handle_setup_intent_succeeded,
    handle_setup_intent_failed,
    handle_subscription_deleted,
    handle_account_updated,
)

class StripeWebhookView(APIView):
    """
    Listens for webhook events from Stripe and delegates them to appropriate handlers.
    """
    authentication_classes = []
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

        # Handle the event by delegating to a specific function
        if event['type'] == 'payment_intent.succeeded':
            handle_payment_intent_succeeded(event['data']['object'])

        elif event['type'] == 'invoice.payment_succeeded':
            handle_invoice_payment_succeeded(event['data']['object'])

        elif event['type'] == 'payment_intent.payment_failed':
            handle_payment_intent_failed(event['data']['object'])

        elif event['type'] == 'setup_intent.succeeded':
            handle_setup_intent_succeeded(event['data']['object'])

        elif event['type'] == 'setup_intent.failed':
            handle_setup_intent_failed(event['data']['object'])

        elif event['type'] == 'customer.subscription.deleted':
            handle_subscription_deleted(event['data']['object'])

        elif event['type'] == 'account.updated':
            handle_account_updated(event['data']['object'])

        else:
            print(f"Unhandled event type {event['type']}")

        return HttpResponse(status=200)