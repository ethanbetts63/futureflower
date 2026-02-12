from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from partners.models import Partner
from partners.serializers import PartnerDashboardSerializer


class PartnerDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            partner = Partner.objects.get(user=request.user)
        except Partner.DoesNotExist:
            return Response(
                {"error": "You are not registered as a partner."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = PartnerDashboardSerializer(partner)
        return Response(serializer.data)
