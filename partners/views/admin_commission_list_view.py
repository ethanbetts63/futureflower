from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from partners.models import Commission
from partners.serializers.admin_commission_list_serializer import AdminCommissionListSerializer


class AdminCommissionListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        qs = Commission.objects.select_related('partner', 'partner__user').order_by('-created_at')

        status_filter = request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter)

        commission_type_filter = request.query_params.get('commission_type')
        if commission_type_filter:
            qs = qs.filter(commission_type=commission_type_filter)

        serializer = AdminCommissionListSerializer(qs, many=True)
        return Response(serializer.data)
