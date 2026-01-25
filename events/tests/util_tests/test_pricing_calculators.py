import pytest
from decimal import Decimal
from events.utils.pricing_calculators import forever_flower_upfront_price, calculate_final_plan_cost
from events.tests.factories.flower_plan_factory import FlowerPlanFactory
from payments.tests.factories.payment_factory import PaymentFactory
from users.tests.factories.user_factory import UserFactory

# Mark all tests in this file as requiring database access
pytestmark = pytest.mark.django_db

class TestForeverFlowerUpfrontPrice:
    """Tests for the forever_flower_upfront_price function."""

    def test_basic_calculation(self):
        budget = 100
        deliveries_per_year = 4
        years = 5
        upfront_price, breakdown = forever_flower_upfront_price(budget, deliveries_per_year, years)

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
        deliveries_per_year = 6
        years = 10
        upfront_price, _ = forever_flower_upfront_price(budget, deliveries_per_year, years)
        assert upfront_price > 0

        # Lower values
        budget = 50
        deliveries_per_year = 1
        years = 1
        upfront_price_low, _ = forever_flower_upfront_price(budget, deliveries_per_year, years)
        assert upfront_price_low > 0
        assert upfront_price > upfront_price_low # Expect higher values to result in higher price

    def test_zero_years_or_deliveries(self):
        # Should still return a price, but perhaps 0 for years or a very low price.
        # The current implementation would yield 0 for upfront_price if years = 0
        budget = 100
        deliveries_per_year = 4
        years = 0
        upfront_price, _ = forever_flower_upfront_price(budget, deliveries_per_year, years)
        assert upfront_price == 0.00

        budget = 100
        deliveries_per_year = 0
        years = 5
        upfront_price, _ = forever_flower_upfront_price(budget, deliveries_per_year, years)
        assert upfront_price == 0.00

    def test_commission_and_min_fee(self):
        # Test case where budget * commission_pct is less than min_fee_per_delivery
        budget = 10  # 5% of 10 is 0.5, which is less than 15
        deliveries_per_year = 1
        years = 1
        upfront_price, breakdown = forever_flower_upfront_price(budget, deliveries_per_year, years)
        assert breakdown['fee_per_delivery'] == 15.00 # Should use min_fee_per_delivery

        # Test case where budget * commission_pct is more than min_fee_per_delivery
        budget = 500 # 5% of 500 is 25, which is more than 15
        deliveries_per_year = 1
        years = 1
        upfront_price, breakdown = forever_flower_upfront_price(budget, deliveries_per_year, years)
        assert breakdown['fee_per_delivery'] == 25.00 # Should use calculated commission


class TestCalculateFinalPlanCost:
    """Tests for the calculate_final_plan_cost function."""

    def test_new_plan_no_flower_plan(self):
        new_structure = {'budget': 100, 'deliveries_per_year': 4, 'years': 5}
        result = calculate_final_plan_cost(None, new_structure) # Passing None for flower_plan

        expected_new_total_price, _ = forever_flower_upfront_price(**new_structure)

        assert result['new_total_price'] == round(Decimal(expected_new_total_price), 2)
        assert result['total_paid'] == Decimal('0.00')
        assert result['amount_owing'] == round(Decimal(expected_new_total_price), 2)

    def test_existing_inactive_plan_no_payments(self):
        flower_plan = FlowerPlanFactory(is_active=False)
        new_structure = {'budget': 100, 'deliveries_per_year': 4, 'years': 5}
        result = calculate_final_plan_cost(flower_plan, new_structure)

        expected_new_total_price, _ = forever_flower_upfront_price(**new_structure)

        assert result['new_total_price'] == round(Decimal(expected_new_total_price), 2)
        assert result['total_paid'] == Decimal('0.00')
        assert result['amount_owing'] == round(Decimal(expected_new_total_price), 2)

    def test_existing_active_plan_with_payments_less_than_new_total(self):
        user = UserFactory()
        flower_plan = FlowerPlanFactory(user=user, is_active=True, budget=75, deliveries_per_year=2, years=3)
        PaymentFactory(flower_plan=flower_plan, user=user, amount=Decimal('50.00'), status='succeeded')
        PaymentFactory(flower_plan=flower_plan, user=user, amount=Decimal('25.00'), status='succeeded')
        PaymentFactory(flower_plan=flower_plan, user=user, amount=Decimal('10.00'), status='failed') # Should not be counted

        new_structure = {'budget': 100, 'deliveries_per_year': 4, 'years': 5}
        result = calculate_final_plan_cost(flower_plan, new_structure)

        expected_new_total_price, _ = forever_flower_upfront_price(**new_structure)
        expected_total_paid = Decimal('75.00')
        expected_amount_owing = max(Decimal('0.00'), Decimal(expected_new_total_price) - expected_total_paid)

        assert result['new_total_price'] == round(Decimal(expected_new_total_price), 2)
        assert result['total_paid'] == expected_total_paid
        assert result['amount_owing'] == round(expected_amount_owing, 2)

    def test_existing_active_plan_with_payments_greater_than_or_equal_to_new_total(self):
        user = UserFactory()
        flower_plan = FlowerPlanFactory(user=user, is_active=True, budget=75, deliveries_per_year=2, years=3)
        PaymentFactory(flower_plan=flower_plan, user=user, amount=Decimal('500.00'), status='succeeded')
        PaymentFactory(flower_plan=flower_plan, user=user, amount=Decimal('300.00'), status='succeeded')

        new_structure = {'budget': 10, 'deliveries_per_year': 1, 'years': 1} # Very low new total
        result = calculate_final_plan_cost(flower_plan, new_structure)

        expected_new_total_price, _ = forever_flower_upfront_price(**new_structure)
        expected_total_paid = Decimal('800.00')
        # Amount owing should be 0 because total paid is much higher than new total price
        expected_amount_owing = Decimal('0.00')

        assert result['new_total_price'] == round(Decimal(expected_new_total_price), 2)
        assert result['total_paid'] == expected_total_paid
        assert result['amount_owing'] == expected_amount_owing

    def test_existing_active_plan_no_succeeded_payments(self):
        user = UserFactory()
        flower_plan = FlowerPlanFactory(user=user, is_active=True, budget=75, deliveries_per_year=2, years=3)
        PaymentFactory(flower_plan=flower_plan, user=user, amount=Decimal('50.00'), status='pending')
        PaymentFactory(flower_plan=flower_plan, user=user, amount=Decimal('25.00'), status='failed')

        new_structure = {'budget': 100, 'deliveries_per_year': 4, 'years': 5}
        result = calculate_final_plan_cost(flower_plan, new_structure)

        expected_new_total_price, _ = forever_flower_upfront_price(**new_structure)
        expected_total_paid = Decimal('0.00') # Only succeeded payments count

        assert result['new_total_price'] == round(Decimal(expected_new_total_price), 2)
        assert result['total_paid'] == expected_total_paid
        assert result['amount_owing'] == round(Decimal(expected_new_total_price), 2)

    def test_existing_active_plan_with_zero_new_total(self):
        user = UserFactory()
        flower_plan = FlowerPlanFactory(user=user, is_active=True, budget=75, deliveries_per_year=2, years=3)
        PaymentFactory(flower_plan=flower_plan, user=user, amount=Decimal('10.00'), status='succeeded')

        new_structure = {'budget': 0, 'deliveries_per_year': 0, 'years': 0} # This will result in 0 new_total_price
        result = calculate_final_plan_cost(flower_plan, new_structure)

        expected_new_total_price, _ = forever_flower_upfront_price(**new_structure) # Should be 0
        expected_total_paid = Decimal('10.00')
        expected_amount_owing = Decimal('0.00') # Can't owe less than 0

        assert expected_new_total_price == 0.00
        assert result['new_total_price'] == round(Decimal(expected_new_total_price), 2)
        assert result['total_paid'] == expected_total_paid
        assert result['amount_owing'] == expected_amount_owing
