from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework import status
from partners.models import Partner
from partners.serializers.admin_partner_serializer import AdminPartnerSerializer


class AdminPendingPartnersView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        partners = (
            Partner.objects
            .filter(status='pending')
            .select_related('user')
            .order_by('created_at')
        )
        return Response(AdminPartnerSerializer(partners, many=True).data)


class AdminApprovePartnerView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        try:
            partner = Partner.objects.select_related('user').get(pk=pk)
        except Partner.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

        partner.status = 'active'
        partner.save()
        return Response(AdminPartnerSerializer(partner).data)


class AdminDenyPartnerView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        try:
            partner = Partner.objects.select_related('user').get(pk=pk)
        except Partner.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

        partner.status = 'denied'
        partner.save()
        return Response(AdminPartnerSerializer(partner).data)
