import pytest
from datetime import date, timedelta
from rest_framework.exceptions import ValidationError
from events.serializers.upfront_plan_serializer import UpfrontPlanSerializer
from events.tests.factories.upfront_plan_factory import UpfrontPlanFactory
from django.conf import settings

@pytest.mark.django_db
class TestUpfrontPlanSerializer:
    def test_validate_start_date_too_soon(self):
        min_days = settings.MIN_DAYS_BEFORE_CREATE
        too_soon = date.today() + timedelta(days=min_days - 1)
        
        serializer = UpfrontPlanSerializer()
        with pytest.raises(ValidationError) as excinfo:
            serializer.validate_start_date(too_soon)
        assert "must be at least" in str(excinfo.value)

    def test_validate_start_date_ok(self):
        min_days = settings.MIN_DAYS_BEFORE_CREATE
        ok_date = date.today() + timedelta(days=min_days + 1)
        
        serializer = UpfrontPlanSerializer()
        assert serializer.validate_start_date(ok_date) == ok_date

    def test_validate_start_date_active_plan_too_soon(self):
        # Active plan needs 7 days (MIN_DAYS_BEFORE_EDIT)
        plan = UpfrontPlanFactory(status='active')
        min_days_edit = settings.MIN_DAYS_BEFORE_EDIT # 7
        
        # 5 days is > 3 (CREATE) but < 7 (EDIT)
        too_soon_for_edit = date.today() + timedelta(days=min_days_edit - 2)
        
        serializer = UpfrontPlanSerializer(instance=plan)
        with pytest.raises(ValidationError) as excinfo:
            serializer.validate_start_date(too_soon_for_edit)
        assert f"at least {min_days_edit} days" in str(excinfo.value)

    def test_update_active_plan_restrictions(self):
        plan = UpfrontPlanFactory(status='active')
        serializer = UpfrontPlanSerializer(instance=plan, data={'total_amount': 1000}, partial=True)
        
        assert serializer.is_valid()
        
        with pytest.raises(ValidationError) as excinfo:
            serializer.save()
        assert "Cannot directly update 'total_amount' for an active plan" in str(excinfo.value)

    def test_update_inactive_plan_allowed(self):
        plan = UpfrontPlanFactory(status='pending_payment')
        serializer = UpfrontPlanSerializer(instance=plan, data={'subtotal': 1000}, partial=True)
        assert serializer.is_valid()
        updated_plan = serializer.save()
        assert updated_plan.total_amount == 1000
