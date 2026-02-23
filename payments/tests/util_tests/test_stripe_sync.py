import pytest
from unittest.mock import patch, MagicMock
from payments.utils.stripe_sync import get_stripe_recurring_options, sync_subscription_to_stripe
from events.tests.factories.subscription_plan_factory import SubscriptionPlanFactory
from decimal import Decimal


class TestGetStripeRecurringOptions:

    def test_weekly_maps_to_week_interval_1(self):
        opts = get_stripe_recurring_options('weekly')
        assert opts == {'interval': 'week', 'interval_count': 1}

    def test_fortnightly_maps_to_week_interval_2(self):
        opts = get_stripe_recurring_options('fortnightly')
        assert opts == {'interval': 'week', 'interval_count': 2}

    def test_monthly_maps_to_month_interval_1(self):
        opts = get_stripe_recurring_options('monthly')
        assert opts == {'interval': 'month', 'interval_count': 1}

    def test_quarterly_maps_to_month_interval_3(self):
        opts = get_stripe_recurring_options('quarterly')
        assert opts == {'interval': 'month', 'interval_count': 3}

    def test_bi_annually_maps_to_month_interval_6(self):
        opts = get_stripe_recurring_options('bi-annually')
        assert opts == {'interval': 'month', 'interval_count': 6}

    def test_annually_maps_to_year_interval_1(self):
        opts = get_stripe_recurring_options('annually')
        assert opts == {'interval': 'year', 'interval_count': 1}

    def test_unknown_frequency_returns_none(self):
        opts = get_stripe_recurring_options('daily')
        assert opts is None

    def test_empty_string_returns_none(self):
        opts = get_stripe_recurring_options('')
        assert opts is None


@pytest.mark.django_db
class TestSyncSubscriptionToStripe:

    def test_skips_when_no_stripe_subscription_id(self):
        plan = SubscriptionPlanFactory()
        plan.stripe_subscription_id = None
        plan.save()

        with patch('payments.utils.stripe_sync.stripe.Subscription.retrieve') as mock_retrieve:
            sync_subscription_to_stripe(plan)

        mock_retrieve.assert_not_called()

    def test_calls_stripe_retrieve_with_subscription_id(self):
        plan = SubscriptionPlanFactory(
            stripe_subscription_id='sub_test_retrieve',
            frequency='monthly',
        )
        plan.total_amount = Decimal('110.00')
        plan.currency = 'usd'
        plan.save()

        mock_subscription = {'items': {'data': [{'id': 'si_test123'}]}}

        with patch('payments.utils.stripe_sync.stripe.Subscription.retrieve',
                   return_value=mock_subscription) as mock_retrieve, \
             patch('payments.utils.stripe_sync.stripe.Subscription.modify'):
            sync_subscription_to_stripe(plan)

        mock_retrieve.assert_called_once_with('sub_test_retrieve')

    def test_calls_stripe_modify(self):
        plan = SubscriptionPlanFactory(
            stripe_subscription_id='sub_test_modify',
            frequency='monthly',
        )
        plan.total_amount = Decimal('110.00')
        plan.currency = 'usd'
        plan.save()

        mock_subscription = {'items': {'data': [{'id': 'si_test123'}]}}

        with patch('payments.utils.stripe_sync.stripe.Subscription.retrieve',
                   return_value=mock_subscription), \
             patch('payments.utils.stripe_sync.stripe.Subscription.modify') as mock_modify:
            sync_subscription_to_stripe(plan)

        mock_modify.assert_called_once()

    def test_raises_on_invalid_frequency(self):
        plan = SubscriptionPlanFactory(stripe_subscription_id='sub_bad_freq')
        plan.frequency = 'invalid_freq'
        plan.save()

        mock_subscription = {'items': {'data': [{'id': 'si_test123'}]}}

        with patch('payments.utils.stripe_sync.stripe.Subscription.retrieve',
                   return_value=mock_subscription):
            with pytest.raises(Exception):
                sync_subscription_to_stripe(plan)
