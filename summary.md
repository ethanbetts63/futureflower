# SingleDeliveryPlan → UpfrontPlan Collapse: Progress Summary

## Goal
Collapse `SingleDeliveryPlan` into `UpfrontPlan`. Single deliveries become `UpfrontPlan` rows with `years=1` and `deliveries_per_year=1`. The user-facing experience stays separate (distinct entry point, simplified flow pages), but the backend model, API, and payment pipeline are unified.

---

## Completed

### 1. EventGate — Route Param Fix
- **`frontend/src/components/EventGate.tsx`**: Replaced `location.pathname.includes('subscription')` / `location.pathname.includes('single-delivery')` with `useParams<{ flowType?: string }>()`. Now reads flow type from `:flowType` route param directly.
- **`frontend/src/App.tsx`**: Collapsed three `<Route path="/event-gate" ...>` entries into one: `<Route path="/event-gate/:flowType?" element={<EventGate />} />`.

### 2. Annuity Bypass for Single Deliveries
- **`events/utils/upfront_price_calc.py`**: Added early return in `forever_flower_upfront_price()` when `years == 1 AND deliveries_per_year == 1`. In this case, skips the annuity factor and returns `budget + service_fee` directly (matching the current single delivery pricing).

### 3. Backend Files Read & Analyzed
Fully read and understood the following files to plan remaining changes:
- `events/models/single_delivery_plan.py` — fields: `budget`, `total_amount` (extends OrderBase)
- `events/models/order_base.py` — shared base with recipient/preferences/status
- `events/views/single_delivery_plan_view.py` — `get_or_create_pending`, `calculate_price`, `partial_update`
- `events/views/upfront_plan_view.py` — `UpfrontPlanViewSet`, `GetOrCreateInactivePlanView`
- `events/views/get_or_create_inactive_plan_view.py` — creates UpfrontPlan with defaults
- `events/serializers/single_delivery_plan_serializer.py` — explicit field list
- `events/urls.py` — router registration for all viewsets
- `payments/views/create_payment_intent.py` — handles `SINGLE_DELIVERY_PLAN_NEW` item type
- `payments/utils/webhook_handlers.py` — handles `SINGLE_DELIVERY_PLAN_NEW` in `handle_payment_intent_succeeded`

### 4. Frontend Files Read & Analyzed
Identified all 28 files that reference `SingleDeliveryPlan`:
- **API**: `singleDeliveryPlans.ts`, `api/index.ts`
- **Types**: `SingleDeliveryPlan.ts`, `PartialSingleDeliveryPlan.ts`, `SingleDeliveryOrder.ts`, `PartialSingleDeliveryOrder.ts`, `Plan.ts`, `PartialPlan.ts`, `typeGuards.ts`, `CreatePaymentIntentPayload.ts`, `SingleDeliveryStructureCardProps.ts`, `DeliveryDatesCardProps.ts`, `MessagesCardProps.ts`, `NextDeliveryInfo.ts`, `types/index.ts`
- **Components**: `EventGate.tsx`, `OrderSummaryCard.tsx`, `SingleDeliveryPlanTable.tsx`, `SingleDeliveryStructureEditor.tsx`, `PaymentInitiatorButton.tsx`
- **Pages**: `single_delivery_flow/Step2RecipientPage.tsx`, `Step3PreferencesPage.tsx`, `Step4StructurePage.tsx`, `Step5ConfirmationPage.tsx`, `single_delivery_management/SingleDeliveryPlanOverviewPage.tsx`, `PlanListPage.tsx`, `PaymentStatusPage.tsx`

---

## Remaining Work

### 5. Backend: Update UpfrontPlan API to serve single delivery requests
- **`events/views/get_or_create_inactive_plan_view.py`**: Add `?mode=single-delivery` query param support. When present, create/find UpfrontPlan with `years=1`, `deliveries_per_year=1` pre-set.
- **`events/views/upfront_plan_view.py`**: The existing `partial_update` and price validation already work for single deliveries because the annuity bypass handles `years=1, deliveries_per_year=1`. No changes needed here.

### 6. Backend: Update payment pipeline to remove SingleDeliveryPlan references
- **`payments/views/create_payment_intent.py`**: Change the `SINGLE_DELIVERY_PLAN_NEW` branch to look up `UpfrontPlan` instead of `SingleDeliveryPlan`. Can keep the item type name for frontend compatibility or alias it to `UPFRONT_PLAN_NEW`.
- **`payments/utils/webhook_handlers.py`**: Remove the `SINGLE_DELIVERY_PLAN_NEW` branch from `handle_payment_intent_succeeded`. Single deliveries will now be handled by the `UPFRONT_PLAN_NEW` branch. The Event creation logic already exists there via `perform_create` on the viewset — but we need to verify that the webhook also creates the Event (since the upfront branch currently only activates, it doesn't create Events — those are created in `perform_create` at plan creation time). **Key issue**: For single deliveries, the Event needs to be created at webhook time (like it currently is), not at plan creation time, because the message is set during the flow, not at creation.

### 7. Backend: Delete SingleDeliveryPlan model
- **`events/models/single_delivery_plan.py`**: Delete file.
- **`events/models/__init__.py`**: Remove `SingleDeliveryPlan` import.
- **`events/serializers/single_delivery_plan_serializer.py`**: Delete file.
- **`events/serializers/__init__.py`**: Remove import.
- **`events/views/single_delivery_plan_view.py`**: Delete file.
- **`events/urls.py`**: Remove `SingleDeliveryPlanViewSet` router registration and import.
- **`events/admin.py`**: Remove any SingleDeliveryPlan admin registration if present.
- **Migration**: Create a data migration that:
  1. For each `SingleDeliveryPlan` row, creates a corresponding `UpfrontPlan` row with `years=1`, `deliveries_per_year=1`, copying `budget`, `total_amount`, and all OrderBase fields.
  2. Updates any `Event` FK references from the old SingleDeliveryPlan's `orderbase_ptr` to the new UpfrontPlan's `orderbase_ptr`.
  3. Updates any `Payment` FK references similarly.
  4. Then drops the `SingleDeliveryPlan` table.

### 8. Frontend: Redirect single delivery API calls to upfront endpoints
- **`frontend/src/api/singleDeliveryPlans.ts`**: Rewrite all functions to call `/api/events/upfront-plans/...` instead of `/api/events/single-delivery-plans/...`. The `getOrCreatePendingSingleDeliveryPlan` function should call the get-or-create-pending endpoint with a `?mode=single-delivery` query param. Return type becomes `UpfrontPlan`.
- **`frontend/src/api/index.ts`**: Keep exporting from `singleDeliveryPlans.ts` (the functions still exist, just rewired).

### 9. Frontend: Update types
- **`frontend/src/types/SingleDeliveryPlan.ts`**: Change to `export type SingleDeliveryPlan = UpfrontPlan;` (type alias for backwards compat, avoids touching every import).
- **`frontend/src/types/PartialSingleDeliveryPlan.ts`**: Change to `export type PartialSingleDeliveryPlan = PartialUpfrontPlan;`.
- **`frontend/src/types/Plan.ts`**: Remove `SingleDeliveryPlan` from the union (it's now just `UpfrontPlan`).
- **`frontend/src/types/typeGuards.ts`**: Remove `isSingleDeliveryPlan` guard (no longer a distinct type).
- **Other type files** (`DeliveryDatesCardProps`, `MessagesCardProps`, `NextDeliveryInfo`): Replace `SingleDeliveryPlan` with `UpfrontPlan` in union types.

### 10. Frontend: Update components and pages
- **`OrderSummaryCard.tsx`**: Remove `SINGLE_DELIVERY_PLAN_NEW` branch and `isSingleDeliveryPlan` guard. Single deliveries are upfront plans now.
- **`PaymentInitiatorButton.tsx`**: Verify it handles `UPFRONT_PLAN_NEW` for single deliveries (or keep accepting `SINGLE_DELIVERY_PLAN_NEW` and map it).
- **`SingleDeliveryStructureEditor.tsx`**: Keep as-is (it's the UI component for the single delivery structure page). Just update its API calls to use upfront functions.
- **`SingleDeliveryPlanTable.tsx`**: Update to fetch/display UpfrontPlan data filtered by `years=1, deliveries_per_year=1`.
- **Single delivery flow pages** (`Step2-5`): Update imports to use upfront API functions. The pages stay separate.
- **`SingleDeliveryPlanOverviewPage.tsx`**: Update to use upfront API.
- **`PlanListPage.tsx`**: Update single delivery section to fetch from upfront plans filtered appropriately.
- **`PaymentStatusPage.tsx`**: Remove any `SingleDeliveryPlan`-specific handling.
- **`App.tsx`**: Dashboard route `single-delivery-plans/:planId/overview` may need path update since plans are now in the upfront table.

### 11. Frontend: Confirmation page payment type
- **`single_delivery_flow/Step5ConfirmationPage.tsx`**: Change `PaymentInitiatorButton` `itemType` from `SINGLE_DELIVERY_PLAN_NEW` to `UPFRONT_PLAN_NEW`. Update `details` to use `{ upfront_plan_id: planId }` instead of `{ single_delivery_plan_id: planId }`.

---

## Key Design Decisions Made
1. **Annuity bypass**: When `years=1 AND deliveries_per_year=1`, pricing is `budget + service_fee` (no discount).
2. **Frontend type alias**: `SingleDeliveryPlan = UpfrontPlan` avoids massive import churn while collapsing the type.
3. **Separate flow pages stay**: Single delivery pages remain as distinct files with their own URLs. The user sees a separate product. Only the underlying model and API are unified.
4. **EventGate uses route params**: `/:flowType?` instead of pathname substring matching.

## Open Questions
- **Event creation timing**: Currently, upfront plan Events are created at plan creation time (`perform_create`). Single delivery Events are created at webhook time (`handle_payment_intent_succeeded`). After collapse, single deliveries will go through the upfront `perform_create` path, which means the Event gets created before payment. Need to verify this is acceptable, or add a condition to skip Event creation for single deliveries at `perform_create` time and create them at webhook time instead.
- **Dashboard plan list**: Currently shows upfront and single delivery plans in separate sections. After collapse, need a way to distinguish them (filter by `years=1, deliveries_per_year=1`) or merge the display.
- **Message storage**: Single delivery message is stored... where? The `SingleDeliveryStructureEditor` collects it, but where does it persist? Need to check if it goes on the Event or somewhere on the plan. The upfront flow uses a separate `MessagesEditor` that stores messages on Events. The single delivery flow may need to store the message temporarily on the plan and then copy it to the Event at creation time.
