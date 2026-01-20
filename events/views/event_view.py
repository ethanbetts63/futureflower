from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from events.models import Event
from events.serializers.event_serializer import EventSerializer

class EventViewSet(viewsets.ReadOnlyModelViewSet):
    """
    A read-only ViewSet for listing and retrieving delivery events 
    owned by the currently authenticated user.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = EventSerializer

    def get_queryset(self):
        """
        This view should only return events that belong to the currently
        authenticated user, accessed via their flower plans.
        """
        user = self.request.user
        return Event.objects.filter(flower_plan__user=user)