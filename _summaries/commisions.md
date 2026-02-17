How Referral Commissions Work

  1. Customer applies discount code on confirmation page → code belongs to a Partner → we set user.referred_by_partner to that partner (tracks where
   the customer came from)
  2. Customer pays → Stripe sends a payment_intent.succeeded webhook (for upfront/single-delivery) or invoice.paid webhook (for subscriptions) →
  webhook_handlers.py processes it
  3. Webhook handler calls process_referral_commission(payment) which:
    - Looks up payment.user.referred_by_partner — if none, skip
    - Checks partner.partner_type — only non_delivery partners earn referral commissions
    - Counts the user's successful payments — if > 3, skip (cap at first 3 payments per customer)
    - Reads the order's budget and calculates a tiered fixed commission:
        - Budget < $100 → $5
      - Budget < $150 → $10
      - Budget < $200 → $15
      - Budget < $250 → $20
      - Budget >= $250 → $25
    - Creates a Commission record (status: pending)
  4. Payouts: The process_payouts management command batches approved commissions into Payout records and pays them via Stripe Connect
