from rest_framework import serializers
from events.models import OrderBase


class AdminPlanSerializer(serializers.ModelSerializer):
    customer_first_name = serializers.CharField(source='user.first_name', read_only=True)
    customer_last_name = serializers.CharField(source='user.last_name', read_only=True)
    customer_email = serializers.EmailField(source='user.email', read_only=True)
    plan_type = serializers.CharField(source='billing_mode', read_only=True)

    class Meta:
        model = OrderBase
        fields = [
            'id',
            'plan_type',
            'status',
            'budget',
            'total_amount',
            'frequency',
            'start_date',
            'created_at',
            'recipient_first_name',
            'recipient_last_name',
            'customer_first_name',
            'customer_last_name',
            'customer_email',
        ]
