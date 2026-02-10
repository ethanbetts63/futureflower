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
        is_single_delivery_mode = request.query_params.get('mode') == 'single-delivery'

        # Base query for a pending plan for the current user
        base_query = UpfrontPlan.objects.filter(user=request.user, status='pending_payment')

        # Adjust query and creation parameters based on the mode
        if is_single_delivery_mode:
            # Look for a pending plan that is specifically for a single delivery
            pending_plan = base_query.filter(years=1, frequency='annually').order_by('-created_at').first()
            create_kwargs = {'user': request.user, 'years': 1, 'frequency': 'annually'}
        else:
            # Look for a pending plan that is NOT for a single delivery
            # This prevents picking up a single-delivery plan when starting the multi-year flow
            pending_plan = base_query.exclude(years=1, frequency='annually').order_by('-created_at').first()
            create_kwargs = {'user': request.user}

        if pending_plan:
            # If a plan is found, serialize and return it
            serializer = UpfrontPlanSerializer(pending_plan)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # If no plan is found, create a new one with the correct parameters for the flow
            new_plan = UpfrontPlan.objects.create(**create_kwargs) 
            serializer = UpfrontPlanSerializer(new_plan)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
