from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser
from partners.models import Commission


class AdminDenyCommissionView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        try:
            commission = Commission.objects.get(pk=pk)
        except Commission.DoesNotExist:
            return Response({'detail': 'Commission not found.'}, status=status.HTTP_404_NOT_FOUND)

        if commission.status in ('paid', 'processing'):
            return Response(
                {'detail': f'Commission cannot be denied (current status: {commission.status}).'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        commission.status = 'denied'
        commission.save()

        return Response({'status': 'denied'})
