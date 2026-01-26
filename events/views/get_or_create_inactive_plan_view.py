from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from events.models import FlowerPlan
from events.serializers import FlowerPlanSerializer

class GetOrCreateInactivePlanView(APIView):
    """
    Retrieves the latest inactive flower plan for the authenticated user,
    or creates a new one if no inactive plans exist.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Look for the most recent inactive plan for the current user
        inactive_plan = FlowerPlan.objects.filter(user=request.user, is_active=False).order_by('-created_at').first()

        if inactive_plan:
            # If an inactive plan is found, serialize and return it
            serializer = FlowerPlanSerializer(inactive_plan)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # If no inactive plan is found, create a new one
            new_plan = FlowerPlan.objects.create(user=request.user, is_active=False)
            serializer = FlowerPlanSerializer(new_plan)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
