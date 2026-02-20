from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework import status
from events.models import UpfrontPlan, SubscriptionPlan
from data_management.serializers.admin_plan_detail_serializer import AdminPlanDetailSerializer


class AdminPlanDetailView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, plan_type, pk):
        if plan_type == 'upfront':
            Model = UpfrontPlan
        elif plan_type == 'subscription':
            Model = SubscriptionPlan
        else:
            return Response({'detail': 'Invalid plan type.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            plan = (
                Model.objects
                .select_related('user')
                .prefetch_related('preferred_flower_types', 'events')
                .get(pk=pk)
            )
        except Model.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

        return Response(AdminPlanDetailSerializer(plan).data)
