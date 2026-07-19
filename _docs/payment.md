# Stripe Payment Process

This document describes the Stripe checkout flow for one-time (`one_time`) and
recurring (`recurring`) orders as currently implemented.

## Entry point: guest checkout

Checkout runs through the guest-checkout API (`events/views/guest_checkout_view.py`),
which is authorized by an opaque httponly cookie that maps to exactly one draft
`Order`. The relevant actions:

| Action (`/api/events/guest-checkout/<action>/`) | Purpose |
|---|---|
| `start` | Create/continue the draft order from the homepage brief. |
| `order` (GET/POST) | Read or patch the draft (recipient, dates, notes, etc.). |
| `make-recurring` | Flip the draft to `billing_mode='recurring'` with a frequency. |
| `discount` | Validate and apply a discount code to the draft. |
| `claim` | Attach the customer's name/email to the draft before payment. |
| `accept-terms` | Record the customer's terms acceptance. |
| `checkout` | Validate the order and start the Stripe payment. |

The `checkout` action calls `payments/utils/checkout.py::start_order_payment`,
the single place charges are started, so the amount Stripe charges and the
amount recorded on the local `Payment` cannot drift apart.

## Unified confirmation UX

Both order types hand the browser a PaymentIntent **client secret**, confirmed
with Stripe Elements (`frontend/src/app/checkout/CheckoutForm.tsx`,
`PaymentElement`). The frontend does not know or care which billing mode
produced the secret.

The publishable key must be exposed to the browser as
`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (Next.js only forwards `NEXT_PUBLIC_`-
prefixed vars).

### One-time orders — plain PaymentIntent

`_start_one_time_payment`:
1. Reuses an existing pending PaymentIntent when its amount still matches,
   otherwise cancels the stale one (`reuse_or_cancel_pending_payment_intent`) —
   re-entering checkout is idempotent.
2. Creates a PaymentIntent for `order.total_amount` (discount included, clamped
   to Stripe's $0.50 minimum) with `automatic_payment_methods` and metadata
   (`order_id`, `billing_mode`, `discount_code`).
3. Records a pending `Payment` and returns the client secret.

### Recurring orders — native Stripe Subscription at checkout

`_start_subscription_payment` creates the real Stripe Subscription **up front**
(no more webhook-created subscriptions), using Stripe's
charge-now-recur-later pattern:

- **`add_invoice_items`** — a one-off item for the first delivery
  (undiscounted `subtotal`). Stripe invoices this immediately despite the
  trial, so **money is taken at signup**. That first invoice's PaymentIntent
  is what the browser confirms.
- **`trial_end`** = second delivery − `SUBSCRIPTION_CHARGE_LEAD_DAYS` (7).
  The recurring price contributes $0 until then, preventing double-billing of
  the first delivery, and anchoring every later invoice 7 days before its
  delivery.
- **`items.price_data.unit_amount`** = undiscounted `subtotal` — recurring
  deliveries are always full price.
- **`discounts`** = a `duration='once'` coupon minted from the order's discount
  code. Stripe applies it to the first invoice only and retires it itself.
  (Amount clamped so the first invoice stays ≥ $0.50.)
- **`payment_behavior='default_incomplete'`** +
  **`payment_settings.save_default_payment_method='on_subscription'`** — no
  charge is attempted server-side; the confirmed card becomes the
  subscription's default for all future invoices.
- Client secret comes from `latest_invoice.confirmation_secret`
  (API ≥ 2025-03-31.basil removed `invoice.payment_intent`).

`stripe_subscription_id` is saved on the order immediately, and a pending
`Payment` is recorded with the PaymentIntent id parsed from the client secret.

Idempotency: `_reuse_incomplete_subscription` reuses an incomplete
subscription whose first invoice still matches the total; anything stale is
cancelled and recreated. Mode switches clean up after themselves: a one-time
checkout cancels a leftover incomplete subscription, and a recurring checkout
cancels a leftover plain PaymentIntent.

## Fulfillment (webhooks)

Handled in `payments/utils/webhook_handlers.py`.

### `payment_intent.succeeded` → `handle_payment_intent_succeeded`
Fires for one-time orders **and** the first invoice of a subscription; both are
fulfilled identically:
- Mark the `Payment` succeeded (idempotent).
- Record `DiscountUsage` from `order.discount_code` (not PI metadata — the
  subscription's invoice-generated PI carries no metadata of ours).
- Process referral commission.
- Activate the order, create the first delivery `Event` (`start_date`).

### `invoice.payment_succeeded` → `handle_invoice_payment_succeeded`
- **Skips `billing_reason='subscription_create'`** — that first invoice is
  fulfilled via the PaymentIntent path above.
- For each later billing cycle: create a `Payment` (idempotent), process
  commission, create the delivery `Event` for
  `invoice_created_date + SUBSCRIPTION_CHARGE_LEAD_DAYS`.
- Payload-shape note (API ≥ basil): the subscription id lives at
  `invoice.parent.subscription_details.subscription`
  (`_invoice_subscription_id`), and the PaymentIntent id must be resolved via
  the invoice's `payments` expansion (`_invoice_payment_intent_id`); both
  helpers also accept pre-basil payloads.

### `customer.subscription.deleted` → `handle_subscription_deleted`
- A `pending_payment` draft (abandoned checkout whose incomplete subscription
  expired) is just detached from the dead subscription — the draft survives.
- Otherwise the order is cancelled and its scheduled events + notifications
  cancelled.

## Discounts

- A discount code lowers the draft's `total_amount`
  (`Order._recalculate_price`: `total_amount = subtotal − discount_amount`).
- One-time orders: discount is simply part of the PaymentIntent amount.
- Recurring orders: discount is a `duration='once'` Stripe coupon — first
  invoice only, recurring price untouched.
- **Once per email:** a code can be redeemed once per customer email
  (`_discount_already_used_by_email`). Checked at apply time when the session
  already has an email, and authoritatively in the `checkout` action, which
  strips the code and 400s if the claiming email already redeemed it. (Guests
  get a fresh placeholder user per order, so email — set at claim — is the only
  identity that persists. Card-fingerprint tracking is the stronger future
  upgrade.)
- `DiscountUsage` is recorded in the `payment_intent.succeeded` handler.

## Next Payment / Delivery Date Calculation

Computed in `payments/utils/subscription_dates.py`, exposed by the serializer as
`next_payment_date` and `next_delivery_date`.

- `get_next_payment_date(plan)` anchors from `start_date − SUBSCRIPTION_CHARGE_LEAD_DAYS`
  and advances by the plan's frequency until the date is in the future.
- `get_next_delivery_date(plan)` = `get_next_payment_date(plan) + SUBSCRIPTION_CHARGE_LEAD_DAYS`.

**Known limitation:** these always return the next *subscription-cycle* date, so
for a just-activated plan the displayed "Next Delivery Date" skips the
already-paid first delivery and shows the second.

## Key Constants

- **`SUBSCRIPTION_CHARGE_LEAD_DAYS` (7):** lead time used for all recurring
  billing/date math.
- **Stripe keys:** backend reads `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` /
  `STRIPE_PUBLISHABLE_KEY`; frontend reads
  `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
- **SMS in production only:** Twilio notifications are guarded by
  `if not settings.DEBUG:`; emails send regardless.

## Webhook Events Handled

| Event | Handler | Action |
|---|---|---|
| `payment_intent.succeeded` | `handle_payment_intent_succeeded` | Activate order, create first Event (both billing modes) |
| `invoice.payment_succeeded` | `handle_invoice_payment_succeeded` | Create next recurring Event (skips `subscription_create`) |
| `payment_intent.payment_failed` | `handle_payment_intent_failed` | Mark Payment failed |
| `customer.subscription.deleted` | `handle_subscription_deleted` | Detach dead sub from drafts; cancel active orders + scheduled events |
| `account.updated` | `handle_account_updated` | Mark partner Connect onboarding complete |
| `transfer.created` | `handle_transfer_created` | Mark payout and commission paid |
