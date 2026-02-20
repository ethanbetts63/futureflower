# Payouts Plan

## Overview

Two types of partners receive payouts:
- **Affiliates (referral partners)**: earn a commission when a customer they referred makes a payment.
- **Florists (delivery partners)**: earn a payment when they deliver flowers for an event, or a commission if they choose to decline.

Both are paid via Stripe Connect. We collect all money into our platform balance first, then transfer out to each partner's connected Stripe account whenever we choose.

---

## Phase 1: Stripe Connect Onboarding

Every partner needs a connected Stripe Express account before they can receive any money. This is a one-time setup per partner, completed immediately at registration — no waiting for admin approval.

### Step 1 — Partner registration form

The partner fills in their details and submits the form. Our backend does two things in one go:
1. Creates the `User` and `Partner` records in our database (status: `pending`, discount code: inactive).
2. Calls the Stripe API to create a **Stripe Express account** linked to our platform. See the note below on how this linking works.

Stripe returns an account ID (e.g. `acct_123abc`). We save this immediately to `Partner.stripe_account_id` in our database.

The partner is then redirected to Step 2.

---

**How does Stripe know the Express account belongs to us?**

When we call the Stripe API to create the Express account, we make that call using our platform's secret API key. This is what links it to us — Stripe sees that the request came from our platform account and registers the new Express account as a "connected account" sitting underneath us. We never share our secret key with the partner; we just use it server-side to create an account on their behalf. From Stripe's perspective, `acct_123abc` is a sub-account that we own and control. We can send money to it, check its status, and manage it — but the partner controls their own bank details and identity information within it.

---

**What do we store in our database?**

On the `Partner` model we store:
- `stripe_account_id` — the `acct_123abc` ID returned by Stripe when we create the account. This is the only thing we need. Every future interaction (sending money, checking verification status) references this ID.
- `stripe_onboarding_complete` (bool) — set to `True` when Stripe confirms via webhook that the partner has finished entering their details and `payouts_enabled` is `True` on their account.

We do NOT store any bank account numbers, BSBs, or identity documents. Stripe handles all of that inside the Express account. We only ever hold the ID that points to it.

---

### Step 2 — Stripe onboarding (embedded on our site)

The partner lands on our Stripe setup page. Here is what happens behind the scenes:

1. Our backend calls Stripe's **Account Sessions API**, passing in the `acct_123abc` we just created. Stripe returns a short-lived **client secret** (valid for a few minutes, single use).
2. Our backend passes this client secret to the frontend.
3. The frontend loads Stripe's JavaScript library and uses the client secret to render an embedded onboarding form directly inside our page — no redirect to stripe.com.
4. The partner enters their bank account details (BSB, account number) and identity information (name, DOB, address) inside this form.
5. When they click finish, Stripe receives and stores all of that information against `acct_123abc`. We never see it.

The client secret is what tells Stripe's embedded component which Express account to collect information for. Without it, the component won't render. It expires quickly so it can't be reused or stolen.

### Step 3 — Partner lands on their dashboard

After completing the Stripe form, the partner is redirected to their partner dashboard. Their status is `pending` and their discount code is inactive — but Stripe setup is done.

### Step 4 — Webhook confirms Stripe verification

At some point after Step 2 (usually within minutes, sometimes longer if Stripe needs to manually review identity), Stripe fires an `account.updated` webhook to our server. We check:
- `payouts_enabled` is `True` on the account object

If yes, we set `Partner.stripe_onboarding_complete = True`. This is the flag we check before ever attempting a payout.

### Step 5 — Admin approves the partner

Admin reviews the application and approves them via the admin dashboard (already built). On approval, the discount code is activated. No Stripe steps are needed at this point — Stripe is already set up.

---

## Phase 2: Paying Partners Out

Payouts are manual and admin-controlled. We decide when to pay, and how much. The money moves from our Stripe platform balance to the partner's connected Express account, and then Stripe automatically moves it from there to their bank account on its own schedule (typically 2 business days).

### Affiliates (commission payments)

#### Step 1 — Commission is recorded on payment
When a customer payment succeeds, our webhook handler checks whether the customer was referred by a partner. If so, we create a `Commission` record with the calculated amount and status `pending`. This already happens.

#### Step 2 — Admin reviews pending commissions
Admin visits the partner detail page and sees a list of pending commissions with their amounts and associated payments.

#### Step 3 — Admin initiates a payout
Admin clicks "Pay Out" (for a specific commission, or a batch). Our backend sums the selected commissions and calls the Stripe Transfers API:
- Amount: sum of selected commissions
- Destination: `Partner.stripe_account_id`
- Transfer group: the relevant payment or payout reference

#### Step 4 — We record the payout
We create a `Payout` record linked to the partner and the commissions paid. We mark those commissions as `paid`. The partner's Stripe Express account now holds the funds and Stripe will move it to their bank automatically.

#### Step 5 — Payout shown to partner
The partner can see the payout in their dashboard (already partially built).

---

### Florists (delivery payments)

#### Step 1 — Event is marked as delivered
Admin marks an event as delivered via the admin dashboard (already built). At this point a payment to the florist becomes due.

#### Step 2 — Delivery payment record is created
When an event is marked delivered, our backend creates a `DeliveryPayment` record with the agreed amount and status `pending`. The amount is either a fixed rate, the event budget, or manually entered by admin — TBD.

#### Step 3 — Admin reviews pending delivery payments
Admin visits the florist's detail page and sees all pending delivery payments with their amounts and associated events.

#### Step 4 — Admin initiates a payout
Admin clicks "Pay Out". Our backend calls the Stripe Transfers API:
- Amount: the delivery payment amount
- Destination: `Partner.stripe_account_id`
- Transfer group: the relevant event or order reference

#### Step 5 — We record the payout
We create a `Payout` record linked to the florist and the delivery payment. We mark the delivery payment as `paid`.

#### Step 6 — Payout shown to partner
The florist can see the payout in their partner dashboard.

---

## Edge Cases to Handle

- **Insufficient platform balance**: If our Stripe balance is too low to cover a transfer, the Stripe API will return an error. We surface this to admin and do not mark the commission/delivery payment as paid.
- **Transfer failures**: We log all Stripe API errors against the payout attempt so admin can retry.
- **Refunds**: If a customer is refunded, any associated pending commissions should be cancelled. If a commission was already paid out, a Transfer Reversal via the Stripe API may be needed.
- **Partner not yet verified**: We block the "Pay Out" button if `stripe_onboarding_complete` is not `True` on the partner record.
- **Onboarding abandoned**: If a partner completes Step 1 but never finishes the Stripe form, we still have the `stripe_account_id`. We can re-generate a new client secret and send them back to the form at any time.
