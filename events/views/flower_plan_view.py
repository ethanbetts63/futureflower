# foreverflower/events/views/flower_plan_view.py
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from ..models import FlowerPlan
from ..serializers.flower_plan_serializer import FlowerPlanSerializer

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
