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

### 2. Subscription Plans
- **Request:** The frontend calls `create-subscription`, which returns a `PaymentIntent` for the **first delivery only**.
- **Payment:** The user pays for the first delivery immediately. The `PaymentIntent` is configured with `setup_future_usage='off_session'` to authorize future recurring charges.
- **Activation (Webhook):** Upon `payment_intent.succeeded`:
    - The plan status is set to `active`.
    - The **first** delivery `Event` is created immediately.
    - A Stripe **Subscription** is created in the background using the same payment method.
    - A **Trial Period** is applied to the subscription, ending 7 days before the second delivery. This prevents double-billing for the first delivery.
- **Recurring Deliveries (Webhook):** Upon `invoice.payment_succeeded` (recurring):
    - A new `Event` is created for the upcoming delivery (scheduled for 7 days after the invoice date).

## Key Constants
- **Lead Time:** The system uses a 7-day lead time (`SUBSCRIPTION_CHARGE_LEAD_DAYS`) for all recurring billing calculations.
