from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from events.models import Event
from events.serializers.event_serializer import EventSerializer

class EventViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = EventSerializer

    def get_queryset(self):
        user = self.request.user
        return Event.objects.filter(order__user=user)