import stripe
from django.conf import settings
from decimal import Decimal

stripe.api_key = settings.STRIPE_SECRET_KEY

def get_stripe_recurring_options(frequency: str) -> dict:
    """Maps plan frequency to Stripe's recurring interval options."""
    mapping = {
        'weekly': {'interval': 'week', 'interval_count': 1},
        'fortnightly': {'interval': 'week', 'interval_count': 2},
        'monthly': {'interval': 'month', 'interval_count': 1},
        'quarterly': {'interval': 'month', 'interval_count': 3},
        'bi-annually': {'interval': 'month', 'interval_count': 6},
        'annually': {'interval': 'year', 'interval_count': 1},
    }
    return mapping.get(frequency)

def sync_subscription_to_stripe(plan):
    """
    Synchronizes an active SubscriptionPlan's budget or frequency to Stripe.
    Uses proration_behavior='none' to ensure changes apply only to future invoices.
    """
    if not plan.stripe_subscription_id:
        print(f"Plan {plan.id} has no Stripe Subscription ID. Skipping sync.")
        return

    try:
        # 1. Retrieve the existing subscription from Stripe
        subscription = stripe.Subscription.retrieve(plan.stripe_subscription_id)
        
        # 2. Get the current subscription item ID (assuming one item per subscription)
        subscription_item_id = subscription['items']['data'][0]['id']
        
        # 3. Define the new recurring options
        recurring_options = get_stripe_recurring_options(plan.frequency)
        if not recurring_options:
            raise ValueError(f"Invalid frequency: {plan.frequency}")

        # 4. Modify the subscription item with the new price data
        stripe.Subscription.modify(
            plan.stripe_subscription_id,
            items=[{
                "id": subscription_item_id,
                "price_data": {
                    "currency": plan.currency.lower(),
                    "unit_amount": int(plan.total_amount * 100),
                    "product": settings.STRIPE_SUBSCRIPTION_PRODUCT_ID,
                    "recurring": recurring_options,
                }
            }],
            proration_behavior='none'  # No immediate charges, applies to next billing cycle
        )
        print(f"Successfully synced SubscriptionPlan {plan.id} to Stripe.")
        
    except Exception as e:
        print(f"Error syncing SubscriptionPlan {plan.id} to Stripe: {e}")
        raise e
