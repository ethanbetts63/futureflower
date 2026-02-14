# Events App

## Purpose

The `events` app is the core domain of FutureFlower. It manages orders (plans), individual deliveries (events), and the reference data for customer preferences (colors and flower types). It also contains the pricing engine for upfront multi-year plans.

## Models

### OrderBase (Abstract Base)
Base class for all order types. Stores recipient details, delivery preferences, plan parameters (budget, frequency, start date), and M2M preferences for colors and flower types. Includes `hash_*` fields for GDPR-compliant anonymization of recipient PII.

**Status lifecycle:** `pending_payment` -> `active` -> `completed` | `cancelled` | `refunded`

### UpfrontPlan (extends OrderBase)
A prepaid multi-year flower delivery plan. The customer pays upfront for all deliveries across a given number of years at a discounted rate (annuity pricing).

**Key fields:** `years`, `total_amount`

Also used for single deliveries (years=1, frequency='annually') as a special case with no discount.

### SubscriptionPlan (extends OrderBase)
A recurring flower delivery subscription billed per delivery cycle via Stripe.

**Key fields:** `price_per_delivery`, `stripe_subscription_id`, `subscription_message`

### Event
An individual flower delivery within a plan. Auto-generated for upfront plans on creation; created per-payment for subscriptions via webhook.

**Key fields:** `order` (FK to OrderBase), `delivery_date`, `message`, `status`

### FlowerType
Simple reference table for customer flower preferences. Populated via management commands from JSON data files.

## Testing

The `events` app is covered by a comprehensive suite of tests:

- **Model Tests:** Verifies `OrderBase`, `UpfrontPlan`, and `SubscriptionPlan` creation and string representations.
- **Util Tests:** Covers pricing calculators, fee calculations, and delivery date projections.
- **Serializer Tests:** Validates `UpfrontPlanSerializer` logic, including start date validation and update restrictions on active plans.
- **View Tests:** Tests `UpfrontPlanViewSet`, `SubscriptionPlanViewSet`, `EventViewSet`, `FlowerTypeViewSet`, and public pricing endpoints. Includes authentication and ownership checks.
- **Integration Tests:** Verifies that delivery `Event` objects are correctly generated upon successful payment (via mocked Stripe webhooks).

Run tests using: `pytest events/tests`

### Discount
Promotional discount codes linked to florist partners. Currently schema-only (not yet integrated into order/payment flow).

## Pricing Engine

### `utils/upfront_price_calc.py`
- `forever_flower_upfront_price(budget, frequency, years)` - Calculates total upfront cost using a compound-interest annuity formula with a 4% assumed annual return. Returns price and a detailed breakdown dict.
- `calculate_final_plan_cost(plan, new_structure)` - Calculates the amount owing when modifying an existing plan, accounting for already-succeeded payments.

### `utils/fee_calc.py`
- `calculate_service_fee(budget)` - Returns `max(budget * 5%, $15.00)` per delivery.
- `frequency_to_deliveries_per_year(frequency)` - Maps frequency string to annual delivery count.

## API Endpoints

All under `/api/events/`:

### Upfront Plans
- `GET/POST /upfront-plans/` - List/create plans (authenticated)
- `GET/PATCH/DELETE /upfront-plans/<id>/` - Retrieve/update/delete (authenticated)
- `GET /upfront-plans/get-latest-pending/` - Most recent pending plan
- `GET /upfront-plans/get-or-create-pending/` - Get or create pending plan (`?mode=single-delivery` for single deliveries)
- `POST /upfront-plans/<id>/calc-upfront-price/` - Price calculation for plan modifications

### Subscription Plans
- `GET/POST /subscription-plans/` - List/create (authenticated)
- `GET/PATCH/DELETE /subscription-plans/<id>/` - Retrieve/update/delete
- `GET /subscription-plans/get-or-create-pending/` - Get or create pending subscription
- `POST /subscription-plans/<id>/calculate-price/` - Calculate price per delivery

### Events
- `GET/POST /events/` - List/create deliveries (authenticated, scoped to user)
- `GET/PATCH/DELETE /events/<id>/` - Individual delivery management

### Reference Data (Public)
- `GET /colors/` - List available colors
- `GET /flower-types/` - List available flower types

### Public Pricing
- `POST /calculate-price/` - Public price calculator (no auth required)

## Templates

- `notifications/emails/base.html` - Base email template (dark theme, responsive)
- `notifications/emails/event_reminder.html` - Delivery reminder email (extends base)
