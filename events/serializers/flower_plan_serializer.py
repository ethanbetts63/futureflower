# foreverflower/events/serializers/flower_plan_serializer.py
from rest_framework import serializers
from ..models import FlowerPlan, Color, FlowerType
from .event_serializer import EventSerializer

class FlowerPlanSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    
    # The frontend sends 'bouquet_budget' and 'years' for creation.
    # We mark them as write_only to prevent them from being part of the read response.
    # The model's fields will be the source of truth on retrieval.
    budget = serializers.DecimalField(
        max_digits=10, decimal_places=2, source='bouquet_budget', write_only=True
    )
    number_of_years = serializers.IntegerField(
        source='years', write_only=True
    )
    deliveries_per_year = serializers.IntegerField(write_only=True)

    preferred_colors = serializers.PrimaryKeyRelatedField(
        queryset=Color.objects.all(), many=True, required=False
    )
    preferred_flower_types = serializers.PrimaryKeyRelatedField(
        queryset=FlowerType.objects.all(), many=True, required=False
    )
    rejected_colors = serializers.PrimaryKeyRelatedField(
        queryset=Color.objects.all(), many=True, required=False
    )
    rejected_flower_types = serializers.PrimaryKeyRelatedField(
        queryset=FlowerType.objects.all(), many=True, required=False
    )

    class Meta:
        model = FlowerPlan
        fields = [
            'id', 'user', 'is_active', 'budget', 'deliveries_per_year',
            'number_of_years', 'recipient_details', 'notes', 'created_at', 'updated_at',
            'preferred_colors', 'preferred_flower_types', 'rejected_colors', 'rejected_flower_types',
        ]
        read_only_fields = ['id', 'is_active', 'created_at', 'updated_at']


class FlowerPlanDetailSerializer(serializers.ModelSerializer):
    """
    A read-only serializer for FlowerPlan that includes the nested Event objects.
    """
    events = EventSerializer(many=True, read_only=True)
    preferred_colors = serializers.StringRelatedField(many=True)
    preferred_flower_types = serializers.StringRelatedField(many=True)
    rejected_colors = serializers.StringRelatedField(many=True)
    rejected_flower_types = serializers.StringRelatedField(many=True)

    class Meta:
        model = FlowerPlan
        fields = [
            'id', 'user', 'is_active', 'budget', 'deliveries_per_year',
            'number_of_years', 'recipient_details', 'notes', 'created_at', 'updated_at',
            'preferred_colors', 'preferred_flower_types', 'rejected_colors', 'rejected_flower_types',
            'events', # Include the nested events
        ]



