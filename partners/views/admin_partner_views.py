from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework import status
from partners.models import Partner
from partners.serializers.admin_partner_serializer import AdminPartnerSerializer
from partners.serializers.admin_partner_detail_serializer import AdminPartnerDetailSerializer


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


class AdminPartnerListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        qs = Partner.objects.select_related('user').order_by('created_at')
        status_filter = request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter)
        return Response(AdminPartnerSerializer(qs, many=True).data)


class AdminPartnerDetailView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, pk):
        try:
            partner = (
                Partner.objects
                .select_related('user')
                .prefetch_related('commissions')
                .get(pk=pk)
            )
        except Partner.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(AdminPartnerDetailSerializer(partner).data)


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
