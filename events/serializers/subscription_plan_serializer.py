from decimal import Decimal
from datetime import date, timedelta
from django.conf import settings
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from events.models import SubscriptionPlan
from events.utils.fee_calc import calculate_service_fee
from payments.serializers.payment_serializer import PaymentSerializer
from payments.utils.subscription_dates import get_next_payment_date, get_next_delivery_date

class SubscriptionPlanSerializer(serializers.ModelSerializer):
    """
    Serializer for the SubscriptionPlan model.
    """
    payments = PaymentSerializer(many=True, read_only=True)
    next_payment_date = serializers.SerializerMethodField()
    next_delivery_date = serializers.SerializerMethodField()
    discount_code_display = serializers.SerializerMethodField()

    def get_discount_code_display(self, obj):
        return obj.discount_code.code if obj.discount_code else None

    def validate_start_date(self, value):
        """
        Check that the start date is not in the past and is at least
        the minimum number of days away.
        """
        if value:
            instance = getattr(self, 'instance', None)
            is_active = instance and instance.status == 'active'
            
            min_days = settings.MIN_DAYS_BEFORE_EDIT if is_active else settings.MIN_DAYS_BEFORE_CREATE
            earliest_date = date.today() + timedelta(days=min_days)
            
            if value < earliest_date:
                action_text = "modified" if is_active else "confirmed"
                raise serializers.ValidationError(
                    f"The next delivery must be at least {min_days} days from now so our florist has enough time to prepare. "
                    f"Your request cannot be {action_text} for this date."
                )
        return value

    class Meta:
        model = SubscriptionPlan
        fields = [
            'id', 'user', 'status', 'currency',
            'recipient_first_name', 'recipient_last_name', 'recipient_street_address',
            'recipient_suburb', 'recipient_city', 'recipient_state',
            'recipient_postcode', 'recipient_country', 'delivery_notes',
            'created_at', 'updated_at', 'preferred_flower_types', 'flower_notes',
            'start_date', 'budget',
            'frequency', 'subtotal', 'discount_amount', 'tax_amount', 'total_amount', 'discount_code_display',
            'stripe_subscription_id', 'subscription_message',
            'payments', 'next_payment_date', 'next_delivery_date'
        ]
        read_only_fields = ['user', 'status', 'stripe_subscription_id', 'created_at', 'updated_at', 'next_payment_date', 'next_delivery_date']

    def get_next_payment_date(self, obj: SubscriptionPlan):
        return get_next_payment_date(obj)
    
    def get_next_delivery_date(self, obj: SubscriptionPlan):
        next_delivery = get_next_delivery_date(obj)
        return next_delivery.isoformat() if next_delivery else None

    def create(self, validated_data):
        # Associate the plan with the current user
        validated_data['user'] = self.context['request'].user
        
        budget = validated_data.get('budget')
        if budget:
            validated_data['subtotal'] = self._calculate_total_amount(budget)

        return super().create(validated_data)

    @staticmethod
    def _calculate_total_amount(budget: Decimal) -> Decimal:
        fee = calculate_service_fee(budget)
        return (budget + fee).quantize(Decimal('0.01'))

    def update(self, instance, validated_data):
        budget = validated_data.get('budget')
        
        # If budget or frequency is updated, recalculate the total_amount
        if budget is not None or 'frequency' in validated_data:
            effective_budget = budget if budget is not None else instance.budget
            if effective_budget:
                validated_data['subtotal'] = self._calculate_total_amount(effective_budget)

        return super().update(instance, validated_data)
