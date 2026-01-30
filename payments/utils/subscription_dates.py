from datetime import date, timedelta
from dateutil.relativedelta import relativedelta
from django.conf import settings

# This avoids a circular import by not importing the whole model,
# but we need it for type hinting.
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from events.models import SubscriptionPlan


def get_next_payment_date(plan: 'SubscriptionPlan') -> date | None:
    """
    Calculates the next upcoming payment date for a subscription plan.

    This function is robust against "date drift" by always calculating
    from the original billing cycle anchor date.
    """
    if not plan.start_date or not plan.frequency:
        return None

    # 1. Calculate the anchor date (when the first payment is/was due)
    lead_days = settings.SUBSCRIPTION_CHARGE_LEAD_DAYS
    anchor_date = plan.start_date - timedelta(days=lead_days)

    today = date.today()

    # If the anchor date is in the future, that's the next payment date.
    if anchor_date > today:
        return anchor_date

    # 2. If the anchor is in the past, find the next billing date in the future.
    next_date = anchor_date
    frequency = plan.frequency

    # Loop forward from the anchor date until we find a date in the future.
    while next_date <= today:
        if frequency == 'monthly':
            next_date += relativedelta(months=1)
        elif frequency == 'weekly':
            next_date += relativedelta(weeks=1)
        elif frequency == 'fortnightly':
            next_date += relativedelta(weeks=2)
        elif frequency == 'quarterly':
            next_date += relativedelta(months=3)
        elif frequency == 'bi-annually':
            next_date += relativedelta(months=6)
        elif frequency == 'annually':
            next_date += relativedelta(years=1)
        else:
            # Should not happen with valid data, but good to be safe.
            return None
            
    return next_date


def get_next_delivery_date(plan: 'SubscriptionPlan') -> date | None:
    """
    Calculates the next upcoming delivery date for a subscription plan.
    """
    next_payment = get_next_payment_date(plan)
    if not next_payment:
        return None

    lead_days = settings.SUBSCRIPTION_CHARGE_LEAD_DAYS
    return next_payment + timedelta(days=lead_days)

