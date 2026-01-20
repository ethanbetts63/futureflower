# foreverflower/events/views/preference_views.py
from rest_framework import viewsets
from ..models import Color, FlowerType
from ..serializers.preferences_serializers import ColorSerializer, FlowerTypeSerializer

class ColorViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows colors to be viewed.
    """
    queryset = Color.objects.all()
    serializer_class = ColorSerializer

class FlowerTypeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows flower types to be viewed.
    """
    queryset = FlowerType.objects.all()
    serializer_class = FlowerTypeSerializer
