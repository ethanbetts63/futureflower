# foreverflower/events/serializers/flower_plan_serializer.py
from rest_framework import serializers
from ..models import FlowerPlan, Color, FlowerType

class FlowerPlanSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    
    # The frontend sends 'bouquet_budget' and 'years', so we use 'source' to map them
    # to the model fields 'budget' and 'number_of_years'.
    budget = serializers.DecimalField(
        max_digits=10, decimal_places=2, source='bouquet_budget'
    )
    number_of_years = serializers.IntegerField(
        source='years'
    )
    # This field maps directly
    deliveries_per_year = serializers.IntegerField()

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


