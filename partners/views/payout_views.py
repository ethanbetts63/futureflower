from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from partners.models import Partner, Payout, PayoutLineItem


class PayoutListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            partner = Partner.objects.get(user=request.user)
        except Partner.DoesNotExist:
            return Response({"error": "Not a partner."}, status=status.HTTP_404_NOT_FOUND)

        payouts = Payout.objects.filter(partner=partner).order_by('-created_at')
        data = []
        for p in payouts:
            data.append({
                'id': p.id,
                'payout_type': p.payout_type,
                'amount': str(p.amount),
                'currency': p.currency,
                'status': p.status,
                'period_start': p.period_start,
                'period_end': p.period_end,
                'created_at': p.created_at,
            })

        return Response(data)


class PayoutDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, payout_id):
        try:
            partner = Partner.objects.get(user=request.user)
        except Partner.DoesNotExist:
            return Response({"error": "Not a partner."}, status=status.HTTP_404_NOT_FOUND)

        try:
            payout = Payout.objects.get(id=payout_id, partner=partner)
        except Payout.DoesNotExist:
            return Response({"error": "Payout not found."}, status=status.HTTP_404_NOT_FOUND)

        line_items = PayoutLineItem.objects.filter(payout=payout)

        return Response({
            'id': payout.id,
            'payout_type': payout.payout_type,
            'amount': str(payout.amount),
            'currency': payout.currency,
            'status': payout.status,
            'stripe_transfer_id': payout.stripe_transfer_id,
            'period_start': payout.period_start,
            'period_end': payout.period_end,
            'note': payout.note,
            'created_at': payout.created_at,
            'line_items': [{
                'id': li.id,
                'amount': str(li.amount),
                'description': li.description,
                'created_at': li.created_at,
            } for li in line_items],
        })
