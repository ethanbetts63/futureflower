# foreverflower/events/views/flower_plan_view.py
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from ..models import FlowerPlan, Event
from ..serializers.flower_plan_serializer import FlowerPlanSerializer
from datetime import date, timedelta

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
        Event instances for the new FlowerPlan.
        """
        # First, save the FlowerPlan instance
        flower_plan = serializer.save()

        # Now, create the events based on the plan details
        events_to_create = []
        start_date = date.today()
        # Calculate the interval between deliveries
        interval_days = 365 / flower_plan.deliveries_per_year

        for year in range(flower_plan.number_of_years):
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
