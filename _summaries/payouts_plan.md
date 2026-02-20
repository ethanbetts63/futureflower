# Payouts Plan

## Overview

Two types of partners receive payouts:
- **Affiliates (referral partners)**: earn a commission whenever a customer they referred makes a payment.
- **Florists (delivery partners)**: earn a commission whenever a customer they signed up declines a delivery request, or a delivery payment when they fulfil one.

Both are paid via Stripe Connect. We collect all money into our platform balance first, then transfer out to each partner's connected Stripe account whenever we choose.

---

## Phase 1: Stripe Connect Onboarding ✅ COMPLETE

Every partner needs a connected Stripe Express account before they can receive any money. This is completed immediately at registration — no waiting for admin approval.

### What was built

1. **Registration (Step 1)**: Partner submits the registration form. Backend creates `User`, `Partner`, and `DiscountCode` records, then immediately calls `stripe.Account.create(type='express')` using our platform secret key. The returned `acct_123abc` ID is saved to `Partner.stripe_connect_account_id`. Partner is redirected to the Stripe setup page.

2. **Stripe setup (Step 2)**: Backend calls `stripe.AccountSession.create()` for the partner's account and returns a short-lived `client_secret`. Frontend uses `@stripe/react-connect-js` to render the embedded Stripe onboarding form directly on our page — no redirect. Partner enters bank and identity details. On exit they land on their partner dashboard.

3. **Webhook confirmation**: Stripe fires `account.updated` to our webhook. If `payouts_enabled` is `True`, we set `Partner.stripe_connect_onboarding_complete = True`.

4. **Admin approval (separate step)**: Admin approves the partner via the admin dashboard. On approval the discount code is activated. No Stripe steps needed at this point.

5. **Dashboard banner**: If `stripe_connect_onboarding_complete` is `False`, a banner on the partner dashboard links them back to `/partner/stripe-connect/onboarding` to complete setup.

### What is stored on the Partner model
- `stripe_connect_account_id` — the `acct_123abc` pointer. All future Stripe interactions reference this.
- `stripe_connect_onboarding_complete` (bool) — set `True` by the `account.updated` webhook when `payouts_enabled` is confirmed.

---

## Phase 2: Paying Partners Out

Payouts are manual and admin-controlled, one at a time. Admin decides when to pay each commission or delivery. The money moves from our Stripe platform balance to the partner's Express account, and Stripe automatically moves it to their bank (typically 2 business days).

### Commission Structure

Commission amounts are calculated at the moment an `Event` is created, using a central utility function `calculate_commission_amount(budget)`. The result is stored directly on the `Event` as `commission_amount` (a decimal field).

The current tier table (defined in the utility):

| Budget        | Commission per delivery |
|---------------|------------------------|
| < $100        | $5                     |
| < $150        | $10                    |
| < $200        | $15                    |
| < $250        | $20                    |
| >= $250       | $25                    |

If the tier table changes in future, we update the utility and optionally run a migration to recalculate `commission_amount` on all undelivered events. Historical delivered events retain whatever amount was snapshotted at creation.

### Who earns a commission

- **Affiliates**: a `Commission` record is created for the referring partner every time a customer they referred successfully pays for a plan. The `commission_amount` is taken from the event.
- **Florists**: a `Commission` record is created when a florist **declines** a delivery request for an event where the customer signed up via that florist's discount code. The florist still earns the commission even though they didn't fulfil the delivery.

Florist delivery payments (for fulfilled deliveries) are handled separately — see below.

### What needs to be built

#### Commission model additions
- Add `commission_amount` field to the `Event` model.
- Add `calculate_commission_amount(budget)` utility in a new file `partners/utils/commission_calc.py`.
- Wire the utility into event creation (webhook handler for new plans) so every event gets its `commission_amount` set on creation.

#### Payout flow — Affiliates

1. **Commission record created**: When a customer payment succeeds, the webhook checks if the customer was referred by a partner (via discount code used at checkout). If yes, create a `Commission` record: `partner`, `event`, `amount` (from `event.commission_amount`), `status='pending'`.

2. **Admin reviews**: Admin visits the partner detail page, sees a list of pending commissions.

3. **Admin pays one commission**: Admin clicks "Pay Out" on a single commission. Backend calls `stripe.Transfer.create()`:
   - `amount`: the commission amount in cents
   - `currency`: the plan currency
   - `destination`: `Partner.stripe_connect_account_id`
   - `transfer_group`: `f"commission_{commission.id}"`

4. **Record the payout**: Create a `Payout` record. Mark the `Commission` as `paid`. Partner sees it in their dashboard.

#### Payout flow — Florists (declined delivery commissions)

Same flow as affiliates above, but the `Commission` record is created when a florist declines a delivery request (instead of at payment time).

#### Payout flow — Florists (fulfilled delivery payments)

1. **Event marked as delivered**: Admin marks an event as delivered via the admin dashboard. This triggers creation of a `DeliveryPayment` record: `partner` (whoever fulfilled it), `event`, `amount` (= `event.budget` — TBD confirm this), `status='pending'`.

2. **Admin reviews**: Admin visits the florist's detail page, sees pending delivery payments.

3. **Admin pays one delivery**: Admin clicks "Pay Out". Backend calls `stripe.Transfer.create()`:
   - `amount`: the delivery payment amount in cents
   - `currency`: the plan currency
   - `destination`: `Partner.stripe_connect_account_id`
   - `transfer_group`: `f"delivery_{delivery_payment.id}"`

4. **Record the payout**: Create a `Payout` record. Mark the `DeliveryPayment` as `paid`. Partner sees it in their dashboard.

---

## Edge Cases to Handle

- **Insufficient platform balance**: Stripe Transfer will fail with an error. We surface this to admin and do not mark anything as paid.
- **Transfer failures**: Log the Stripe error against the payout attempt so admin can retry.
- **Refunds**: If a customer is refunded, cancel any `pending` commissions linked to that payment. If already `paid`, a Transfer Reversal may be needed.
- **Partner not yet verified**: Block "Pay Out" if `stripe_connect_onboarding_complete` is `False`.
- **Onboarding abandoned**: `stripe_connect_account_id` is still saved. Re-generate a client secret and send partner back to the onboarding page at any time via the dashboard banner.
