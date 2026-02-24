import logging
import stripe
from decimal import Decimal, InvalidOperation
from django.conf import settings
from django.db import transaction
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from events.models import SubscriptionPlan
from events.serializers import SubscriptionPlanSerializer
from events.utils.fee_calc import calculate_service_fee
from data_management.models.notification import Notification
from payments.utils.send_admin_payment_notification import send_admin_cancellation_notification

logger = logging.getLogger(__name__)

class SubscriptionPlanViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Subscription Plans.
    """
    queryset = SubscriptionPlan.objects.all()
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [IsAuthenticated]

    def _calculate_total_amount(self, budget: Decimal) -> Decimal:
        """
        Calculates the total amount (budget + fee) per delivery for a subscription plan.
        """
        fee = calculate_service_fee(budget)
        total_amount = budget + fee

        return total_amount.quantize(Decimal('0.01'))

    def get_queryset(self):
        """
        Ensures that users can only see their own subscription plans.
        """
        return self.queryset.filter(user=self.request.user)

    @action(detail=True, methods=['post'], url_path='cancel')
    @transaction.atomic
    def cancel(self, request, pk=None):
        """
        Cancels an active subscription plan.
        Body: { "cancel_type": "keep_current" | "cancel_all" }
        """
        plan = self.get_object()

        if plan.user != request.user:
            return Response({'error': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

        if plan.status != 'active':
            return Response(
                {'error': 'Only active plans can be cancelled.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        cancel_type = request.data.get('cancel_type')
        if cancel_type not in ('keep_current', 'cancel_all'):
            return Response(
                {'error': 'cancel_type must be "keep_current" or "cancel_all".'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Cancel the Stripe subscription
        if plan.stripe_subscription_id:
            stripe.api_key = settings.STRIPE_SECRET_KEY
            try:
                stripe.Subscription.cancel(plan.stripe_subscription_id)
            except stripe.error.InvalidRequestError:
                pass  # Already cancelled on Stripe side

        plan.status = 'cancelled'
        plan.save()

        # Get upcoming events
        upcoming_events = list(plan.events.filter(status__in=['scheduled', 'ordered']))
        scheduled_events = [e for e in upcoming_events if e.status == 'scheduled']
        ordered_events = [e for e in upcoming_events if e.status == 'ordered']

        if cancel_type == 'cancel_all':
            events_to_cancel = scheduled_events
        else:
            # keep_current: keep the earliest scheduled event, cancel the rest
            scheduled_events_sorted = sorted(scheduled_events, key=lambda e: e.delivery_date)
            events_to_cancel = scheduled_events_sorted[1:]  # skip the earliest

        for event in events_to_cancel:
            Notification.objects.filter(
                related_event=event, status='pending'
            ).update(status='cancelled')
            event.status = 'cancelled'
            event.save()

        # Notify admin if any ordered events exist
        if ordered_events:
            ordered_ids = ', '.join(str(e.id) for e in ordered_events)
            send_admin_cancellation_notification(
                f"User cancelled subscription plan {plan.id}. "
                f"The following events are already ordered and may require florist contact: {ordered_ids}"
            )

        return Response({'status': 'cancelled'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='get-or-create-pending')
    def get_or_create_pending(self, request):
        """
        Gets an existing pending subscription plan for the user, or creates one if none exists.
        A user should only have one pending plan at a time.
        """
        plan, created = SubscriptionPlan.objects.get_or_create(
            user=request.user,
            status='pending_payment'
        )
        serializer = self.get_serializer(plan)
        status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(serializer.data, status=status_code)

    @action(detail=True, methods=['post'], url_path='calculate-price')
    def calculate_price(self, request, pk=None):
        """
        Calculates the total amount per delivery for a subscription plan based on a given budget.
        """
        budget_str = request.data.get('budget')

        if budget_str is None:
            return Response({'error': 'Budget is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            budget = Decimal(budget_str)
        except (InvalidOperation, TypeError):
            return Response({'error': 'Invalid budget format.'}, status=status.HTTP_400_BAD_REQUEST)

        total_amount = self._calculate_total_amount(budget)

        return Response({'total_amount': total_amount}, status=status.HTTP_200_OK)
