# foreverflower/events/utils/modification_calculator.py
from decimal import Decimal
from django.db import models
from .pricing_calculators import forever_flower_upfront_price
from payments.models import Payment

def calculate_modification_details(flower_plan, new_structure: dict):
    print(f"\n--- Modification Calculation for Plan ID: {flower_plan.id} ---")
    print(f"Original Plan Total Amount: {flower_plan.total_amount}")
    print(f"Original Plan Structure: Budget={flower_plan.budget}, Deliveries={flower_plan.deliveries_per_year}, Years={flower_plan.years}")
    print(f"New Proposed Structure: Budget={new_structure['budget']}, Deliveries={new_structure['deliveries_per_year']}, Years={new_structure['years']}")

    # Check if any of the key parameters have strictly increased
    has_increased = (
        new_structure['budget'] > flower_plan.budget or
        new_structure['deliveries_per_year'] > flower_plan.deliveries_per_year or
        new_structure['years'] > flower_plan.years
    )
    print(f"Has parameters increased? {has_increased}")

    # Calculate the total amount already paid for this plan (needed for both branches)
    payments_aggregate = flower_plan.payments.filter(status='succeeded').aggregate(total=models.Sum('amount'))
    total_paid = payments_aggregate['total'] or Decimal('0.00')
    print(f"Payments Aggregate: {payments_aggregate}")
    print(f"Total Paid for Plan: {total_paid}")

    if not has_increased:
        print("Scenario: No increase in parameters. Amount owing is 0.")
        return {
            "new_total_price": round(flower_plan.total_amount, 2), # Report original total amount
            "total_paid": round(total_paid, 2),
            "amount_owing": Decimal('0.00'),
        }

    # 1. Calculate the new total price based on the proposed structure
    new_total_price, _ = forever_flower_upfront_price(
        budget=new_structure['budget'],
        deliveries_per_year=new_structure['deliveries_per_year'],
        years=new_structure['years']
    )
    print(f"Calculated New Total Price (PV): {new_total_price}")

    # 3. Calculate the difference
    amount_owing = Decimal(new_total_price) - total_paid
    print(f"Initial Amount Owing (New PV - Total Paid): {amount_owing}")

    # Ensure amount_owing is not negative for this calculation's purpose
    if amount_owing < 0:
        print(f"Amount owing was negative ({amount_owing}), setting to 0.")
        amount_owing = Decimal('0.00')
    
    print(f"Final Amount Owing: {amount_owing}")
    print(f"--- End Modification Calculation for Plan ID: {flower_plan.id} ---\n")

    return {
        "new_total_price": round(Decimal(new_total_price), 2),
        "total_paid": round(total_paid, 2),
        "amount_owing": round(amount_owing, 2),
    }
