from rest_framework import viewsets
from ..models import FlowerType
from ..serializers.preferences_serializers import FlowerTypeSerializer

class FlowerTypeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows flower types to be viewed.
    """
    queryset = FlowerType.objects.all()
    serializer_class = FlowerTypeSerializer
