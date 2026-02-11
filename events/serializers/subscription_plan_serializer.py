from decimal import Decimal
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

    class Meta:
        model = SubscriptionPlan
        fields = [
            'id', 'user', 'status', 'currency',
            'recipient_first_name', 'recipient_last_name', 'recipient_street_address',
            'recipient_suburb', 'recipient_city', 'recipient_state',
            'recipient_postcode', 'recipient_country', 'delivery_notes',
            'created_at', 'updated_at', 'preferred_colors', 'preferred_flower_types',
            'rejected_colors', 'rejected_flower_types', 'start_date', 'budget',
            'frequency', 'price_per_delivery', 'stripe_subscription_id', 'subscription_message',
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
        return super().create(validated_data)

    @staticmethod
    def _calculate_price_per_delivery(budget: Decimal) -> Decimal:
        fee = calculate_service_fee(budget)
        return (budget + fee).quantize(Decimal('0.01'))

    def update(self, instance, validated_data):
        proposed_price = validated_data.get('price_per_delivery')
        budget = validated_data.get('budget', instance.budget)

        if proposed_price is not None and budget is not None:
            server_calculated_price = self._calculate_price_per_delivery(budget)

            if abs(server_calculated_price - proposed_price) > Decimal('0.01'):
                raise ValidationError({
                    'price_per_delivery': f"The provided price ${proposed_price} does not match the server-calculated price of ${server_calculated_price} for the given budget."
                })

        return super().update(instance, validated_data)
