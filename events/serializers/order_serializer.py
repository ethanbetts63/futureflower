from django.conf import settings
from rest_framework import serializers
from events.models import OrderBase, FlowerType
from .event_serializer import EventSerializer
from payments.serializers.payment_serializer import PaymentSerializer
from payments.utils.subscription_dates import get_next_delivery_date, get_next_payment_date


class OrderSerializer(serializers.ModelSerializer):
    next_payment_date = serializers.SerializerMethodField()
    next_delivery_date = serializers.SerializerMethodField()
    discount_code_display = serializers.SerializerMethodField()
    events = EventSerializer(many=True, read_only=True)
    payments = PaymentSerializer(many=True, read_only=True)
    preferred_flower_types = serializers.PrimaryKeyRelatedField(
        queryset=FlowerType.objects.all(),
        many=True,
        required=False,
    )

    class Meta:
        model = OrderBase
        fields = [
            'id', 'user', 'status', 'billing_mode', 'currency',
            'recipient_first_name', 'recipient_last_name', 'recipient_street_address',
            'recipient_suburb', 'recipient_city', 'recipient_state',
            'recipient_postcode', 'recipient_country',
            'budget', 'subtotal', 'discount_amount', 'tax_amount', 'total_amount',
            'discount_code_display', 'frequency', 'start_date',
            'delivery_notes', 'preferred_delivery_time',
            'preferred_flower_types', 'flower_notes', 'recurring_preferences',
            'draft_card_messages', 'stripe_subscription_id', 'subscription_message',
            'next_payment_date', 'next_delivery_date',
            'created_at', 'updated_at', 'events', 'payments',
        ]
        read_only_fields = [
            'id', 'user', 'status', 'subtotal', 'discount_amount', 'tax_amount',
            'total_amount', 'discount_code_display', 'stripe_subscription_id',
            'next_payment_date', 'next_delivery_date',
            'created_at', 'updated_at', 'events', 'payments',
        ]

    def get_next_payment_date(self, obj):
        if obj.billing_mode != 'recurring':
            return None
        return get_next_payment_date(obj)

    def get_next_delivery_date(self, obj):
        if obj.billing_mode != 'recurring':
            return None
        next_delivery = get_next_delivery_date(obj)
        return next_delivery.isoformat() if next_delivery else None

    def get_discount_code_display(self, obj):
        return obj.discount_code.code if obj.discount_code else None

    def validate_budget(self, value):
        if value is not None and value < settings.MIN_BUDGET:
            raise serializers.ValidationError(
                f"Budget must be at least ${settings.MIN_BUDGET}."
            )
        return value

    def update(self, instance, validated_data):
        preferred_flower_types = validated_data.pop('preferred_flower_types', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if preferred_flower_types is not None:
            instance.preferred_flower_types.set(preferred_flower_types)

        return instance
