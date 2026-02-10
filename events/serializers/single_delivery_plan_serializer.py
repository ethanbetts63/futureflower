# events/serializers/single_delivery_plan_serializer.py
from rest_framework import serializers
from events.models import SingleDeliveryPlan

class SingleDeliveryPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SingleDeliveryPlan
        fields = [
            'id', 'user', 'status', 'start_date', 'budget', 'total_amount',
            'currency', 'delivery_notes', 'created_at', 'updated_at',
            'recipient_first_name', 'recipient_last_name',
            'recipient_street_address', 'recipient_suburb', 'recipient_city',
            'recipient_state', 'recipient_postcode', 'recipient_country',
            'preferred_colors', 'preferred_flower_types',
            'rejected_colors', 'rejected_flower_types',
            'preferred_delivery_time',
        ]
        read_only_fields = ('id', 'user', 'status', 'created_at', 'updated_at')
