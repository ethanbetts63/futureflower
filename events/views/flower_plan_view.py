# foreverflower/events/views/flower_plan_view.py
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from ..models import FlowerPlan, Event
from ..serializers.flower_plan_serializer import FlowerPlanSerializer
from ..utils.pricing_calculators import forever_flower_upfront_price, calculate_final_plan_cost
from datetime import date, timedelta
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def calculate_plan_modification(request, plan_id):
    """
    Calculates the cost difference for modifying an existing flower plan.
    """
    try:
        plan = FlowerPlan.objects.get(pk=plan_id, user=request.user)
    except FlowerPlan.DoesNotExist:
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
def get_latest_inactive_flower_plan(request):
    """
    Retrieves the most recent flower plan for the authenticated user
    that is not yet active.
    """
    user = request.user
    inactive_plan = FlowerPlan.objects.filter(user=user, is_active=False).order_by('-created_at').first()

    if inactive_plan:
        serializer = FlowerPlanSerializer(inactive_plan)
        return Response(serializer.data)
    else:
        # Per user request, return null with a 200 OK status
        return Response(None)


class FlowerPlanViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows flower plans to be viewed or edited.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = FlowerPlanSerializer

    def get_queryset(self):
        """
        This view should only return flower plans that belong to the
        currently authenticated user.
        """
        return FlowerPlan.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """
        Overrides the default create behavior to also generate all associated
        Event instances for the new FlowerPlan and calculate the total price.
        """
        # First, save the FlowerPlan instance
        flower_plan = serializer.save()

        # --- Calculate and save the total price ---
        upfront_price, _ = forever_flower_upfront_price(
            budget=float(flower_plan.budget),
            deliveries_per_year=flower_plan.deliveries_per_year,
            years=flower_plan.years,
        )
        flower_plan.total_amount = upfront_price
        flower_plan.save()

        # --- Create the events based on the plan details ---
        events_to_create = []
        start_date = date.today()
        # Calculate the interval between deliveries
        interval_days = 365 / flower_plan.deliveries_per_year

        for year in range(flower_plan.years):
            for i in range(flower_plan.deliveries_per_year):
                # Calculate the delivery date for this event
                days_offset = (year * 365) + (i * interval_days)
                delivery_date = start_date + timedelta(days=days_offset)
                
                events_to_create.append(
                    Event(
                        flower_plan=flower_plan,
                        delivery_date=delivery_date,
                    )
                )
        
        Event.objects.bulk_create(events_to_create)
