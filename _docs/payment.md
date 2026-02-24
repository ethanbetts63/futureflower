# Stripe Payment Process

This document outlines the Stripe interaction flow for Upfront and Subscription plans.

## Unified Checkout Experience
Both plan types utilize a unified checkout experience. The frontend requests a `PaymentIntent` from the backend, which is then confirmed using standard Stripe Elements. This ensures a consistent "Pay Now" UI and avoids technical mismatches between different Stripe intent types.

### 1. Upfront Plans
- **Request:** The frontend calls `create-payment-intent` with the plan's total amount.
- **Payment:** The user pays the full amount immediately at checkout.
- **Fulfillment (Webhook):** Upon `payment_intent.succeeded`:
    - The plan status is set to `active`.
    - All future delivery `Event` objects are pre-generated in the database.
    - Admin and customer notification records are created for each event.
    - Admin is notified via email (and SMS in production).

### 2. Subscription Plans
- **Request:** The frontend calls `create-subscription`, which returns a `PaymentIntent` for the **first delivery only**.
- **Payment:** The user pays for the first delivery immediately. The `PaymentIntent` is configured with `setup_future_usage='off_session'` to authorize future recurring charges.
- **Activation (Webhook):** Upon `payment_intent.succeeded`:
    - The plan status is set to `active`.
    - The **first** delivery `Event` is created immediately (for `start_date`).
    - A Stripe **Subscription** is created in the background using the same payment method.
        - A new `stripe.Product` is created inline at subscription time (no pre-configured product ID is required).
        - A **Trial Period** is applied to the subscription, ending 7 days before the second delivery. This prevents double-billing for the first delivery.
        - The `stripe_subscription_id` is saved to the plan.
    - Admin and customer notifications are sent.
- **Recurring Deliveries (Webhook):** Upon `invoice.payment_succeeded`:
    - A new `Event` is created. The delivery date is calculated as `invoice_created_date + SUBSCRIPTION_CHARGE_LEAD_DAYS`.
    - Referral commission is processed.
    - Admin is notified.

### Trial Period Calculation
The trial prevents double-billing for the first delivery (which was already paid via direct PaymentIntent).

```
second_delivery_date = start_date + frequency_interval
trial_end_date       = second_delivery_date - SUBSCRIPTION_CHARGE_LEAD_DAYS
```

For an annual subscription starting Feb 27:
- `second_delivery_date = Feb 27, 2027`
- `trial_end = Feb 20, 2027` (7 days prior)

Stripe charges nothing during the trial. The subscription's first real charge fires on Feb 20, 2027.

## Next Payment / Delivery Date Calculation
These computed fields live in `payments/utils/subscription_dates.py` and are exposed by the serializer as `next_payment_date` and `next_delivery_date`.

### `get_next_payment_date(plan)`
Anchors from `start_date - SUBSCRIPTION_CHARGE_LEAD_DAYS` (the date the first payment *would* have been due if billed via subscription). Then loops forward by the plan's frequency until it finds a date in the future.

```
anchor = start_date - 7 days
while anchor <= today:
    anchor += frequency_interval
return anchor
```

For a just-activated annual plan with `start_date = Feb 27, 2026` and today = Feb 24, 2026:
- `anchor = Feb 20, 2026` (in the past)
- Advance: `Feb 20, 2026 + 1 year = Feb 20, 2027` → returned

### `get_next_delivery_date(plan)`
Returns `get_next_payment_date(plan) + SUBSCRIPTION_CHARGE_LEAD_DAYS`.

**Known limitation:** This always returns the next *subscription-cycle* delivery date. For a newly activated plan, the first delivery (`start_date`) is already paid directly and is not reflected by this function. The displayed "Next Delivery Date" will therefore skip the first delivery and show the second one.

## Key Constants
- **Lead Time:** The system uses a 7-day lead time (`SUBSCRIPTION_CHARGE_LEAD_DAYS`) for all recurring billing calculations.
- **SMS in production only:** Twilio SMS notifications (`send_admin_payment_notification`, `send_admin_cancellation_notification`, `send_notification`) are guarded by `if not settings.DEBUG:` to suppress SMS during local development. Emails are sent regardless.

## Webhook Events Handled
| Event | Handler | Action |
|---|---|---|
| `payment_intent.succeeded` | `handle_payment_intent_succeeded` | Activates plan, creates Events, creates Stripe Subscription (for subscription plans) |
| `invoice.payment_succeeded` | `handle_invoice_payment_succeeded` | Creates next recurring Event |
| `payment_intent.payment_failed` | `handle_payment_intent_failed` | Marks Payment as failed |
| `setup_intent.succeeded` | `handle_setup_intent_succeeded` | Activates subscription plan (legacy path) |
| `customer.subscription.deleted` | `handle_subscription_deleted` | Marks plan cancelled, cancels scheduled events |
| `account.updated` | `handle_account_updated` | Marks partner Connect onboarding complete |
| `transfer.created` | `handle_transfer_created` | Marks payout and commission as paid |
