import pytest
from events.tests.factories.upfront_plan_factory import UpfrontPlanFactory
from events.tests.factories.subscription_plan_factory import SubscriptionPlanFactory
from events.models import OrderBase

@pytest.mark.django_db
class TestOrderModels:
    def test_prepaid_order_creation(self):
        plan = UpfrontPlanFactory(budget=100, years=2)
        assert plan.status == 'pending_payment'
        assert plan.billing_mode == 'prepaid'
        assert plan.budget == 100
        assert plan.years == 2
        assert isinstance(plan, OrderBase)

    def test_recurring_order_creation(self):
        plan = SubscriptionPlanFactory(budget=80, subtotal=95)
        assert plan.status == 'pending_payment'
        assert plan.billing_mode == 'recurring'
        assert plan.total_amount == 95

    def test_order_str_representation(self):
        plan = UpfrontPlanFactory()
        assert str(plan) == f"Order {plan.id} (prepaid) for {plan.user.username}"
