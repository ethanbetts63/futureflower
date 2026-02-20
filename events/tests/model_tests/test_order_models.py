import pytest
from events.tests.factories.upfront_plan_factory import UpfrontPlanFactory
from events.tests.factories.subscription_plan_factory import SubscriptionPlanFactory
from events.models import OrderBase

@pytest.mark.django_db
class TestOrderModels:
    def test_upfront_plan_creation(self):
        plan = UpfrontPlanFactory(budget=100, years=2)
        assert plan.status == 'pending_payment'
        assert plan.budget == 100
        assert plan.years == 2
        assert str(plan).startswith("Upfront Plan")

    def test_subscription_plan_creation(self):
        plan = SubscriptionPlanFactory(budget=80, subtotal=95)
        assert plan.status == 'pending_payment'
        assert plan.total_amount == 95
        assert str(plan).startswith("Subscription Plan")

    def test_order_base_get_child_instance_upfront(self):
        upfront = UpfrontPlanFactory()
        order = OrderBase.objects.get(id=upfront.id)
        child = order.get_child_instance()
        assert child == upfront
        assert isinstance(child, type(upfront))

    def test_order_base_get_child_instance_subscription(self):
        sub = SubscriptionPlanFactory()
        order = OrderBase.objects.get(id=sub.id)
        child = order.get_child_instance()
        assert child == sub
        assert isinstance(child, type(sub))

    def test_order_base_str_representation(self):
        upfront = UpfrontPlanFactory()
        # OrderBase.__str__ uses __class__.__name__ which is "UpfrontPlan"
        assert str(upfront.orderbase_ptr).startswith("UpfrontPlan")
        
        sub = SubscriptionPlanFactory()
        # OrderBase.__str__ uses __class__.__name__ which is "SubscriptionPlan"
        assert str(sub.orderbase_ptr).startswith("SubscriptionPlan")
