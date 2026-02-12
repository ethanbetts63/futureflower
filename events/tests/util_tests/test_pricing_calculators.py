import pytest
from decimal import Decimal
from events.utils.upfront_price_calc import forever_flower_upfront_price, calculate_final_plan_cost
from events.tests.factories.upfront_plan_factory import UpfrontPlanFactory
from payments.tests.factories.payment_factory import PaymentFactory
from users.tests.factories.user_factory import UserFactory

# Mark all tests in this file as requiring database access
pytestmark = pytest.mark.django_db

class TestFutureFlowerUpfrontPrice:
    """Tests for the forever_flower_upfront_price function."""

    def test_basic_calculation(self):
        budget = 100
        frequency = 'quarterly'
        years = 5
        upfront_price, breakdown = forever_flower_upfront_price(budget, frequency, years)

        assert isinstance(upfront_price, float) or isinstance(upfront_price, Decimal)
        assert upfront_price > 0
        assert breakdown is not None
        assert "flower_cost_year" in breakdown
        assert "fee_year" in breakdown
        assert "total_cost_year" in breakdown
        assert "upfront_savings_percentage" in breakdown

    def test_different_parameters(self):
        # Higher budget, more deliveries, more years
        budget = 150
        frequency = 'bi-annually'
        years = 10
        upfront_price, _ = forever_flower_upfront_price(budget, frequency, years)
        assert upfront_price > 0

        # Lower values
        budget = 50
        frequency = 'annually'
        years = 1
        upfront_price_low, _ = forever_flower_upfront_price(budget, frequency, years)
        assert upfront_price_low > 0
        assert upfront_price > upfront_price_low # Expect higher values to result in higher price

    def test_commission_and_min_fee(self):
        # Test case where budget * commission_pct is less than min_fee_per_delivery
        budget = 10  # 5% of 10 is 0.5, which is less than 15
        frequency = 'annually'
        years = 1
        upfront_price, breakdown = forever_flower_upfront_price(budget, frequency, years)
        assert breakdown['fee_per_delivery'] == 15.00 # Should use min_fee_per_delivery

        # Test case where budget * commission_pct is more than min_fee_per_delivery
        budget = 500 # 5% of 500 is 25, which is more than 15
        frequency = 'annually'
        years = 1
        upfront_price, breakdown = forever_flower_upfront_price(budget, frequency, years)
        assert breakdown['fee_per_delivery'] == 25.00 # Should use calculated commission


class TestCalculateFinalPlanCost:
    """Tests for the calculate_final_plan_cost function."""

    def test_new_plan_no_upfront_plan(self):
        new_structure = {'budget': 100, 'frequency': 'quarterly', 'years': 5}
        result = calculate_final_plan_cost(None, new_structure) # Passing None for upfront_plan

        expected_new_total_price, _ = forever_flower_upfront_price(**new_structure)

        assert result['new_total_price'] == round(Decimal(expected_new_total_price), 2)
        assert result['total_paid'] == Decimal('0.00')
        assert result['amount_owing'] == round(Decimal(expected_new_total_price), 2)

    def test_existing_inactive_plan_no_payments(self):
        upfront_plan = UpfrontPlanFactory(status='pending_payment')
        new_structure = {'budget': 100, 'frequency': 'quarterly', 'years': 5}
        result = calculate_final_plan_cost(upfront_plan, new_structure)

        expected_new_total_price, _ = forever_flower_upfront_price(**new_structure)

        assert result['new_total_price'] == round(Decimal(expected_new_total_price), 2)
        assert result['total_paid'] == Decimal('0.00')
        assert result['amount_owing'] == round(Decimal(expected_new_total_price), 2)

    def test_existing_active_plan_with_payments_less_than_new_total(self):
        user = UserFactory()
        upfront_plan = UpfrontPlanFactory(user=user, status='active', budget=75, frequency='bi-annually', years=3)
        PaymentFactory(order=upfront_plan.orderbase_ptr, user=user, amount=Decimal('50.00'), status='succeeded')
        PaymentFactory(order=upfront_plan.orderbase_ptr, user=user, amount=Decimal('25.00'), status='succeeded')
        PaymentFactory(order=upfront_plan.orderbase_ptr, user=user, amount=Decimal('10.00'), status='failed') # Should not be counted

        new_structure = {'budget': 100, 'frequency': 'quarterly', 'years': 5}
        result = calculate_final_plan_cost(upfront_plan, new_structure)

        expected_new_total_price, _ = forever_flower_upfront_price(**new_structure)
        expected_total_paid = Decimal('75.00')
        expected_amount_owing = max(Decimal('0.00'), Decimal(expected_new_total_price) - expected_total_paid)

        assert result['new_total_price'] == round(Decimal(expected_new_total_price), 2)
        assert result['total_paid'] == expected_total_paid
        assert result['amount_owing'] == round(expected_amount_owing, 2)

    def test_existing_active_plan_with_payments_greater_than_or_equal_to_new_total(self):
        user = UserFactory()
        upfront_plan = UpfrontPlanFactory(user=user, status='active', budget=75, frequency='bi-annually', years=3)
        PaymentFactory(order=upfront_plan.orderbase_ptr, user=user, amount=Decimal('500.00'), status='succeeded')
        PaymentFactory(order=upfront_plan.orderbase_ptr, user=user, amount=Decimal('300.00'), status='succeeded')

        new_structure = {'budget': 10, 'frequency': 'annually', 'years': 1} # Very low new total
        result = calculate_final_plan_cost(upfront_plan, new_structure)

        expected_new_total_price, _ = forever_flower_upfront_price(**new_structure)
        expected_total_paid = Decimal('800.00')
        # Amount owing should be 0 because total paid is much higher than new total price
        expected_amount_owing = Decimal('0.00')

        assert result['new_total_price'] == round(Decimal(expected_new_total_price), 2)
        assert result['total_paid'] == expected_total_paid
        assert result['amount_owing'] == expected_amount_owing

    def test_existing_active_plan_no_succeeded_payments(self):
        user = UserFactory()
        upfront_plan = UpfrontPlanFactory(user=user, status='active', budget=75, frequency='bi-annually', years=3)
        PaymentFactory(order=upfront_plan.orderbase_ptr, user=user, amount=Decimal('50.00'), status='pending')
        PaymentFactory(order=upfront_plan.orderbase_ptr, user=user, amount=Decimal('25.00'), status='failed')

        new_structure = {'budget': 100, 'frequency': 'quarterly', 'years': 5}
        result = calculate_final_plan_cost(upfront_plan, new_structure)

        expected_new_total_price, _ = forever_flower_upfront_price(**new_structure)
        expected_total_paid = Decimal('0.00') # Only succeeded payments count

        assert result['new_total_price'] == round(Decimal(expected_new_total_price), 2)
        assert result['total_paid'] == expected_total_paid
        assert result['amount_owing'] == round(Decimal(expected_new_total_price), 2)
