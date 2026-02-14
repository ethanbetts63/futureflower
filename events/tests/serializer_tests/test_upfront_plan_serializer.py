import pytest
from datetime import date, timedelta
from rest_framework.exceptions import ValidationError
from events.serializers.upfront_plan_serializer import UpfrontPlanSerializer
from events.tests.factories.upfront_plan_factory import UpfrontPlanFactory
from django.conf import settings

@pytest.mark.django_db
class TestUpfrontPlanSerializer:
    def test_validate_start_date_too_soon(self):
        min_days = settings.MIN_DAYS_BEFORE_FIRST_DELIVERY
        too_soon = date.today() + timedelta(days=min_days - 1)
        
        serializer = UpfrontPlanSerializer()
        with pytest.raises(ValidationError) as excinfo:
            serializer.validate_start_date(too_soon)
        assert "must be at least" in str(excinfo.value)

    def test_validate_start_date_ok(self):
        min_days = settings.MIN_DAYS_BEFORE_FIRST_DELIVERY
        ok_date = date.today() + timedelta(days=min_days + 1)
        
        serializer = UpfrontPlanSerializer()
        assert serializer.validate_start_date(ok_date) == ok_date

    def test_update_active_plan_restrictions(self):
        plan = UpfrontPlanFactory(status='active')
        serializer = UpfrontPlanSerializer(instance=plan, data={'total_amount': 1000}, partial=True)
        
        assert not serializer.is_valid()
        assert 'total_amount' in serializer.errors or 'non_field_errors' in serializer.errors
        # Note: The serializer raises ValidationError in update(), so we check that
        
        with pytest.raises(ValidationError) as excinfo:
            serializer.update(plan, {'total_amount': 1000})
        assert "Cannot directly update 'total_amount' for an active plan" in str(excinfo.value)

    def test_update_inactive_plan_allowed(self):
        plan = UpfrontPlanFactory(status='pending_payment')
        serializer = UpfrontPlanSerializer(instance=plan, data={'total_amount': 1000}, partial=True)
        assert serializer.is_valid()
        updated_plan = serializer.save()
        assert updated_plan.total_amount == 1000
