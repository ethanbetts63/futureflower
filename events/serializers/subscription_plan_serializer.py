from rest_framework import serializers
from events.models import SubscriptionPlan

class SubscriptionPlanSerializer(serializers.ModelSerializer):
    """
    Serializer for the SubscriptionPlan model.
    """
    class Meta:
        model = SubscriptionPlan
        fields = [
            'id', 'user', 'status', 'currency',
            'recipient_first_name', 'recipient_last_name', 'recipient_street_address',
            'recipient_suburb', 'recipient_city', 'recipient_state',
            'recipient_postcode', 'recipient_country', 'notes',
            'created_at', 'updated_at', 'preferred_colors', 'preferred_flower_types',
            'rejected_colors', 'rejected_flower_types', 'start_date', 'budget',
            'frequency', 'price_per_delivery', 'stripe_subscription_id', 'subscription_message'
        ]
        read_only_fields = ['user', 'status', 'price_per_delivery', 'stripe_subscription_id', 'created_at', 'updated_at']

    def create(self, validated_data):
        # Associate the plan with the current user
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
