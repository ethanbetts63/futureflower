from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.contrib.auth import get_user_model
from django.db.models import Q
from data_management.serializers.admin_user_serializer import AdminUserSerializer

User = get_user_model()


class AdminUserListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        search = request.query_params.get('search', '').strip()

        qs = User.objects.select_related('referred_by_partner__user').order_by('-date_joined')

        if search:
            qs = qs.filter(
                Q(first_name__icontains=search)
                | Q(last_name__icontains=search)
                | Q(email__icontains=search)
            )

        return Response(AdminUserSerializer(qs, many=True).data)
