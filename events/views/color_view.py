from rest_framework import viewsets
from ..models import Color
from ..serializers.preferences_serializers import ColorSerializer

class ColorViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows colors to be viewed.
    """
    queryset = Color.objects.all()
    serializer_class = ColorSerializer
