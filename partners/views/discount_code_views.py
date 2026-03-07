from django.utils.text import slugify
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from partners.models import DiscountCode, Partner


class DiscountCodeCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            partner = Partner.objects.get(user=request.user)
        except Partner.DoesNotExist:
            return Response({'error': 'Not a partner.'}, status=status.HTTP_404_NOT_FOUND)

        name = request.data.get('name', '').strip() or partner.business_name
        code = DiscountCode.generate_code(name)
        dc = DiscountCode.objects.create(partner=partner, code=code, discount_amount=5)

        return Response({
            'id': dc.id,
            'code': dc.code,
            'discount_amount': str(dc.discount_amount),
            'is_active': dc.is_active,
            'total_uses': 0,
            'created_at': dc.created_at.isoformat(),
        }, status=status.HTTP_201_CREATED)


class DiscountCodeRenameView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            partner = Partner.objects.get(user=request.user)
        except Partner.DoesNotExist:
            return Response({'error': 'Not a partner.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            dc = DiscountCode.objects.get(pk=pk, partner=partner)
        except DiscountCode.DoesNotExist:
            return Response({'error': 'Discount code not found.'}, status=status.HTTP_404_NOT_FOUND)

        raw = request.data.get('code', '').strip()
        if not raw:
            return Response({'error': 'Code cannot be empty.'}, status=status.HTTP_400_BAD_REQUEST)

        new_code = slugify(raw)
        if not new_code:
            return Response({'error': 'Code must contain at least one letter or number.'}, status=status.HTTP_400_BAD_REQUEST)

        if len(new_code) > 30:
            return Response({'error': 'Code must be 30 characters or fewer.'}, status=status.HTTP_400_BAD_REQUEST)

        if DiscountCode.objects.filter(code=new_code, is_active=True).exclude(pk=pk).exists():
            return Response({'error': 'That code is already taken.'}, status=status.HTTP_400_BAD_REQUEST)

        dc.code = new_code
        dc.save()

        return Response({
            'id': dc.id,
            'code': dc.code,
            'discount_amount': str(dc.discount_amount),
            'is_active': dc.is_active,
            'total_uses': dc.usages.count(),
            'created_at': dc.created_at.isoformat(),
        })
