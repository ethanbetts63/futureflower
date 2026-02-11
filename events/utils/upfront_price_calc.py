from decimal import Decimal
from django.db import models
from events.utils.fee_calc import calculate_service_fee, frequency_to_deliveries_per_year

def forever_flower_upfront_price(
    budget: Decimal,
    frequency: str,
    years: int,
) -> (Decimal, dict):
    """
    Returns:
        upfront_price (Decimal)
        breakdown (dict)
    """

    deliveries_per_year = frequency_to_deliveries_per_year(frequency)

    # Fee per delivery
    fee_per_delivery = calculate_service_fee(budget)

    # Single delivery bypass: no annuity discount when years=1 and frequency=annually
    if years == 1 and deliveries_per_year == 1:
        upfront_price = budget + fee_per_delivery
        breakdown = {
            "flower_cost_year": budget,
            "fee_year": fee_per_delivery,
            "total_cost_year": upfront_price,
            "fee_per_delivery": fee_per_delivery,
            "total_service_fee": round(fee_per_delivery, 2),
            "assumed_return": Decimal('0'),
            "years": 1,
            "upfront_savings_percentage": Decimal('0'),
        }
        return round(upfront_price, 2), breakdown

    # Total costs
    total_deliveries = deliveries_per_year * years
    total_flower_cost = budget * total_deliveries
    total_service_fee = fee_per_delivery * total_deliveries
    upfront_price = total_flower_cost + total_service_fee

    breakdown = {
        "flower_cost_year": budget * deliveries_per_year,
        "fee_year": fee_per_delivery * deliveries_per_year,
        "total_cost_year": (budget + fee_per_delivery) * deliveries_per_year,
        "fee_per_delivery": fee_per_delivery,
        "total_service_fee": round(total_service_fee, 2),
        "assumed_return": Decimal('0'),
        "years": years,
        "upfront_savings_percentage": Decimal('0'),
    }

    return round(upfront_price, 2), breakdown

def calculate_final_plan_cost(upfront_plan, new_structure: dict):
    """
    Calculates the final cost for a flower plan, considering new structure
    and subtracting any already paid amounts if the plan is active.
    
    Args:
        upfront_plan: The UpfrontPlan instance (or None for a new plan).
        new_structure (dict): A dictionary containing 'budget', 'frequency', 'years'.

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
        frequency=new_structure['frequency'],
        years=new_structure['years']
    )
    
    amount_owing = new_total_price - total_paid
    amount_owing = max(Decimal('0.00'), amount_owing) # Ensure amount owing is not negative

    return {
        "new_total_price": round(new_total_price, 2),
        "total_paid": round(total_paid, 2),
        "amount_owing": round(amount_owing, 2),
    }
