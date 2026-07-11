# Unified Order Flow Migration Plan

## Goal

Replace the current split between single delivery, upfront plans, and subscriptions with one customer ordering flow and one backend order model.

The target product should be:

1. Customer gives a florist brief.
2. Customer adds recipient and delivery details.
3. Customer reviews the order.
4. Customer optionally makes the order recurring.
5. Checkout handles either a one-time order or a recurring order from the same flow.

The long-term technical goal is to remove duplicated plan models, duplicated API clients, duplicated frontend routes, duplicated payment endpoints, and fake single-delivery encoding.

## Execution Status

### Completed in First Pass

- Added `billing_mode` and `recurring_preferences` to `OrderBase`.
- Added a unified `OrderSerializer` and `OrderViewSet`.
- Added `GET /api/events/orders/get-or-create-draft/` as the new draft entry point.
- Added `POST /api/events/orders/{id}/make-recurring/` as a migration bridge from the one-flow review step into the existing subscription payment backend.
- Added frontend `Order` types and `orders` API helpers.
- Changed the public event gate so both single delivery and subscription intent start from the unified draft order route.
- Added the recurring opt-in section to the single delivery confirmation step.
- Redirected `/order` to the homepage and moved visible order CTAs back to `/`.
- Removed the standalone public subscription acquisition route under `/subscribe-flow`.
- Removed orphaned public product-selection and subscription-flow page components.
- Kept existing dashboard subscription management screens for active customer subscriptions.

### Completed in Second Pass (Phase 3: Unified Checkout)

- Added `POST /api/events/orders/{id}/checkout/` on `OrderViewSet`. It resolves `billing_mode` from the order (or its legacy child type), computes the charge the same way for both one-time and recurring orders, and creates a single Stripe PaymentIntent (with `setup_future_usage='off_session'` for recurring).
- Extracted shared payment helpers into `payments/utils/checkout.py`: `ensure_stripe_customer`, `get_staff_override_amount`, `reuse_or_cancel_pending_payment_intent`. Both the new checkout endpoint and the legacy `create_payment_intent.py` / `create_subscription_view.py` views now use these instead of duplicating the logic.
- Checkout metadata carries `order_id` and `billing_mode` going forward, but still includes the legacy `item_type` value so the existing webhook fulfillment branches in `payments/utils/webhook_handlers.py` (keyed off `Payment.order`) keep working unchanged — no Phase 4 webhook rewrite needed yet.
- Added `startCheckout(orderId)` to `frontend/src/api/orders.ts`.
- `PaymentInitiatorButton` gained an `ORDER_CHECKOUT` item type that calls `startCheckout`; `UpfrontSummary.tsx`'s main "Next: Payment" button and its recurring-conversion bridge (`handleRecurringPayment`) both now go through the unified endpoint instead of `createPaymentIntent`/`createSubscription` directly.
- Fixed a latent bug in `create_subscription_view.py` where the staff $1 override was applied to the Stripe charge but the locally recorded `Payment.amount` still stored the full plan price.

### Still Outstanding

- Replace the legacy single-delivery route naming with neutral order route names.
- `payments/views/create_payment_intent.py` (for `UPFRONT_PLAN_MODIFY`) and `create_subscription_view.py` are no longer called by any live frontend flow but haven't been deleted — the plan-price-change flow (`UPFRONT_PLAN_MODIFY`) has no current caller either.
- Replace the migration bridge that copies an order into `SubscriptionPlan` with direct mutation of one unified order row.
- Collapse dashboard order/subscription tables into a single order table once active subscription management has been adapted.
- Rewrite `payments/utils/webhook_handlers.py` around `Order.billing_mode` instead of legacy `item_type` branches (Phase 4).
- Remove `UpfrontPlan` and `SubscriptionPlan` child models after data migration and payment refactor.

## Current State

### Frontend Flow

There are separate customer paths today:

- Homepage starter form creates a single-delivery draft.
- Single delivery flow uses `UpfrontPlan` internally.
- Subscription flow uses `SubscriptionPlan` internally.
- Legacy order/product selection page still exists.

Current single delivery path:

- `frontend/src/components/home_page/HomeStarterForm.tsx`
- `frontend/src/components/form_flow/EventGate.tsx`
- `frontend/src/page_components/single_delivery_flow/Step2RecipientPage.tsx`
- `frontend/src/page_components/single_delivery_flow/Step3PreferencesPage.tsx`
- `frontend/src/page_components/single_delivery_flow/Step4StructurePage.tsx`
- `frontend/src/page_components/single_delivery_flow/Step5ConfirmationPage.tsx`
- `frontend/src/components/form_flow/SingleDeliveryStructureEditor.tsx`
- `frontend/src/forms/SingleDeliveryStructureForm.tsx`
- `frontend/src/components/UpfrontSummary.tsx`

Current subscription path:

- `frontend/src/page_components/subscription_flow/Step2RecipientPage.tsx`
- `frontend/src/page_components/subscription_flow/Step3PreferenceSelectionPage.tsx`
- `frontend/src/page_components/subscription_flow/Step4StructurePage.tsx`
- `frontend/src/page_components/subscription_flow/Step5ConfirmationPage.tsx`
- `frontend/src/components/form_flow/SubscriptionStructureEditor.tsx`
- `frontend/src/forms/SubscriptionStructureForm.tsx`
- `frontend/src/components/SubscriptionSummary.tsx`

Current user dashboard has separate subscription management pages:

- `frontend/src/page_components/user_dashboard/subscription_management/SubscriptionPlanOverviewPage.tsx`
- `frontend/src/page_components/user_dashboard/subscription_management/EditStructurePage.tsx`
- `frontend/src/page_components/user_dashboard/subscription_management/EditRecipientPage.tsx`
- `frontend/src/page_components/user_dashboard/subscription_management/EditPreferencesPage.tsx`
- `frontend/src/page_components/user_dashboard/subscription_management/CancelSubscriptionPage.tsx`

### Backend Flow

The backend uses multi-table inheritance:

- `events/models/order_base.py`
- `events/models/upfront_plan.py`
- `events/models/subscription_plan.py`

Most order fields live on `OrderBase`. Child models add very little:

- `UpfrontPlan` adds `years`.
- `SubscriptionPlan` adds `stripe_subscription_id` and `subscription_message`.

Single delivery is not a first-class concept. It is represented as:

```text
UpfrontPlan(years=1, frequency='annually')
```

That encoding creates special cases across frontend, backend, dashboard, and payment code.

### Payment Flow

There are two payment endpoints:

- `payments/views/create_payment_intent.py`
- `payments/views/create_subscription_view.py`

The subscription endpoint is mostly the same as the payment-intent endpoint, except it:

- loads a `SubscriptionPlan`
- sets `setup_future_usage='off_session'`
- writes Stripe metadata as `SUBSCRIPTION_PLAN_NEW`

Webhook handling branches by item type:

- `UPFRONT_PLAN_NEW`
- `UPFRONT_PLAN_MODIFY`
- `SUBSCRIPTION_PLAN_NEW`
- `SUBSCRIPTION_PLAN_RECURRING`

The real difference worth preserving is fulfillment:

- one-time delivery creates one event
- prepaid multi-delivery creates all projected events after payment
- recurring delivery creates first event after payment, then future events from Stripe invoice webhooks

## Target Architecture

### Single Backend Model

Replace `OrderBase`, `UpfrontPlan`, and `SubscriptionPlan` with one canonical `Order` model.

Recommended fields:

```python
class Order(models.Model):
    BILLING_MODE_CHOICES = (
        ("one_time", "One-time"),
        ("recurring", "Recurring"),
        ("prepaid", "Prepaid"),
    )

    STATUS_CHOICES = (
        ("draft", "Draft"),
        ("pending_payment", "Pending Payment"),
        ("active", "Active"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
        ("refunded", "Refunded"),
    )

    user = ForeignKey(User)
    status = CharField(...)
    billing_mode = CharField(...)
    currency = CharField(...)

    budget = DecimalField(...)
    subtotal = DecimalField(...)
    discount_code = ForeignKey(...)
    discount_amount = DecimalField(...)
    tax_amount = DecimalField(...)
    total_amount = DecimalField(...)

    frequency = CharField(null=True, blank=True)
    start_date = DateField(null=True, blank=True)
    years = PositiveIntegerField(null=True, blank=True)

    stripe_subscription_id = CharField(null=True, blank=True)
    recurring_preferences = TextField(null=True, blank=True)

    recipient fields...
    delivery_notes...
    preferred_delivery_time...
    preferred_flower_types...
    flower_notes...
    draft_card_messages...
```

Use `billing_mode` instead of class type:

- `one_time`: one paid delivery
- `recurring`: Stripe subscription after first payment
- `prepaid`: optional future support for multi-delivery upfront plans

If prepaid plans are not strategically important, defer them and support only `one_time` and `recurring`.

### Single Order API

Replace plan-specific APIs with one order API:

```text
GET    /api/orders/
POST   /api/orders/
GET    /api/orders/{id}/
PATCH  /api/orders/{id}/
POST   /api/orders/{id}/cancel/
POST   /api/orders/{id}/checkout/
```

Draft creation:

```text
POST /api/orders/
{
  "billing_mode": "one_time",
  "budget": 125,
  "flower_notes": "...",
  ...
}
```

Recurring conversion:

```text
PATCH /api/orders/{id}/
{
  "billing_mode": "recurring",
  "frequency": "monthly",
  "recurring_preferences": "Keep it seasonal and varied. Avoid lilies."
}
```

### Single Checkout Endpoint

Replace:

- `POST /api/payments/create-payment-intent/`
- `POST /api/payments/create-subscription/`

With:

```text
POST /api/orders/{id}/checkout/
```

Backend decides what to do from `order.billing_mode`.

For `one_time`:

- create PaymentIntent
- no `setup_future_usage`
- metadata: `order_id`, `billing_mode=one_time`

For `recurring`:

- create PaymentIntent for first delivery
- set `setup_future_usage='off_session'`
- metadata: `order_id`, `billing_mode=recurring`
- webhook creates Stripe Subscription after first payment succeeds

### Single Webhook Fulfillment Path

In `payments/utils/webhook_handlers.py`, replace plan-class branches with order-mode branches:

```python
if billing_mode == "one_time":
    activate_order(order)
    create_first_event(order)

elif billing_mode == "recurring":
    activate_order(order)
    create_first_event(order)
    create_stripe_subscription(order, payment_method)

elif billing_mode == "prepaid":
    activate_order(order)
    create_projected_events(order)
```

Invoice webhooks stay recurring-only:

```python
order = Order.objects.get(stripe_subscription_id=subscription_id)
create_recurring_event(order, invoice)
```

## Target Frontend Flow

### One Customer Route

Replace separate flow route families:

- `/single-delivery-flow/plan/[planId]/...`
- `/subscribe-flow/subscription-plan/[planId]/...`

With:

```text
/order/[orderId]/recipient
/order/[orderId]/details
/order/[orderId]/review
/checkout
```

Homepage should create or resume a draft order and route into the same flow.

### Final Review Recurring Section

The review step should contain:

```text
Make this a recurring delivery?
[No] [Yes]

If yes:
Frequency
- Weekly
- Fortnightly
- Monthly
- Annually

Recurring delivery preferences
"Would you like each delivery to vary, follow the same style, avoid certain flowers, or change with the seasons?"
```

Do not create per-delivery flower preferences in version one. That would reintroduce complexity.

### Frontend API Client

Replace:

- `frontend/src/api/upfrontPlans.ts`
- `frontend/src/api/subscriptionPlans.ts`
- `frontend/src/api/singleDeliveryPlans.ts`

With:

- `frontend/src/api/orders.ts`

Recommended functions:

```ts
getOrCreateDraftOrder()
getOrder(orderId)
updateOrder(orderId, payload)
getOrders()
cancelOrder(orderId, options?)
startCheckout(orderId)
```

### Frontend Types

Replace:

- `UpfrontPlan`
- `SubscriptionPlan`
- `SingleDeliveryPlan`
- `PartialUpfrontPlan`
- `PartialSubscriptionPlan`
- `PartialSingleDeliveryPlan`
- `Plan = UpfrontPlan | SubscriptionPlan`

With:

```ts
type BillingMode = 'one_time' | 'recurring' | 'prepaid';

type Order = {
  id: number;
  status: string;
  billing_mode: BillingMode;
  budget: number;
  total_amount: number;
  frequency: string | null;
  start_date: string | null;
  years: number | null;
  stripe_subscription_id: string | null;
  recurring_preferences: string | null;
  ...
};
```

## Migration Phases

### Phase 1: UX Unification Without Backend Rewrite

Purpose: reduce customer-facing complexity first.

Tasks:

- Remove public subscription entry points.
- Keep `SubscriptionPlan` backend temporarily.
- Add recurring option to the single delivery review step.
- If recurring is selected, create a `SubscriptionPlan` from the current single-delivery draft before checkout.
- Route checkout through existing `SUBSCRIPTION_PLAN_NEW`.
- Dashboard can still show subscriptions separately for now.

Benefits:

- Low migration risk.
- Keeps Stripe subscription code intact.
- Allows product testing of the simplified flow.

Tradeoff:

- Backend remains complex.
- Temporary copy/conversion logic is needed.

### Phase 2: Introduce Unified Order API

Purpose: begin backend simplification while preserving old data.

Tasks:

- Add new `Order` model or evolve `OrderBase` into canonical `Order`.
- Add `billing_mode`, `years`, `stripe_subscription_id`, `recurring_preferences`.
- Build `/api/orders/` endpoints.
- Keep old endpoints temporarily for dashboard and compatibility.
- Add tests for one-time and recurring order creation.

Important decision:

- If historical data matters, create data migration from `UpfrontPlan` and `SubscriptionPlan` into `Order`.
- If historical data is disposable in this business stage, archive old rows and cut over directly.

### Phase 3: Unified Checkout

Purpose: remove payment endpoint duplication.

Tasks:

- Add `POST /api/orders/{id}/checkout/`.
- Move staff `$1` override into shared payment helper.
- Move Stripe customer creation into shared helper.
- Move pending PaymentIntent reuse/cancel logic into shared helper.
- Store Stripe metadata as `order_id` and `billing_mode`, not old item types.
- Update frontend `PaymentInitiatorButton` to use `startCheckout(orderId)`.

Dead code after cutover:

- `payments/views/create_subscription_view.py`
- most item-type branching in `payments/views/create_payment_intent.py`
- frontend handling of `UPFRONT_PLAN_NEW`, `SUBSCRIPTION_PLAN_NEW`, `SINGLE_DELIVERY_PLAN_NEW`

### Phase 4: Unified Webhook Fulfillment

Purpose: remove `UpfrontPlan`/`SubscriptionPlan` branches from webhooks.

Tasks:

- Refactor `handle_payment_intent_succeeded` around `Order.billing_mode`.
- Create helpers:
  - `activate_order(order)`
  - `create_first_event(order)`
  - `create_projected_events(order)`
  - `create_stripe_subscription_for_order(order, payment_method_id)`
  - `create_recurring_event_from_invoice(order, invoice)`
- Update `handle_invoice_payment_succeeded` to query `Order` by `stripe_subscription_id`.
- Keep `customer.subscription.deleted` behavior but target `Order`.

### Phase 5: Delete Split Models and Routes

Purpose: remove long-term complexity.

Tasks:

- Remove `UpfrontPlan`.
- Remove `SubscriptionPlan`.
- Remove multi-table inheritance dependency.
- Remove `OrderBase.get_child_instance()`.
- Remove old frontend route trees.
- Remove old API clients and types.
- Remove old tests/factories.
- Update admin, partner discount validation, dashboard, payments, and notifications to use `Order`.

## Dead Code Candidates

These should become removable after the unified model/API is complete.

### Frontend Routes and Pages

Subscription flow:

- `frontend/src/app/subscribe-flow/`
- `frontend/src/page_components/subscription_flow/`

Single-delivery split route:

- `frontend/src/app/single-delivery-flow/`
- `frontend/src/page_components/single_delivery_flow/`

Legacy order/product selection:

- `frontend/src/app/order/page.tsx`
- `frontend/src/page_components/ProductSelectionPage.tsx`

Dashboard subscription route family:

- `frontend/src/app/dashboard/subscription-plans/`
- `frontend/src/page_components/user_dashboard/subscription_management/`

Dashboard upfront route family may also be replaced:

- `frontend/src/app/dashboard/upfront-plans/`
- `frontend/src/page_components/user_dashboard/upfront_management/`

### Frontend Components

Likely removable:

- `frontend/src/components/SubscriptionSummary.tsx`
- `frontend/src/components/SubscriptionPlanTable.tsx`
- `frontend/src/components/SubscriptionPlanSummary.tsx`
- `frontend/src/components/form_flow/SubscriptionStructureEditor.tsx`
- `frontend/src/components/form_flow/SubscriptionStructureCard.tsx`
- `frontend/src/forms/SubscriptionStructureForm.tsx`
- `frontend/src/components/form_flow/SingleDeliveryStructureEditor.tsx`

Likely replace with unified components:

- `frontend/src/components/UpfrontSummary.tsx`
- `frontend/src/components/UnifiedPlanTable.tsx`
- `frontend/src/components/PlanDisplay.tsx`
- `frontend/src/components/form_flow/RecipientEditor.tsx`
- `frontend/src/components/form_flow/PreferencesEditor.tsx`

New target components:

- `OrderRecipientEditor`
- `OrderDetailsEditor`
- `OrderReview`
- `RecurringDeliveryOption`
- `OrderSummary`
- `OrderTable`

### Frontend API and Types

Likely removable:

- `frontend/src/api/upfrontPlans.ts`
- `frontend/src/api/subscriptionPlans.ts`
- `frontend/src/api/singleDeliveryPlans.ts`

Replace with:

- `frontend/src/api/orders.ts`

Likely removable types:

- `frontend/src/types/UpfrontPlan.ts`
- `frontend/src/types/SubscriptionPlan.ts`
- `frontend/src/types/SingleDeliveryPlan.ts`
- `frontend/src/types/PartialUpfrontPlan.ts`
- `frontend/src/types/PartialSubscriptionPlan.ts`
- `frontend/src/types/PartialSingleDeliveryPlan.ts`
- `frontend/src/types/Plan.ts`
- `frontend/src/types/SubscriptionStructureData.ts`
- `frontend/src/types/SubscriptionStructureFormProps.ts`
- `frontend/src/types/SubscriptionStructureEditorProps.ts`
- `frontend/src/types/SubscriptionSummaryProps.ts`
- `frontend/src/types/UpfrontSummaryProps.ts`

Replace with:

- `frontend/src/types/Order.ts`
- `frontend/src/types/PartialOrder.ts`
- `frontend/src/types/OrderSummaryProps.ts`

### Backend Models and Serializers

Likely removable:

- `events/models/upfront_plan.py`
- `events/models/subscription_plan.py`
- `events/serializers/upfront_plan_serializer.py`
- `events/serializers/subscription_plan_serializer.py`
- `events/views/upfront_plan_view.py`
- `events/views/subscription_plan_view.py`
- `events/views/get_or_create_inactive_plan_view.py`

Replace with:

- `events/models/order.py`
- `events/serializers/order_serializer.py`
- `events/views/order_view.py`

### Backend Payment Code

Likely removable:

- `payments/views/create_subscription_view.py`
- `payments/views/create_payment_intent.py` item-type branching
- `payments/urls.py` `create-subscription/` route
- frontend item type contracts:
  - `UPFRONT_PLAN_NEW`
  - `UPFRONT_PLAN_MODIFY`
  - `SUBSCRIPTION_PLAN_NEW`
  - `SINGLE_DELIVERY_PLAN_NEW`

Replace with:

- `orders/{id}/checkout/`
- one checkout serializer
- one checkout service helper

### Backend Utilities

Likely rename or consolidate:

- `events/utils/upfront_price_calc.py`
- `payments/utils/subscription_dates.py`
- `events/utils/delivery_dates.py`

Target:

- `events/utils/order_pricing.py`
- `events/utils/order_schedule.py`

`frequency_to_deliveries_per_year` should remain, but it should not imply upfront-only behavior.

### Admin and Partner Code

Will need refactor:

- `data_management/views/admin_plan_list_view.py`
- `data_management/views/admin_plan_detail_view.py`
- `data_management/serializers/admin_plan_serializer.py`
- `data_management/serializers/admin_plan_detail_serializer.py`
- `partners/serializers/validate_discount_code_serializer.py`

Reason:

- They currently branch by `UpfrontPlan` vs `SubscriptionPlan`.
- Unified order removes queryset merging and `plan_type` URL branching.

### Tests and Factories

Likely removable or rewrite:

- `events/tests/factories/upfront_plan_factory.py`
- `events/tests/factories/subscription_plan_factory.py`
- `events/tests/view_tests/test_upfront_plan_view.py`
- `events/tests/view_tests/test_subscription_plan_view.py`
- `events/tests/serializer_tests/test_upfront_plan_serializer.py`
- `events/tests/serializer_tests/test_subscription_plan_serializer.py`
- `payments/tests/view_tests/test_create_subscription_view.py`
- `payments/tests/view_tests/test_create_payment_intent_view.py`
- `payments/tests/view_tests/test_handle_subscription_deleted.py`
- `payments/tests/util_tests/test_subscription_dates.py`
- `payments/tests/util_tests/test_webhook_commission_amount.py`
- `payments/tests/util_tests/test_remaining_webhook_handlers.py`

Replace with:

- `OrderFactory`
- `test_order_view.py`
- `test_order_serializer.py`
- `test_order_checkout.py`
- `test_order_webhook_fulfillment.py`
- `test_recurring_order_dates.py`
- `test_order_cancellation.py`

## Migration Risks

### Stripe Subscription Continuity

Existing active subscriptions have `stripe_subscription_id` on `SubscriptionPlan`.

Before deleting `SubscriptionPlan`, migrate that ID onto unified `Order`.

Invoice webhooks must keep finding existing subscriptions during the transition.

Recommended temporary fallback:

```python
try:
    order = Order.objects.get(stripe_subscription_id=subscription_id)
except Order.DoesNotExist:
    legacy_plan = SubscriptionPlan.objects.get(stripe_subscription_id=subscription_id)
```

Remove fallback only after migration is complete and verified.

### Historical Dashboard Data

If users have existing active plans, dashboard views must continue to show:

- payment history
- upcoming events
- cancellation controls
- recipient/preferences

Do not delete old route families until unified dashboard supports all active records.

### Event Generation Idempotency

Webhook code must remain idempotent.

Keep checks like:

```python
Event.objects.filter(order=order, delivery_date=date).exists()
Payment.objects.get_or_create(stripe_payment_intent_id=...)
```

### Terms and Discount Codes

Discount validation currently accepts `plan_type`.

Target should use `order_id` only. The backend can find `Order.discount_code` and current order state without frontend plan type.

### Prepaid Plans

Decide whether prepaid multi-delivery plans are strategic.

If not, do not build them into the first unified migration. Remove the current frontend surface and keep old prepaid records read-only until all are completed/refunded.

If yes, support `billing_mode='prepaid'`, but keep it out of the main public order flow.

## Recommended First Implementation Slice

Do this first:

1. Add `billing_mode` and `recurring_preferences` to existing `OrderBase`.
2. Add a unified `/api/orders/` read endpoint that serializes both legacy child models into one shape.
3. Build a unified frontend `Order` type and `orders.ts` client.
4. Add recurring option to the single customer review step.
5. Keep legacy `SubscriptionPlan` creation internally for the first recurring checkout.

This gives product simplification quickly without breaking active payment infrastructure.

Then proceed to model consolidation once the simplified flow is validated.

## Success Criteria

The migration is complete when:

- There is one public order flow.
- There is one order API client in the frontend.
- There is one backend order model for new orders.
- There is one checkout endpoint.
- The frontend never passes `plan_type` or old payment item types.
- Admin plan list queries one table.
- Dashboard order list queries one endpoint.
- No code uses `years=1 && frequency='annually'` to mean single delivery.
- `UpfrontPlan` and `SubscriptionPlan` files are deleted or retained only as migration shims.
