from rest_framework import serializers
from events.models import OrderBase, SubscriptionPlan, UpfrontPlan


class AdminPlanDetailSerializer(serializers.ModelSerializer):
    customer_first_name = serializers.CharField(source='user.first_name', read_only=True)
    customer_last_name = serializers.CharField(source='user.last_name', read_only=True)
    customer_email = serializers.EmailField(source='user.email', read_only=True)
    plan_type = serializers.SerializerMethodField()
    preferred_flower_types = serializers.SlugRelatedField(many=True, read_only=True, slug_field='name')
    years = serializers.SerializerMethodField()
    subscription_message = serializers.SerializerMethodField()
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
            'preferred_flower_types', 'flower_notes',
            'customer_first_name', 'customer_last_name', 'customer_email',
            'years', 'subscription_message',
            'events',
        ]

    def get_plan_type(self, obj):
        if isinstance(obj, SubscriptionPlan):
            return 'subscription'
        return 'upfront'

    def get_years(self, obj):
        if isinstance(obj, UpfrontPlan):
            return obj.years
        return None

    def get_subscription_message(self, obj):
        if isinstance(obj, SubscriptionPlan):
            return obj.subscription_message
        return None

    def get_events(self, obj):
        return [
            {
                'id': e.id,
                'delivery_date': str(e.delivery_date),
                'status': e.status,
            }
            for e in obj.events.all().order_by('delivery_date')
        ]
