from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework import status
from events.models import Event
from data_management.serializers.admin_event_serializer import AdminEventSerializer


class AdminMarkDeliveredView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        try:
            event = (
                Event.objects
                .select_related('order', 'order__user')
                .prefetch_related('order__preferred_flower_types')
                .get(pk=pk)
            )
        except Event.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

        if event.status != 'ordered':
            return Response(
                {'detail': f"Cannot mark as delivered: event status is '{event.status}', expected 'ordered'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        delivered_at = request.data.get('delivered_at')
        delivery_evidence_text = request.data.get('delivery_evidence_text', '')

        if not delivered_at:
            return Response({'detail': "'delivered_at' is required."}, status=status.HTTP_400_BAD_REQUEST)

        event.status = 'delivered'
        event.delivered_at = delivered_at
        event.delivery_evidence_text = delivery_evidence_text
        event.save()

        return Response(AdminEventSerializer(event).data)
