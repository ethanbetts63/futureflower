import logging

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
    handle_subscription_deleted,
    handle_account_updated,
    handle_transfer_created,
)

logger = logging.getLogger(__name__)


class StripeWebhookView(APIView):
    """
    Listens for webhook events from Stripe and delegates them to appropriate handlers.
    """
    authentication_classes = []
    permission_classes = [AllowAny]
    throttle_classes = []

    def post(self, request, *args, **kwargs):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        event = None

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except ValueError:
            logger.exception(
                "Stripe webhook rejected: payload was not valid JSON."
            )
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except stripe.error.SignatureVerificationError:
            # Worth being loud and specific. A rejected webhook means the
            # order is never activated even though the customer has been
            # charged, and the usual cause is STRIPE_WEBHOOK_SECRET belonging
            # to a different endpoint or Stripe mode than the events being
            # sent — which is invisible from the outside and looks to the
            # customer like a checkout that silently half-finished.
            logger.error(
                "Stripe webhook rejected: signature verification failed. Check that "
                "STRIPE_WEBHOOK_SECRET matches the signing secret of the endpoint "
                "sending these events, and that both are in the same Stripe mode "
                "(a test-mode secret cannot verify live-mode events). Orders will "
                "not activate until this is fixed."
            )
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if event['type'] == 'payment_intent.succeeded':
            handle_payment_intent_succeeded(event['data']['object'])

        elif event['type'] == 'invoice.payment_succeeded':
            handle_invoice_payment_succeeded(event['data']['object'])

        elif event['type'] == 'payment_intent.payment_failed':
            handle_payment_intent_failed(event['data']['object'])

        elif event['type'] == 'customer.subscription.deleted':
            handle_subscription_deleted(event['data']['object'])

        elif event['type'] == 'account.updated':
            handle_account_updated(event['data']['object'])

        elif event['type'] == 'transfer.created':
            handle_transfer_created(event['data']['object'])

        else:
            logger.warning("Unhandled Stripe webhook event type: %s", event['type'])

        return HttpResponse(status=200)
