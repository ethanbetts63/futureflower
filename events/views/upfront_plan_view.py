# futureflower/events/views/upfront_plan_view.py
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from ..models import UpfrontPlan, Event
from ..serializers.upfront_plan_serializer import UpfrontPlanSerializer
from ..utils.upfront_price_calc import forever_flower_upfront_price, calculate_final_plan_cost
from ..utils.fee_calc import frequency_to_deliveries_per_year
from datetime import date, timedelta
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from decimal import Decimal, InvalidOperation

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

    @transaction.atomic
    def perform_create(self, serializer):
        """
        Overrides the default create behavior to also generate all associated
        Event instances for the new UpfrontPlan and calculate the total price.
        """
        # First, save the UpfrontPlan instance
        upfront_plan = serializer.save()

        # --- Calculate and save the total price ---
        upfront_price, _ = forever_flower_upfront_price(
            budget=upfront_plan.budget,
            frequency=upfront_plan.frequency,
            years=upfront_plan.years,
        )
        upfront_plan.total_amount = upfront_price
        upfront_plan.save()

        # --- Create the events based on the plan details ---
        deliveries_per_year = frequency_to_deliveries_per_year(upfront_plan.frequency)
        events_to_create = []
        start_date = upfront_plan.start_date if upfront_plan.start_date else date.today()
        # Calculate the interval between deliveries
        interval_days = 365 / deliveries_per_year

        for year in range(upfront_plan.years):
            for i in range(deliveries_per_year):
                # Calculate the delivery date for this event
                days_offset = (year * 365) + (i * interval_days)
                delivery_date = start_date + timedelta(days=days_offset)
                
                events_to_create.append(
                    Event(
                        order=upfront_plan.orderbase_ptr, # Link event to the base order
                        delivery_date=delivery_date,
                    )
                )
        
        Event.objects.bulk_create(events_to_create)
    
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
