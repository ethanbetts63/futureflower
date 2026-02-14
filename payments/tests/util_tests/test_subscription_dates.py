import pytest
from datetime import date, timedelta
from dateutil.relativedelta import relativedelta
from events.tests.factories.subscription_plan_factory import SubscriptionPlanFactory
from payments.utils.subscription_dates import get_next_payment_date, get_next_delivery_date

@pytest.mark.django_db
def test_get_next_payment_date_future_anchor(settings):
    settings.SUBSCRIPTION_CHARGE_LEAD_DAYS = 6
    # Start date in 10 days -> Anchor is in 4 days (future)
    start = date.today() + timedelta(days=10)
    plan = SubscriptionPlanFactory(start_date=start, frequency='monthly')
    
    assert get_next_payment_date(plan) == start - timedelta(days=6)

@pytest.mark.django_db
def test_get_next_payment_date_past_anchor(settings):
    settings.SUBSCRIPTION_CHARGE_LEAD_DAYS = 6
    # Start date 1 month ago -> Anchor was 1 month + 6 days ago (past)
    start = date.today() - relativedelta(months=1)
    plan = SubscriptionPlanFactory(start_date=start, frequency='monthly')
    
    # Next payment should be anchor + 2 months (since anchor + 1 month is also in the past or today)
    # Wait, anchor = start - 6 days.
    # next_date = anchor
    # while next_date <= today: next_date += 1 month
    
    anchor = start - timedelta(days=6)
    expected = anchor
    while expected <= date.today():
        expected += relativedelta(months=1)
        
    assert get_next_payment_date(plan) == expected

@pytest.mark.django_db
def test_get_next_delivery_date(settings):
    settings.SUBSCRIPTION_CHARGE_LEAD_DAYS = 6
    start = date.today() + timedelta(days=10)
    plan = SubscriptionPlanFactory(start_date=start, frequency='monthly')
    
    # next payment is in 4 days, so next delivery is in 4+6 = 10 days (the start_date)
    assert get_next_delivery_date(plan) == start
