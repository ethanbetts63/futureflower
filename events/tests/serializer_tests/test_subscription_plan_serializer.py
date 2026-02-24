import pytest
from datetime import date, timedelta
from decimal import Decimal
from rest_framework.exceptions import ValidationError
from events.serializers.subscription_plan_serializer import SubscriptionPlanSerializer
from events.tests.factories.subscription_plan_factory import SubscriptionPlanFactory
from partners.tests.factories.discount_code_factory import DiscountCodeFactory
from django.conf import settings


@pytest.mark.django_db
class TestSubscriptionPlanSerializer:

    def test_validate_start_date_too_soon_raises(self):
        min_days = settings.MIN_DAYS_BEFORE_CREATE
        too_soon = date.today() + timedelta(days=min_days - 1)
        serializer = SubscriptionPlanSerializer()
        with pytest.raises(ValidationError):
            serializer.validate_start_date(too_soon)

    def test_validate_start_date_ok_passes(self):
        min_days = settings.MIN_DAYS_BEFORE_CREATE
        ok_date = date.today() + timedelta(days=min_days + 1)
        serializer = SubscriptionPlanSerializer()
        result = serializer.validate_start_date(ok_date)
        assert result == ok_date

    def test_validate_start_date_none_passes(self):
        serializer = SubscriptionPlanSerializer()
        result = serializer.validate_start_date(None)
        assert result is None

    def test_validate_start_date_active_plan_uses_edit_threshold(self):
        plan = SubscriptionPlanFactory(status='active')
        min_days_edit = settings.MIN_DAYS_BEFORE_EDIT
        too_soon = date.today() + timedelta(days=min_days_edit - 1)
        serializer = SubscriptionPlanSerializer(instance=plan)
        with pytest.raises(ValidationError):
            serializer.validate_start_date(too_soon)

    def test_discount_code_display_none_when_no_discount(self):
        plan = SubscriptionPlanFactory()
        plan.discount_code = None
        plan.save()
        data = SubscriptionPlanSerializer(plan).data
        assert data['discount_code_display'] is None

    def test_discount_code_display_shows_code(self):
        plan = SubscriptionPlanFactory()
        dc = DiscountCodeFactory()
        plan.discount_code = dc
        plan.save()
        data = SubscriptionPlanSerializer(plan).data
        assert data['discount_code_display'] == dc.code

    def test_calculate_total_amount_returns_decimal(self):
        budget = Decimal('100.00')
        result = SubscriptionPlanSerializer._calculate_total_amount(budget)
        assert isinstance(result, Decimal)
        assert result == budget.quantize(Decimal('0.01'))

    def test_calculate_total_amount_rounds_to_two_decimals(self):
        budget = Decimal('75.00')
        result = SubscriptionPlanSerializer._calculate_total_amount(budget)
        # Ensure it's properly quantized
        assert result == result.quantize(Decimal('0.01'))

    def test_update_recalculates_subtotal_when_budget_changes(self):
        plan = SubscriptionPlanFactory(status='pending_payment')
        new_budget = Decimal('80.00')
        serializer = SubscriptionPlanSerializer(
            instance=plan,
            data={'budget': str(new_budget)},
            partial=True,
        )
        assert serializer.is_valid(), serializer.errors
        updated = serializer.save()
        assert updated.subtotal == new_budget.quantize(Decimal('0.01'))
