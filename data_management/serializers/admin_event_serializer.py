from rest_framework import serializers
from events.models import Event


class AdminEventSerializer(serializers.ModelSerializer):
    # Order fields
    order_id = serializers.IntegerField(source='order.id')
    order_type = serializers.SerializerMethodField()
    budget = serializers.DecimalField(source='order.budget', max_digits=10, decimal_places=2)
    total_amount = serializers.DecimalField(source='order.total_amount', max_digits=10, decimal_places=2)
    frequency = serializers.CharField(source='order.frequency')
    start_date = serializers.DateField(source='order.start_date')
    preferred_delivery_time = serializers.CharField(source='order.preferred_delivery_time')
    delivery_notes = serializers.CharField(source='order.delivery_notes')

    # Recipient fields
    recipient_first_name = serializers.CharField(source='order.recipient_first_name')
    recipient_last_name = serializers.CharField(source='order.recipient_last_name')
    recipient_street_address = serializers.CharField(source='order.recipient_street_address')
    recipient_suburb = serializers.CharField(source='order.recipient_suburb')
    recipient_city = serializers.CharField(source='order.recipient_city')
    recipient_state = serializers.CharField(source='order.recipient_state')
    recipient_postcode = serializers.CharField(source='order.recipient_postcode')
    recipient_country = serializers.CharField(source='order.recipient_country')

    # Preferences
    flower_notes = serializers.CharField(source='order.flower_notes')
    preferred_flower_types = serializers.SerializerMethodField()

    # Customer fields
    customer_first_name = serializers.CharField(source='order.user.first_name')
    customer_last_name = serializers.CharField(source='order.user.last_name')
    customer_email = serializers.EmailField(source='order.user.email')

    class Meta:
        model = Event
        fields = [
            'id', 'delivery_date', 'status', 'message',
            'ordered_at', 'ordering_evidence_text',
            'delivered_at', 'delivery_evidence_text',
            # Order
            'order_id', 'order_type', 'budget', 'total_amount', 'frequency',
            'start_date', 'preferred_delivery_time', 'delivery_notes',
            # Recipient
            'recipient_first_name', 'recipient_last_name', 'recipient_street_address',
            'recipient_suburb', 'recipient_city', 'recipient_state',
            'recipient_postcode', 'recipient_country',
            # Preferences
            'flower_notes', 'preferred_flower_types',
            # Customer
            'customer_first_name', 'customer_last_name', 'customer_email',
        ]

    def get_order_type(self, obj):
        child = obj.order.get_child_instance()
        if child is None:
            return 'Unknown'
        class_name = child.__class__.__name__
        if class_name == 'UpfrontPlan':
            return 'Upfront Plan'
        if class_name == 'SubscriptionPlan':
            return 'Subscription Plan'
        return class_name

    def get_preferred_flower_types(self, obj):
        return list(obj.order.preferred_flower_types.values_list('name', flat=True))
