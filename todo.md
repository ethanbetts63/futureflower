# ForeverFlower Refactor Plan

## 1. Collapse SingleDeliveryPlan into UpfrontPlan
**Status:** TODO
**Priority:** High

`SingleDeliveryPlan` is functionally identical to an `UpfrontPlan` with `deliveries_per_year=1` and `years=1`. Maintaining it as a separate model means every feature (cancellations, refunds, rescheduling, admin tooling) must be implemented three times instead of two.

### What needs to change:
- **Backend model:** Delete `SingleDeliveryPlan` model entirely. Migration to move any existing rows into `UpfrontPlan` with `deliveries_per_year=1, years=1`.
- **Backend views:** Remove `SingleDeliveryPlanViewSet`. The `UpfrontPlanViewSet` already handles everything -- the `get-or-create-pending` action just needs to accept a parameter indicating single-delivery mode so it can pre-set `deliveries_per_year=1, years=1`.
- **Backend serializer:** Remove `SingleDeliveryPlanSerializer`.
- **Backend webhook handler:** Remove the `SINGLE_DELIVERY_PLAN_NEW` branch from `handle_payment_intent_succeeded`. The `UPFRONT_PLAN_NEW` branch already activates the plan -- we just need to also create the Event there (which it should already do via `perform_create` event generation).
- **Backend pricing:** Single delivery pricing (budget + max(5%, $15)) is already a special case of the upfront annuity calc when years=1 and deliveries_per_year=1. Verify the annuity formula collapses correctly for N=1.
- **Frontend API:** Remove `singleDeliveryPlans.ts`. Single delivery calls go through `upfrontPlans.ts`.
- **Frontend types:** Remove `SingleDeliveryPlan`, `PartialSingleDeliveryPlan`, etc. Use `UpfrontPlan` everywhere.
- **Frontend routes:** The single-delivery flow pages become thin wrappers (or conditional branches) within the upfront flow. The key difference is the structure page: single delivery shows budget + date + message; upfront shows budget + deliveries/year + years + messages.
- **Frontend dashboard:** Single delivery overview pages can reuse upfront management pages since the data model is the same.
- **EventGate:** Instead of three branches, just two: upfront (with an optional `singleDelivery=true` flag) and subscription.
- **PaymentInitiatorButton:** Remove `SINGLE_DELIVERY_PLAN_NEW` item type. Use `UPFRONT_PLAN_NEW` for both.

### Risk:
- Existing `SingleDeliveryPlan` records in production need migration.
- The annuity discount formula for N=1 must produce the same result as the current flat fee calculation. Need to verify: when years=1, the annuity factor is `(1 - (1.04)^-1) / 0.04 = 0.9615...`, which means 1 year at budget+fee would be discounted ~3.8%. This is NOT the same as the current single delivery pricing. **Decision needed:** Do we want single deliveries to get the annuity discount or not? If not, the upfront calc needs a bypass for years=1.

---

## 2. Unify the Frontend Flow (Upfront + Single Delivery)
**Status:** TODO
**Priority:** High (depends on #1)

Once the model is unified, we need a single flow that adapts its UI based on whether the user is doing a single delivery or a multi-year plan.

### Approach:
- Keep the flow steps: Account -> Recipient -> Preferences -> Structure -> Confirmation -> Payment -> Status
- The **Structure page** is the only step that truly differs:
  - **Single delivery mode:** Shows budget, delivery date, and a single message field.
  - **Multi-delivery mode:** Shows budget, deliveries/year, years, and links to the messages page.
- Use a `flowMode` variable (derived from the plan's `deliveries_per_year` and `years` values, or from a URL parameter) to switch between the two structure UIs.
- The existing `StructureEditor` component can be extended with a mode prop, or we can conditionally render either the existing `StructureEditor` or `SingleDeliveryStructureEditor` based on `flowMode`.
- The messages step can be skipped entirely in single-delivery mode (the message is collected on the structure page).

---

## 3. Extract Shared Fee Calculation Utility
**Status:** TODO
**Priority:** Medium

The service fee formula `max(budget * 0.05, 15.00)` is computed inline in three places:
1. `SingleDeliveryPlanViewSet.calculate_price()` (line 69 of `single_delivery_plan_view.py`)
2. `SubscriptionPlanViewSet.calculate_price()` (inline in the view)
3. `UpfrontPlanViewSet` / `upfront_price_calc.py` (uses same formula but wrapped in annuity math)

Additionally, the same formula is re-computed during `partial_update` validation in both the single delivery and subscription views.

### What needs to change:
- Create `events/utils/fee_calc.py` with a single function:
  ```python
  def calculate_service_fee(budget: Decimal, commission_pct=Decimal('0.05'), min_fee=Decimal('15.00')) -> Decimal:
      return max(budget * commission_pct, min_fee)
  ```
- Update `upfront_price_calc.py` to import and use this function instead of computing inline.
- Update `SubscriptionPlanViewSet.calculate_price()` to use it.
- After #1, the single delivery view is gone, so no update needed there.
- Update any `partial_update` validation that recalculates fees to use this function.

**Why this matters:** If the fee structure changes (e.g., 7% commission, $20 minimum), you currently need to find and update it in 5+ places. With a single utility, it's one change.

---

## 4. Make EventGate Less Brittle
**Status:** TODO
**Priority:** Medium

Currently `EventGate` determines flow type by checking `location.pathname.includes('subscription')` and `location.pathname.includes('single-delivery')`. A URL rename silently breaks routing.

### Proposed fix:
- Use explicit route parameters instead of pathname sniffing. Define three routes:
  ```
  /event-gate/upfront     -> EventGate with flowType="upfront"
  /event-gate/subscription -> EventGate with flowType="subscription"
  /event-gate/single       -> EventGate with flowType="single"
  ```
  After #1 collapses single delivery into upfront, this simplifies to:
  ```
  /event-gate/upfront      -> EventGate (default, also handles single delivery via query param)
  /event-gate/subscription -> EventGate
  ```
- Pass `flowType` as a route param (`:flowType`) or read it from a well-defined part of the path rather than substring matching.
- The create-account redirect should preserve the flow type in the `?next=` param (already works, just cleaner with explicit params).
- After refactor, the unauthenticated redirect path should also be made generic (currently hardcoded to `/upfront-flow/create-account` -- should just be `/create-account` since account creation is flow-agnostic).

---

## 5. Webhook Idempotency Guards
**Status:** TODO
**Priority:** High

Stripe retries webhooks up to ~15 times over 72 hours if it doesn't receive a 200 response. If your server processes a webhook but crashes before returning 200, Stripe will resend it. Without idempotency guards, this creates duplicate records.

### Current vulnerabilities:

**`handle_payment_intent_succeeded` (single delivery path):**
- Line 51-55: `Event.objects.create(...)` runs unconditionally. If Stripe retries, you get duplicate Events for the same delivery.
- The `Payment.status = 'succeeded'` update is safe (idempotent -- setting to the same value), but the Event creation is not.

**`handle_invoice_payment_succeeded` (subscription path):**
- Line 84-90: `Payment.objects.create(...)` runs every time. If Stripe retries, you get duplicate Payment records for the same invoice.
- Line 101-105: `Event.objects.create(...)` also runs unconditionally -- duplicate deliveries.

**`handle_setup_intent_succeeded`:**
- This one is actually safe. Setting `status = 'active'` is idempotent.

### Proposed fix:
- **For `handle_payment_intent_succeeded`:** Before creating the Event, check if one already exists for this order + delivery_date combination: `Event.objects.filter(order=plan.orderbase_ptr, delivery_date=plan.start_date).exists()`. Skip creation if it does.
- **For `handle_invoice_payment_succeeded`:** Use `Payment.objects.get_or_create(stripe_payment_intent_id=invoice.get('payment_intent'), defaults={...})` instead of `Payment.objects.create(...)`. The `stripe_payment_intent_id` is already unique in your model, so this naturally deduplicates. Similarly guard the Event creation.
- **General pattern:** At the top of each handler, check if the work has already been done. Return early if so. This makes every handler safe to call multiple times with the same payload.

---

## 6. Fix SubscriptionPlan Frontend Type Hierarchy
**Status:** TODO (needs discussion)
**Priority:** Medium

Currently:
```typescript
// UpfrontPlan.ts
export interface UpfrontPlan {
    id: number;
    budget: string;
    deliveries_per_year: number;  // upfront-specific
    years: number;                // upfront-specific
    total_amount: number;         // upfront-specific
    // ...shared fields...
}

// SubscriptionPlan.ts
export interface SubscriptionPlan extends UpfrontPlan {
    frequency: string;
    price_per_delivery: number;
    stripe_subscription_id: string | null;
    // ...
}
```

**The problem:** `SubscriptionPlan` inherits `deliveries_per_year`, `years`, and `total_amount` from `UpfrontPlan`. These fields don't exist on the Django `SubscriptionPlan` model and are meaningless for subscriptions. This is misleading for anyone reading the types, and could cause bugs if someone tries to access `subscriptionPlan.years` expecting it to mean something.

**Discussion points:**
- The clean fix is to have both `UpfrontPlan` and `SubscriptionPlan` extend `OrderBase` independently, each adding only their own fields. This is how the Django models are already structured.
- However, this means the `UpfrontPlan` type needs to be split: the shared fields go into `OrderBase`, and `deliveries_per_year`/`years`/`total_amount` move into `UpfrontPlan` only.
- `UpfrontPlan` currently *is* the de facto `OrderBase` on the frontend (it contains all the shared fields). So the real question is: should we create a proper `OrderBase` frontend type and have both extend it?
- Note: `OrderBase.ts` already exists with the shared fields, and `SingleDeliveryPlan` correctly extends it. It's just `UpfrontPlan` that was written as a standalone type duplicating the shared fields, and then `SubscriptionPlan` inherited from the wrong parent.

---

## 7. Add Terminal Status Values to OrderBase
**Status:** TODO (just do it)
**Priority:** Medium

Currently `OrderBase.STATUS_CHOICES` only has:
```python
('pending_payment', 'Pending Payment'),
('active', 'Active'),
('completed', 'Completed'),
```

Missing statuses needed for real operations:
- `'cancelled'` - User cancels their plan
- `'refunded'` - Payment was refunded
- `'paused'` - Subscription temporarily paused (future)

### What needs to change:
- Add `cancelled` and `refunded` to `STATUS_CHOICES` on `OrderBase`.
- Create a migration.
- No other code changes needed right now -- these are just new valid states. The views and webhook handlers will use them when we build cancellation/refund flows.

---

## Execution Order

1. **#7 - Add status values** (standalone, no dependencies, quick win)
2. **#3 - Extract fee utility** (standalone, reduces duplication before the big refactor)
3. **#5 - Webhook idempotency** (standalone, critical for production safety)
4. **#1 - Collapse SingleDeliveryPlan** (big refactor, depends on fee utility being extracted)
5. **#4 - Fix EventGate** (depends on #1 to know the final routing shape)
6. **#2 - Unify frontend flow** (depends on #1 and #4)
7. **#6 - Fix type hierarchy** (can be done during #1/#2 or after)
