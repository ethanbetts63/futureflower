import stripe
from django.conf import settings
from django.db import transaction
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from events.models import OrderBase
from events.serializers import OrderSerializer
from payments.utils.checkout import (
    start_order_payment,
    validate_order_ready_for_payment,
)
from data_management.models.notification import Notification
from payments.utils.send_admin_payment_notification import send_admin_cancellation_notification

stripe.api_key = settings.STRIPE_SECRET_KEY


class OrderViewSet(viewsets.ModelViewSet):
    """
    The single order API: draft creation, editing, converting to recurring,
    checkout, and cancellation.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        return (
            OrderBase.objects
            .filter(user=self.request.user)
            .prefetch_related('events', 'payments')
            .order_by('-created_at')
        )

    @action(detail=False, methods=['get'], url_path='get-or-create-draft')
    @transaction.atomic
    def get_or_create_draft(self, request):
        """
        Return the latest one-time draft, or create one.
        """
        draft = (
            OrderBase.objects
            .filter(user=request.user, status='pending_payment', billing_mode='one_time')
            .order_by('-created_at')
            .first()
        )

        if draft is None:
            draft = OrderBase.objects.create(user=request.user, billing_mode='one_time')

        return Response(self.get_serializer(draft).data)

    @action(detail=True, methods=['post'], url_path='make-recurring')
    @transaction.atomic
    def make_recurring(self, request, pk=None):
        """
        Converts a one-time draft order into a recurring one, in place.
        """
        order = self.get_object()

        frequency = request.data.get('frequency')
        if frequency not in dict(OrderBase.FREQUENCY_CHOICES):
            return Response(
                {'frequency': 'Choose a valid delivery frequency.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        order.make_recurring(frequency, request.data.get('recurring_preferences', ''))

        return Response(self.get_serializer(order).data)

    @action(detail=True, methods=['post'], url_path='checkout')
    def checkout(self, request, pk=None):
        """
        Single checkout entry point for both one-time and recurring orders.
        """
        order = self.get_object()

        problem = validate_order_ready_for_payment(order)
        if problem:
            return Response({'detail': problem}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'clientSecret': start_order_payment(order)})

    @action(detail=True, methods=['post'], url_path='cancel')
    @transaction.atomic
    def cancel(self, request, pk=None):
        """
        Cancels an active order. For recurring orders this also cancels the
        Stripe subscription so no further deliveries are billed.

        Body: { "cancel_type": "keep_current" | "cancel_all" } (defaults to "cancel_all")
        """
        order = self.get_object()

        if order.status != 'active':
            return Response(
                {'error': 'Only active orders can be cancelled.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        cancel_type = request.data.get('cancel_type', 'cancel_all')
        if cancel_type not in ('keep_current', 'cancel_all'):
            return Response(
                {'error': 'cancel_type must be "keep_current" or "cancel_all".'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if order.billing_mode == 'recurring' and order.stripe_subscription_id:
            # Ask Stripe what it thinks first, rather than cancelling and swallowing
            # the error. Blanket-catching InvalidRequestError also hid a bad key or
            # a malformed id, marking the order cancelled here while Stripe happily
            # kept billing it — the one outcome worse than failing loudly.
            subscription = stripe.Subscription.retrieve(order.stripe_subscription_id)
            if subscription.status != 'canceled':
                stripe.Subscription.cancel(order.stripe_subscription_id)

        order.status = 'cancelled'
        order.save()

        upcoming_events = list(order.events.filter(status__in=['scheduled', 'ordered']))
        scheduled_events = [e for e in upcoming_events if e.status == 'scheduled']
        ordered_events = [e for e in upcoming_events if e.status == 'ordered']

        if cancel_type == 'cancel_all' or order.billing_mode != 'recurring':
            events_to_cancel = scheduled_events
        else:
            # keep_current: keep the earliest scheduled event, cancel the rest
            scheduled_sorted = sorted(scheduled_events, key=lambda e: e.delivery_date)
            events_to_cancel = scheduled_sorted[1:]

        for event in events_to_cancel:
            Notification.objects.filter(
                related_event=event, status='pending'
            ).update(status='cancelled')
            event.status = 'cancelled'
            event.save()

        if ordered_events:
            ordered_ids = ', '.join(str(e.id) for e in ordered_events)
            send_admin_cancellation_notification(
                f"User cancelled order {order.id}. "
                f"The following events are already ordered and may require florist contact: {ordered_ids}"
            )

        return Response({'status': 'cancelled'}, status=status.HTTP_200_OK)
