# foreverflower/events/views/upfront_plan_view.py
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from ..models import UpfrontPlan, Event
from ..serializers.upfront_plan_serializer import UpfrontPlanSerializer
from ..utils.pricing_calculators import forever_flower_upfront_price, calculate_final_plan_cost
from datetime import date, timedelta
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def calculate_plan_modification(request, plan_id):
    """
    Calculates the cost difference for modifying an existing upfront plan.
    """
    try:
        plan = UpfrontPlan.objects.get(pk=plan_id, user=request.user)
    except UpfrontPlan.DoesNotExist:
        return Response({'error': 'Plan not found.'}, status=status.HTTP_404_NOT_FOUND)

    try:
        new_structure = {
            'budget': float(request.data.get('budget')),
            'deliveries_per_year': int(request.data.get('deliveries_per_year')),
            'years': int(request.data.get('years')),
        }
    except (TypeError, ValueError, AttributeError):
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
        This view should only return upfront plans that belong to the
        currently authenticated user.
        """
        return UpfrontPlan.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """
        Overrides the default create behavior to also generate all associated
        Event instances for the new UpfrontPlan and calculate the total price.
        """
        # First, save the UpfrontPlan instance
        upfront_plan = serializer.save()

        # --- Calculate and save the total price ---
        upfront_price, _ = forever_flower_upfront_price(
            budget=float(upfront_plan.budget),
            deliveries_per_year=upfront_plan.deliveries_per_year,
            years=upfront_plan.years,
        )
        upfront_plan.total_amount = upfront_price
        upfront_plan.save()

        # --- Create the events based on the plan details ---
        events_to_create = []
        start_date = upfront_plan.start_date if upfront_plan.start_date else date.today()
        # Calculate the interval between deliveries
        interval_days = 365 / upfront_plan.deliveries_per_year

        for year in range(upfront_plan.years):
            for i in range(upfront_plan.deliveries_per_year):
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
