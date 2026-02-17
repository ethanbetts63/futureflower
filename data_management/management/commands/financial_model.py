from django.core.management.base import BaseCommand
from rich.console import Console
from rich.table import Table
from rich.text import Text
from rich import box

# ──────────────────────────────────────────────────────────
# ASSUMPTIONS — change these values to tweak the model
# ──────────────────────────────────────────────────────────

STRIPE_WISE_COMBINE_RATE = 0.035          # 3.5%
SERVICE_FEE_RATE = 0.15         # 15%
COMMISSION_RATE = 0.05          # 5% of bouquet budget
TIERED_REWARD_LOW = 5.00         # Under $100
TIERED_REWARD_MID = 10.00        # $100 - $150
TIERED_REWARD_HIGH = 15.00       # Over $150
DISCOUNT_AMOUNT = 10.00          # $5 off first bouquet (non-delivery partners)
INTEREST_RATE = 0.045           # 4.5% annual on float

BOUQUET_BUDGETS = [75, 100, 150, 200, 300, 500]
DEFAULT_BUDGET = 100

# Hold times to show in sensitivity analysis (in months)
HOLD_TIMES_MONTHS = [0.5, 1, 2, 3, 6, 9, 12, 18, 24, 36]

# Upfront payment discount percentages to analyze
UPFRONT_DISCOUNTS = [0, 0.05, 0.10]

# Upfront prepaid: 1 delivery per year, multi-year plans
UPFRONT_YEARS_OPTIONS = [2, 3, 5]

# Subscription hold times
SUBSCRIPTION_RECURRING_HOLD_MONTHS = 0.25  # ~1 week
SUBSCRIPTION_FIRST_DELIVERY_LEAD_TIME = 3.0 # Default assumption: 3 months from setup to first delivery


def _c(val):
    """Format a number as currency string."""
    if val >= 0:
        return f"${val:,.2f}"
    return f"-${abs(val):,.2f}"


def _pct(val):
    """Format a decimal as percentage string."""
    return f"{val * 100:.1f}%"


def _style(val):
    """Return rich style based on profitability."""
    if val > 0:
        return "bold green"
    elif val == 0:
        return "yellow"
    return "bold red"


def _sc(val):
    """Return a styled Text object for a currency value (green/red)."""
    return Text(_c(val), style=_style(val))


def _cost(val):
    """Format a cost (always shown as negative, red)."""
    if val == 0:
        return Text("—", style="dim")
    return Text(f"-{_c(val)}", style="red")


def calc_float_income(total_payment, hold_months):
    """Calculate after-tax float income."""
    return total_payment * INTEREST_RATE * (hold_months / 12)


def calc_single_delivery(price, source, is_first=True, has_commission=True, hold_months=12):
    """
    Calculate economics for a single delivery.

    source: 'direct' | 'non_delivery_partner' | 'delivery_partner_accept' | 'delivery_partner_decline'
    is_first: only matters for non_delivery_partner (discount on first order)
    has_commission: whether commission applies (non-del partners: first 3 orders only)
    """
    customer_pays = price

    # Non-delivery partner: $5 discount on first bouquet only
    if source == "non_delivery_partner" and is_first:
        customer_pays -= DISCOUNT_AMOUNT

    # Service fee is factored in: price = florist_cost * (1 + SERVICE_FEE_RATE)
    # So florist_cost = price / (1 + SERVICE_FEE_RATE)
    florist_cost = price / (1 + SERVICE_FEE_RATE)

    stripe_wise_fee = customer_pays * STRIPE_WISE_COMBINE_RATE

    # Commissions are calculated on the florist cost
    commission = 0
    if source == "non_delivery_partner" and has_commission:
        commission = florist_cost * COMMISSION_RATE
    elif source == "delivery_partner_decline":
        commission = florist_cost * COMMISSION_RATE

    base_profit = customer_pays - stripe_wise_fee - florist_cost - commission
    float_income = calc_float_income(customer_pays, hold_months)
    total_profit = base_profit + float_income
    margin = total_profit / customer_pays if customer_pays else 0

    return {
        "customer_pays": customer_pays,
        "stripe_wise_fee": stripe_wise_fee,
        "florist_cost": florist_cost,
        "commission": commission,
        "discount": DISCOUNT_AMOUNT if (source == "non_delivery_partner" and is_first) else 0,
        "base_profit": base_profit,
        "float_income": float_income,
        "total_profit": total_profit,
        "margin": margin,
    }


def calc_upfront(price, source, years, deliveries_per_year, upfront_discount, hold_months_avg=12):
    """Calculate economics for an upfront prepaid plan."""
    total_deliveries = years * deliveries_per_year
    
    # Nominal price before any discounts
    total_nominal_price = price * total_deliveries

    first_delivery_discount = DISCOUNT_AMOUNT if source == "non_delivery_partner" else 0

    total_full_price = total_nominal_price - first_delivery_discount
    total_customer_pays = total_full_price * (1 - upfront_discount)
    upfront_discount_amount = total_full_price - total_customer_pays

    stripe_wise_fee = total_customer_pays * STRIPE_WISE_COMBINE_RATE
    
    florist_cost_per_delivery = price / (1 + SERVICE_FEE_RATE)
    total_florist_cost = florist_cost_per_delivery * total_deliveries

    commission = 0
    if source == "non_delivery_partner":
        # Commission only on first 3 orders
        commission = florist_cost_per_delivery * COMMISSION_RATE * min(total_deliveries, 3)
    elif source == "delivery_partner_decline":
        commission = florist_cost_per_delivery * COMMISSION_RATE * total_deliveries

    base_profit = total_customer_pays - stripe_wise_fee - total_florist_cost - commission
    float_income = calc_float_income(total_customer_pays, hold_months_avg)
    total_profit = base_profit + float_income
    margin = total_profit / total_customer_pays if total_customer_pays else 0
    profit_per_delivery = total_profit / total_deliveries if total_deliveries else 0

    return {
        "total_deliveries": total_deliveries,
        "customer_pays": total_customer_pays,
        "upfront_discount_amount": upfront_discount_amount,
        "stripe_wise_fee": stripe_wise_fee,
        "florist_cost": total_florist_cost,
        "commission": commission,
        "base_profit": base_profit,
        "float_income": float_income,
        "total_profit": total_profit,
        "profit_per_delivery": profit_per_delivery,
        "margin": margin,
    }


def calc_subscription(budget, source, deliveries_per_year, lead_time_months):
    """
    Calculate economics for a subscription lifecycle (Year 1).
    First payment at Day 0 (hold time = lead_time_months).
    Subsequent payments 7 days before delivery (hold time = 0.25 months).
    """
    total_profit = 0
    total_customer_pays = 0
    
    for i in range(deliveries_per_year):
        is_first = (i == 0)
        # Commission only on first 3 orders for non-delivery partners
        # or always for delivery_partner_decline
        has_commission = False
        if source == "non_delivery_partner" and i < 3:
            has_commission = True
        elif source == "delivery_partner_decline":
            has_commission = True
            
        hold = lead_time_months if is_first else SUBSCRIPTION_RECURRING_HOLD_MONTHS
        
        delivery_eco = calc_single_delivery(
            budget, 
            source, 
            is_first=is_first, 
            has_commission=has_commission, 
            hold_months=hold
        )
        
        total_profit += delivery_eco["total_profit"]
        total_customer_pays += delivery_eco["customer_pays"]

    margin = total_profit / total_customer_pays if total_customer_pays else 0
    profit_per_delivery = total_profit / deliveries_per_year if deliveries_per_year else 0
    
    return {
        "total_profit": total_profit,
        "margin": margin,
        "profit_per_delivery": profit_per_delivery,
        "customer_pays": total_customer_pays
    }


SCENARIO_COLS = [
    ("Direct / Del Accept", "direct", True, False),
    ("Non-Del (1st)", "non_delivery_partner", True, True),
    ("Non-Del (2-3) / Del (Decline)", "non_delivery_partner", False, True),
]

UPFRONT_SCENARIO_COLS = [
    ("Direct / Del Accept", "direct"),
    ("Del Partner Decline", "delivery_partner_decline"),
]


class Command(BaseCommand):
    help = "Run the FutureFlower financial model and display results in the terminal."

    def add_arguments(self, parser):
        parser.add_argument(
            "--budget",
            type=int,
            default=DEFAULT_BUDGET,
            help=f"Bouquet budget for detailed analysis (default: ${DEFAULT_BUDGET})",
        )

    def handle(self, *args, **options):
        console = Console(width=120)
        budget = options["budget"]

        console.print()
        self._print_assumptions(console)
        console.print()
        self._print_unit_economics(console, budget)
        console.print()
        self._print_subscription_analysis(console, budget)
        console.print()
        self._print_hold_time_sensitivity(console, budget)
        console.print()
        self._print_budget_sensitivity(console)
        console.print()
        self._print_upfront_analysis(console, budget)
        console.print()
        self._print_payout_margin_analysis(console)

    def _print_assumptions(self, console):
        table = Table(title="Assumptions", box=box.ROUNDED, title_style="bold cyan", header_style="bold")
        table.add_column("Parameter", style="white")
        table.add_column("Value", style="yellow", justify="right")

        table.add_row("Stripe + Wise Fee Rate", _pct(STRIPE_WISE_COMBINE_RATE))
        table.add_row("Service Fee Rate", _pct(SERVICE_FEE_RATE))
        table.add_row("Commission Rate (Flat)", _pct(COMMISSION_RATE))
        table.add_row("Tiered Rewards (Low/Mid/High)", f"{_c(TIERED_REWARD_LOW)} / {_c(TIERED_REWARD_MID)} / {_c(TIERED_REWARD_HIGH)}")
        table.add_row("Discount (Non-Del Partner, 1st order)", _c(DISCOUNT_AMOUNT))
        table.add_row("Interest Rate on Float", _pct(INTEREST_RATE))
        table.add_row("Bouquet Budgets", ", ".join(f"${b}" for b in BOUQUET_BUDGETS))
        table.add_row("Sub. Lead Time (Order #1)", f"{SUBSCRIPTION_FIRST_DELIVERY_LEAD_TIME} mo")
        table.add_row("Sub. Hold Time (Order #2+)", f"{SUBSCRIPTION_RECURRING_HOLD_MONTHS * 4:.1f} weeks")

        console.print(table)

    def _print_subscription_analysis(self, console, budget):
        """Analyze year 1 of a subscription with the new payment schedule."""
        title = f"Subscription Year 1 Analysis — ${budget} Price (Lead Time: {SUBSCRIPTION_FIRST_DELIVERY_LEAD_TIME}mo)"
        table = Table(title=title, box=box.ROUNDED, title_style="bold cyan", header_style="bold")
        
        table.add_column("Deliveries/Year", style="white")
        for label, _, _, _ in SCENARIO_COLS:
            table.add_column(label, justify="right", min_width=14)

        for count in [1, 2, 4, 12]:
            cells = []
            for _, source, _, _ in SCENARIO_COLS:
                r = calc_subscription(budget, source, count, SUBSCRIPTION_FIRST_DELIVERY_LEAD_TIME)
                profit = r["total_profit"]
                ppd = r["profit_per_delivery"]
                margin = r["margin"]
                cells.append(Text(
                    f"{_c(profit)} ({_c(ppd)}/del, {_pct(margin)})",
                    style=_style(profit),
                ))
            table.add_row(f"{count} del/yr", *cells)

        console.print(table)

    def _print_unit_economics(self, console, budget):
        table = Table(
            title=f"Unit Economics — Single Delivery @ ${budget} Price",
            box=box.ROUNDED, title_style="bold cyan", header_style="bold",
        )
        table.add_column("", style="white", min_width=16)
        for label, _, _, _ in SCENARIO_COLS:
            table.add_column(label, justify="right", min_width=12)

        results = [calc_single_delivery(budget, src, first, comm, hold_months=0) for _, src, first, comm in SCENARIO_COLS]

        rows = [
            ("Customer Pays", "customer_pays", "plain"),
            ("Stripe + Wise Fee", "stripe_wise_fee", "cost"),
            ("Florist Cost", "florist_cost", "cost"),
            ("Commission", "commission", "cost"),
            ("Discount", "discount", "cost"),
            ("Profit", "base_profit", "profit"),
            ("Margin", "margin", "pct"),
        ]

        for label, key, fmt in rows:
            cells = []
            for r in results:
                val = r[key]
                if fmt == "pct":
                    cells.append(Text(_pct(val), style=_style(val)))
                elif fmt == "profit":
                    cells.append(_sc(val))
                elif fmt == "cost":
                    cells.append(_cost(val))
                else:
                    cells.append(Text(_c(val)))
            table.add_row(label, *cells)

        console.print(table)

    def _print_hold_time_sensitivity(self, console, budget):
        table = Table(
            title=f"Hold Time Sensitivity — ${budget} Price (Profit + Margin per Delivery)",
            box=box.ROUNDED, title_style="bold cyan", header_style="bold",
        )
        table.add_column("Hold Time", style="white", min_width=10)
        for label, _, _, _ in SCENARIO_COLS:
            table.add_column(label, justify="right", min_width=14)

        for hold in HOLD_TIMES_MONTHS:
            if hold < 1:
                label = f"{int(hold * 4)} weeks"
            elif hold == 12:
                label = "1 year"
            elif hold == 24:
                label = "2 years"
            elif hold == 36:
                label = "3 years"
            elif hold == 1:
                label = "1 month"
            else:
                label = f"{int(hold)} months"

            cells = []
            for _, source, is_first, comm in SCENARIO_COLS:
                r = calc_single_delivery(budget, source, is_first, comm, hold_months=hold)
                profit = r["total_profit"]
                margin = r["margin"]
                cells.append(Text(f"{_c(profit)} ({_pct(margin)})", style=_style(profit)))
            table.add_row(label, *cells)

        console.print(table)

    def _print_budget_sensitivity(self, console):
        table = Table(
            title="Price Sensitivity — Profit + Margin per Delivery (12mo Hold)",
            box=box.ROUNDED, title_style="bold cyan", header_style="bold",
        )
        table.add_column("Price", style="white", min_width=8)
        for label, _, _, _ in SCENARIO_COLS:
            table.add_column(label, justify="right", min_width=14)

        for budget in BOUQUET_BUDGETS:
            cells = []
            for _, source, is_first, comm in SCENARIO_COLS:
                r = calc_single_delivery(budget, source, is_first, comm, hold_months=12)
                profit = r["total_profit"]
                margin = r["margin"]
                cells.append(Text(f"{_c(profit)} ({_pct(margin)})", style=_style(profit)))
            table.add_row(f"${budget}", *cells)

        console.print(table)

    def _print_upfront_analysis(self, console, budget):
        """Upfront multi-year plans: 1 delivery/year, various discounts."""
        for years in UPFRONT_YEARS_OPTIONS:
            # Average hold time: we collect everything upfront and pay florists
            # at month 0, 12, 24, etc. Avg hold ≈ (years-1)/2 * 12 months.
            avg_hold = (years - 1) * 6

            table = Table(
                title=f"Upfront {years}-Year Plan — ${budget} Price, 1 Delivery/Year (Avg Hold: {avg_hold}mo)",
                box=box.ROUNDED, title_style="bold cyan", header_style="bold",
            )
            table.add_column("Discount", style="white", min_width=10)
            for label, _ in UPFRONT_SCENARIO_COLS:
                table.add_column(label, justify="right", min_width=14)

            for disc in UPFRONT_DISCOUNTS:
                cells = []
                for _, source in UPFRONT_SCENARIO_COLS:
                    r = calc_upfront(budget, source, years, 1, disc, hold_months_avg=avg_hold)
                    profit = r["total_profit"]
                    ppd = r["profit_per_delivery"]
                    margin = r["margin"]
                    cells.append(Text(
                        f"{_c(profit)} ({_c(ppd)}/del, {_pct(margin)})",
                        style=_style(profit),
                    ))
                table.add_row(_pct(disc), *cells)

            console.print(table)
            console.print()

    def _print_payout_margin_analysis(self, console):
        """Analyze margin impact for different fixed payout amounts."""
        payouts = [5, 10, 15, 20]
        table = Table(
            title="Affiliate Payout Margin Analysis (Margin % and $ Profit)",
            box=box.ROUNDED, title_style="bold cyan", header_style="bold",
        )
        table.add_column("Bouquet Price", style="white", min_width=12)
        table.add_column("Net Cut (Pre-Payout)", justify="right", style="dim", min_width=18)
        
        for p in payouts:
            table.add_column(f"${p} Payout", justify="right", min_width=15)

        for budget in BOUQUET_BUDGETS:
            # Net Cut = Budget - Stripe/Wise - Florist Cost
            stripe_fee = budget * STRIPE_WISE_COMBINE_RATE
            florist_cost = budget / (1 + SERVICE_FEE_RATE)
            net_cut_pre_payout = budget - stripe_fee - florist_cost
            
            cells = [
                Text(_c(budget), style="bold"),
                Text(_c(net_cut_pre_payout), style="dim")
            ]
            
            for p in payouts:
                profit = net_cut_pre_payout - p
                margin = profit / budget if budget else 0
                cells.append(Text(f"{_pct(margin)} ({_c(profit)})", style=_style(profit)))
            
            table.add_row(*cells)

        console.print(table)
        console.print(Text("Note: Net Cut = Price - Stripe/Wise Fee - Florist Cost. Margin is calculated on the full Price.", style="italic dim"))

