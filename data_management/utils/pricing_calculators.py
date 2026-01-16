def forever_flower_upfront_price(
    bouquet_budget,        # B: $ per delivery
    deliveries_per_year,   # F
    years,                 # N
    commission_pct=0.05,   # 5%
    min_fee_per_delivery=15,
    annual_real_return=0.02,  # r (conservative)
):
    """
    Returns:
        upfront_price (float)
        breakdown (dict)
    """

    # Fee per delivery
    fee_per_delivery = max(
        bouquet_budget * commission_pct,
        min_fee_per_delivery
    )

    # Annual costs
    flower_cost_year = bouquet_budget * deliveries_per_year
    fee_year = fee_per_delivery * deliveries_per_year
    total_cost_year = flower_cost_year + fee_year

    r = annual_real_return
    N = years
    annuity_factor = (1 - (1 + r) ** -N) / r

    # Present value of annuity
    upfront_price = total_cost_year * annuity_factor
    total_service_fee = fee_year * annuity_factor

    breakdown = {
        "flower_cost_year": flower_cost_year,
        "fee_year": fee_year,
        "total_cost_year": total_cost_year,
        "fee_per_delivery": fee_per_delivery,
        "total_service_fee": round(total_service_fee, 2),
        "assumed_return": r,
        "years": N,
    }

    return round(upfront_price, 2), breakdown
