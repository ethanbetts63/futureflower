# futureflower/events/serializers/upfront_plan_serializer.py
from decimal import Decimal
from datetime import date, timedelta
from django.conf import settings
from rest_framework import serializers
from ..models import UpfrontPlan, FlowerType
from .event_serializer import EventSerializer
from payments.serializers.payment_serializer import PaymentSerializer
from events.utils.upfront_price_calc import forever_flower_upfront_price

class UpfrontPlanSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    events = EventSerializer(many=True, read_only=True)
    payments = PaymentSerializer(many=True, read_only=True)

    start_date = serializers.DateField(required=False, allow_null=True)
    budget = serializers.DecimalField(
        max_digits=10, decimal_places=2
    )
    years = serializers.IntegerField()
    frequency = serializers.CharField(required=False)

    preferred_flower_types = serializers.PrimaryKeyRelatedField(
        queryset=FlowerType.objects.all(), many=True, required=False
    )
    flower_notes = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    # Make total_amount and currency explicitly writable fields
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    currency = serializers.CharField(max_length=3, required=False, allow_null=True)

    def validate_start_date(self, value):
        """
        Check that the start date is not in the past and is at least
        the minimum number of days away.
        """
        if value:
            # Determine if this is an update to an active plan
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
        model = UpfrontPlan
        fields = [
            'id', 'user', 'status', 'start_date', 'budget', 'frequency',
            'years', 'delivery_notes', 'created_at', 'updated_at',
            'total_amount', 'currency',
            'recipient_first_name', 'recipient_last_name',
            'recipient_street_address', 'recipient_suburb', 'recipient_city',
            'recipient_state', 'recipient_postcode', 'recipient_country',
            'preferred_flower_types', 'flower_notes',
            'draft_card_messages',
            'events', 'payments',
        ]
        read_only_fields = [
            'id', 'status', 'created_at', 'updated_at'
        ]

    def create(self, validated_data):
        budget = validated_data.get('budget')
        frequency = validated_data.get('frequency')
        years = validated_data.get('years')

        if all(x is not None for x in [budget, frequency, years]):
            new_total, _ = forever_flower_upfront_price(Decimal(budget), frequency, int(years))
            validated_data['total_amount'] = new_total

        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Prevent direct updates to total_amount/currency if the plan is active
        if instance.status == 'active':
            if 'total_amount' in validated_data:
                raise serializers.ValidationError(
                    "Cannot directly update 'total_amount' for an active plan. "
                    "This field is managed via payment webhooks."
                )
            if 'currency' in validated_data:
                raise serializers.ValidationError(
                    "Cannot directly update 'currency' for an active plan. "
                    "This field is managed via payment webhooks."
                )

        # Recalculate total_amount if any structural fields change
        budget = validated_data.get('budget')
        frequency = validated_data.get('frequency')
        years = validated_data.get('years')

        if any(x is not None for x in [budget, frequency, years]):
            new_budget = Decimal(budget) if budget is not None else instance.budget
            new_freq = frequency if frequency is not None else instance.frequency
            new_years = int(years) if years is not None else instance.years

            if all([new_budget, new_freq, new_years]):
                new_total, _ = forever_flower_upfront_price(new_budget, new_freq, new_years)
                validated_data['total_amount'] = new_total

        # Allow updates for inactive plans or other fields
        return super().update(instance, validated_data)





