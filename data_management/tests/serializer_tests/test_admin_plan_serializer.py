import pytest
from data_management.serializers.admin_plan_serializer import AdminPlanSerializer
from events.tests.factories.upfront_plan_factory import UpfrontPlanFactory
from events.tests.factories.subscription_plan_factory import SubscriptionPlanFactory

@pytest.mark.django_db
def test_admin_plan_serializer_upfront():
    """
    Test AdminPlanSerializer correctly identifies an upfront plan.
    """
    plan = UpfrontPlanFactory()
    serializer = AdminPlanSerializer(plan)
    data = serializer.data
    assert data['plan_type'] == 'upfront'
    assert data['status'] == plan.status
    assert data['customer_email'] == plan.user.email

@pytest.mark.django_db
def test_admin_plan_serializer_subscription():
    """
    Test AdminPlanSerializer correctly identifies a subscription plan.
    """
    plan = SubscriptionPlanFactory()
    serializer = AdminPlanSerializer(plan)
    data = serializer.data
    assert data['plan_type'] == 'subscription'
