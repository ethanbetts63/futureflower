from rest_framework import serializers
from events.models import OrderBase


class AdminPlanDetailSerializer(serializers.ModelSerializer):
    customer_id = serializers.IntegerField(source='user.id', read_only=True)
    customer_first_name = serializers.CharField(source='user.first_name', read_only=True)
    customer_last_name = serializers.CharField(source='user.last_name', read_only=True)
    customer_email = serializers.EmailField(source='user.email', read_only=True)
    plan_type = serializers.CharField(source='billing_mode', read_only=True)
    events = serializers.SerializerMethodField()

    class Meta:
        model = OrderBase
        fields = [
            'id', 'plan_type', 'status', 'budget', 'total_amount',
            'frequency', 'start_date', 'created_at',
            'recipient_first_name', 'recipient_last_name',
            'recipient_street_address', 'recipient_suburb', 'recipient_city',
            'recipient_state', 'recipient_postcode', 'recipient_country',
            'delivery_notes', 'preferred_delivery_time',
            'flower_notes',
            'customer_id', 'customer_first_name', 'customer_last_name', 'customer_email',
            'subscription_message',
            'events',
        ]

    def get_events(self, obj):
        return [
            {
                'id': e.id,
                'delivery_date': str(e.delivery_date),
                'status': e.status,
            }
            for e in obj.events.all().order_by('delivery_date')
        ]
