# foreverflower/events/serializers/preferences_serializers.py
from rest_framework import serializers
from ..models import Color, FlowerType

class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = ['id', 'name', 'hex_code']

class FlowerTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FlowerType
        fields = ['id', 'name']
