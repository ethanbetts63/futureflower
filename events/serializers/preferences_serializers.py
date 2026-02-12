# futureflower/events/serializers/preferences_serializers.py
from rest_framework import serializers
from ..models import FlowerType

class FlowerTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FlowerType
        fields = ['id', 'name']
