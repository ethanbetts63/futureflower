from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from events.models import UpfrontPlan
from events.serializers.upfront_plan_serializer import UpfrontPlanSerializer

class GetOrCreateInactivePlanView(APIView):
    """
    Retrieves the latest plan pending payment for the authenticated user,
    or creates a new one if none exist.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Look for the most recent plan that is pending payment
        pending_plan = UpfrontPlan.objects.filter(user=request.user, status='pending_payment').order_by('-created_at').first()

        if pending_plan:
            # If a plan is found, serialize and return it
            serializer = UpfrontPlanSerializer(pending_plan)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # If no plan is found, create a new one
            new_plan = UpfrontPlan.objects.create(user=request.user) # Status defaults to 'pending_payment'
            serializer = UpfrontPlanSerializer(new_plan)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
