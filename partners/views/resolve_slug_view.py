from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from partners.models import Partner


class ResolveSlugView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug):
        try:
            partner = Partner.objects.get(
                booking_slug=slug,
                partner_type='delivery',
                status='active'
            )
        except Partner.DoesNotExist:
            return Response(
                {"error": "Partner not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response({
            'partner_id': partner.id,
            'business_name': partner.business_name,
        })
