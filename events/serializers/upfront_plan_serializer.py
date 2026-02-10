# foreverflower/events/serializers/upfront_plan_serializer.py
from datetime import date, timedelta
from django.conf import settings
from rest_framework import serializers
from ..models import UpfrontPlan, Color, FlowerType
from .event_serializer import EventSerializer
from payments.serializers.payment_serializer import PaymentSerializer

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

    preferred_colors = serializers.PrimaryKeyRelatedField(
        queryset=Color.objects.all(), many=True, required=False
    )
    preferred_flower_types = serializers.PrimaryKeyRelatedField(
        queryset=FlowerType.objects.all(), many=True, required=False
    )
    rejected_colors = serializers.PrimaryKeyRelatedField(
        queryset=Color.objects.all(), many=True, required=False
    )
    rejected_flower_types = serializers.PrimaryKeyRelatedField(
        queryset=FlowerType.objects.all(), many=True, required=False
    )

    # Make total_amount and currency explicitly writable fields
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    currency = serializers.CharField(max_length=3, required=False, allow_null=True)

    def validate_start_date(self, value):
        """
        Check that the start date is not in the past and is at least
        the minimum number of days away.
        """
        if value:
            min_days = settings.MIN_DAYS_BEFORE_FIRST_DELIVERY
            earliest_date = date.today() + timedelta(days=min_days)
            if value < earliest_date:
                raise serializers.ValidationError(
                    f"The first delivery must be at least {min_days} days from now so our admin can confirm and organise your first delivery."
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
            'preferred_colors', 'preferred_flower_types', 'rejected_colors', 'rejected_flower_types',
            'events', 'payments',
        ]
        read_only_fields = [
            'id', 'status', 'created_at', 'updated_at'
        ]

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

        # Allow updates for inactive plans or other fields
        return super().update(instance, validated_data)





