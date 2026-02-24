from payments.utils.stripe_sync import get_stripe_recurring_options


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


