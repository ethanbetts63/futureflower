import pytest
from events.tests.factories.order_factory import OrderFactory
from events.models import OrderBase

@pytest.mark.django_db
class TestOrderModels:
    def test_one_time_order_creation(self):
        plan = OrderFactory(billing_mode='one_time', budget=100)
        assert plan.status == 'pending_payment'
        assert plan.billing_mode == 'one_time'
        assert plan.budget == 100
        assert isinstance(plan, OrderBase)

    def test_recurring_order_creation(self):
        plan = OrderFactory(billing_mode='recurring', budget=80, subtotal=95)
        assert plan.status == 'pending_payment'
        assert plan.billing_mode == 'recurring'
        assert plan.total_amount == 95

    def test_order_str_representation(self):
        plan = OrderFactory(billing_mode='one_time')
        assert str(plan) == f"Order {plan.id} (one_time) for {plan.user.username}"
