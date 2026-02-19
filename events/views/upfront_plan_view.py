# futureflower/events/views/upfront_plan_view.py
import logging
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from ..models import UpfrontPlan
from ..serializers.upfront_plan_serializer import UpfrontPlanSerializer
from ..utils.upfront_price_calc import forever_flower_upfront_price, calculate_final_plan_cost
from ..utils.delivery_dates import calculate_projected_delivery_dates
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework import status
from decimal import Decimal, InvalidOperation
from data_management.models.notification import Notification
from payments.utils.send_admin_payment_notification import send_admin_cancellation_notification

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def calc_upfront_price_for_plan(request, plan_id):
    """
    Calculates the cost difference for modifying an existing upfront plan.
    """
    try:
        plan = UpfrontPlan.objects.get(pk=plan_id, user=request.user)
    except UpfrontPlan.DoesNotExist:
        return Response({'error': 'Plan not found.'}, status=status.HTTP_404_NOT_FOUND)

    try:
        new_structure = {
            'budget': Decimal(request.data.get('budget')),
            'frequency': request.data.get('frequency'),
            'years': int(request.data.get('years')),
        }
    except (InvalidOperation, TypeError, ValueError, AttributeError):
        return Response(
            {'error': 'Invalid input. Please provide valid numbers for all fields.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Basic validation
    if not all(new_structure.values()):
        return Response(
            {'error': 'Missing one or more required fields.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    result = calculate_final_plan_cost(plan, new_structure)
    return Response(result, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_latest_pending_upfront_plan(request):
    """
    Retrieves the most recent upfront plan for the authenticated user
    that is pending payment.
    """
    user = request.user
    pending_plan = UpfrontPlan.objects.filter(user=user, status='pending_payment').order_by('-created_at').first()

    if pending_plan:
        serializer = UpfrontPlanSerializer(pending_plan)
        return Response(serializer.data)
    else:
        # Per user request, return null with a 200 OK status
        return Response(None)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_projected_deliveries(request, plan_id):
    """
    Returns the projected delivery dates for an upfront plan,
    calculated from its start_date, frequency, and years.
    """
    try:
        plan = UpfrontPlan.objects.get(pk=plan_id, user=request.user)
    except UpfrontPlan.DoesNotExist:
        return Response({'error': 'Plan not found.'}, status=status.HTTP_404_NOT_FOUND)

    projected = calculate_projected_delivery_dates(
        plan.start_date, plan.frequency, plan.years
    )
    return Response([
        {"index": d["index"], "date": d["date"].isoformat()}
        for d in projected
    ])


class UpfrontPlanViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows upfront plans to be viewed or edited.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = UpfrontPlanSerializer

    def get_queryset(self):
        """
        Returns upfront plans for the authenticated user.
        Supports query param filtering:
        - ?years=1&frequency=annually  → only single delivery plans
        - ?exclude_single_delivery=true   → exclude single delivery plans
        """
        qs = UpfrontPlan.objects.filter(user=self.request.user)

        exclude_single = self.request.query_params.get('exclude_single_delivery')
        if exclude_single == 'true':
            qs = qs.exclude(years=1, frequency='annually')
        else:
            years = self.request.query_params.get('years')
            frequency = self.request.query_params.get('frequency')
            if years is not None:
                qs = qs.filter(years=int(years))
            if frequency is not None:
                qs = qs.filter(frequency=frequency)

        return qs

    @action(detail=True, methods=['post'], url_path='cancel')
    @transaction.atomic
    def cancel(self, request, pk=None):
        """
        Cancels an active upfront plan.
        """
        try:
            plan = UpfrontPlan.objects.get(pk=pk, user=request.user)
        except UpfrontPlan.DoesNotExist:
            return Response({'error': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

        if plan.status != 'active':
            return Response(
                {'error': 'Only active plans can be cancelled.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        plan.status = 'cancelled'
        plan.save()

        # Cancel all scheduled events and their pending notifications
        scheduled_events = list(plan.events.filter(status='scheduled'))
        for event in scheduled_events:
            Notification.objects.filter(
                related_event=event, status='pending'
            ).update(status='cancelled')
            event.status = 'cancelled'
            event.save()

        # Notify admin if any ordered events exist
        ordered_events = list(plan.events.filter(status='ordered'))
        if ordered_events:
            ordered_ids = ', '.join(str(e.id) for e in ordered_events)
            send_admin_cancellation_notification(
                f"User cancelled upfront plan {plan.id}. "
                f"The following events are already ordered and may require florist contact: {ordered_ids}"
            )

        return Response({'status': 'cancelled'}, status=status.HTTP_200_OK)

    @transaction.atomic
    def perform_create(self, serializer):
        """
        Overrides the default create behavior to calculate the total price.
        Events are NOT created here — they are created after payment in the webhook handler.
        """
        upfront_plan = serializer.save()

        upfront_price, _ = forever_flower_upfront_price(
            budget=upfront_plan.budget,
            frequency=upfront_plan.frequency,
            years=upfront_plan.years,
        )
        upfront_plan.subtotal = upfront_price
        upfront_plan.save()
    
    def partial_update(self, request, *args, **kwargs):
        """
        Custom partial_update to include server-side validation for total_amount.
        """
        if 'total_amount' in request.data:
            client_provided_total_amount = Decimal(str(request.data['total_amount']))

            required_fields = ['budget', 'frequency', 'years']
            if not all(field in request.data for field in required_fields):
                return Response(
                    {"error": "Budget, frequency, and years are required for total_amount validation."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                # Use request data for recalculation, ensuring they are valid numbers
                new_structure_budget = Decimal(request.data['budget'])
                new_structure_frequency = request.data['frequency']
                new_structure_years = int(request.data['years'])
            except (InvalidOperation, ValueError, TypeError):
                 return Response(
                    {"error": "Invalid data types for budget, frequency, or years."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            server_calculated_total_price, _ = forever_flower_upfront_price(
                budget=new_structure_budget,
                frequency=new_structure_frequency,
                years=new_structure_years,
            )
            
            # Compare with client-provided amount
            if abs(server_calculated_total_price - client_provided_total_amount) > Decimal('0.01'):
                return Response(
                    {"error": f"Price mismatch. Server calculated: {server_calculated_total_price}, Client provided: {client_provided_total_amount}."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return super().partial_update(request, *args, **kwargs)
