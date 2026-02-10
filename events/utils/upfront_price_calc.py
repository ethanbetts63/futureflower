from decimal import Decimal
from django.db import models
from events.utils.fee_calc import calculate_service_fee

def forever_flower_upfront_price(
    budget: Decimal,
    deliveries_per_year: int,
    years: int,
    annual_real_return: Decimal = Decimal('0.04'),
) -> (Decimal, dict):
    """
    Returns:
        upfront_price (Decimal)
        breakdown (dict)
    """

    # Fee per delivery
    fee_per_delivery = calculate_service_fee(budget)

    # Annual costs
    flower_cost_year = budget * deliveries_per_year
    fee_year = fee_per_delivery * deliveries_per_year
    total_cost_year = flower_cost_year + fee_year

    r = annual_real_return
    N = years
    # Annuity factor calculation using Decimal
    annuity_factor = (Decimal('1') - (Decimal('1') + r) ** -N) / r

    # Present value of annuity
    upfront_price = total_cost_year * annuity_factor
    total_service_fee = fee_year * annuity_factor

    # For comparison, calculate the total nominal cost if paid via subscription
    price_per_delivery = budget + fee_per_delivery
    total_subscription_cost = price_per_delivery * deliveries_per_year * N
    
    # Calculate the savings percentage
    if total_subscription_cost > 0:
        savings_percentage = (Decimal('1') - (upfront_price / total_subscription_cost)) * Decimal('100')
    else:
        savings_percentage = Decimal('0')

    breakdown = {
        "flower_cost_year": flower_cost_year,
        "fee_year": fee_year,
        "total_cost_year": total_cost_year,
        "fee_per_delivery": fee_per_delivery,
        "total_service_fee": round(total_service_fee, 2),
        "assumed_return": r,
        "years": N,
        "upfront_savings_percentage": round(savings_percentage),
    }

    return round(upfront_price, 2), breakdown

def calculate_final_plan_cost(upfront_plan, new_structure: dict):
    """
    Calculates the final cost for a flower plan, considering new structure
    and subtracting any already paid amounts if the plan is active.
    
    Args:
        upfront_plan: The UpfrontPlan instance (or None for a new plan).
        new_structure (dict): A dictionary containing 'budget', 'deliveries_per_year', 'years'.

    Returns:
        dict: A dictionary containing 'new_total_price', 'total_paid', and 'amount_owing'.
    """
    
    total_paid = Decimal('0.00')
    if upfront_plan and upfront_plan.status == 'active':
        payments_aggregate = upfront_plan.payments.filter(status='succeeded').aggregate(total=models.Sum('amount'))
        total_paid = payments_aggregate['total'] or Decimal('0.00')

    # Calculate the new total price based on the proposed structure
    new_total_price, _ = forever_flower_upfront_price(
        budget=new_structure['budget'],
        deliveries_per_year=new_structure['deliveries_per_year'],
        years=new_structure['years']
    )
    
    amount_owing = new_total_price - total_paid
    amount_owing = max(Decimal('0.00'), amount_owing) # Ensure amount owing is not negative

    return {
        "new_total_price": round(new_total_price, 2),
        "total_paid": round(total_paid, 2),
        "amount_owing": round(amount_owing, 2),
    }
