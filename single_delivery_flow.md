# Single Delivery Flow

This document outlines the complete, detailed flow for creating and managing single flower deliveries in the ForeverFlower project. The process is broken down into frontend user interactions, backend API handling, and database updates.

## 1. Frontend: The User's Journey

### Step 1: Account Creation & Plan Initialization
- **Action:** The user's journey to create a single delivery plan starts by navigating to `/event-gate`.
- **`EventGate.tsx`:** This component acts as a gatekeeper. If the user is authenticated, it calls `getOrCreatePendingSingleDeliveryPlan()`. If not, it redirects the user to the account creation page.
- **API Call:** It calls `getOrCreatePendingSingleDeliveryPlan()` (from `frontend/src/api/singleDeliveryPlans.ts`), which sends a `GET` request to the backend endpoint at `/api/events/single-delivery-plans/get-or-create-pending/`.
- **Backend Logic (`events/views/single_delivery_plan_view.py`):** The `get_or_create_pending` action within `SingleDeliveryPlanViewSet` handles this request. It searches for an existing `SingleDeliveryPlan` for the authenticated user that has `status='pending_payment'`. If such a plan is found, its data is returned. If no pending plan exists, a new `SingleDeliveryPlan` instance is created, associated with the user, set with `status='pending_payment'`, and its data is returned.
- **Navigation:** The frontend receives the plan data and navigates the user to the next step of the flow, typically `/single-delivery-flow/plan/{plan.id}/recipient`.

### Step 2: Recipient Details
- **File:** `frontend/src/pages/single_delivery_flow/Step2RecipientPage.tsx`
- **Action:** The user enters the recipient's name and address for the delivery.
- **API Call:** The `updateSingleDeliveryPlan()` function is called, sending a `PATCH` request to the backend to update the `SingleDeliveryPlan` with the recipient's information.

### Step 3: Delivery Preferences
- **File:** `frontend/src/pages/single_delivery_flow/Step3PreferencesPage.tsx`
- **Action:** The user can optionally select preferred and rejected colors and flower types for the delivery.
- **API Call:** `updateSingleDeliveryPlan()` is called to save these preferences to the `SingleDeliveryPlan`.

### Step 4: Plan Structure (Budget, Date, Message)
- **File:** `frontend/src/pages/single_delivery_flow/Step4StructurePage.tsx`
- **Action:** The user defines the core details of their single delivery:
    - **Bouquet Budget:** The amount spent on the bouquet.
    - **Delivery Date:** The desired date for the delivery.
    - **Custom Message:** An optional custom message to be included with the delivery.
- **API Call (Price Calculation):** As the user adjusts the bouquet budget, `calculateSingleDeliveryPrice()` (from `frontend/src/api/singleDeliveryPlans.ts`) sends a `POST` request to the backend endpoint `/api/events/single-delivery-plans/{planId}/calculate-price/`.
- **Backend Logic (`events/views/single_delivery_plan_view.py`):** The `calculate_price` action within `SingleDeliveryPlanViewSet` receives the `budget` and calculates the `total_amount`. This calculation includes a service fee, which is the greater of `budget * 0.05` (5% commission) or a minimum flat fee of `15.0`. The `total_amount` (budget + fee) is then returned.
- **API Call (Save Structure):** When the user is satisfied with the details and proceeds, `updateSingleDeliveryPlan()` is called. This saves the selected `budget`, `delivery_date` (which is stored in `start_date` for consistency with `OrderBase`), `notes` (for the message), and the calculated `total_amount` to the `SingleDeliveryPlan` model.

### Step 5: Confirmation
- **File:** `frontend/src/pages/single_delivery_flow/Step5ConfirmationPage.tsx`
- **Action:** The user reviews a complete summary of their single delivery plan, including recipient, preferences, details, and the final price.
- **Navigation:** Upon confirmation, the user is taken to the payment page.

### Step 6: Payment
This step leverages a unified payment page (`CheckoutPage.tsx`) which utilizes a shared form component (`CheckoutForm.tsx`) for consistency across different payment flows. Payment initiation is handled by the `PaymentInitiatorButton.tsx` component.

#### Payment Flow
- **File (Payment Initiation):** `frontend/src/components/PaymentInitiatorButton.tsx`
- **Action (Payment Initiation):** When a user needs to make a payment, the `PaymentInitiatorButton.tsx` component is used. It calls the `createPaymentIntent` function to send a `POST` request to the backend. It passes `itemType='SINGLE_DELIVERY_PLAN_NEW'` and the `single_delivery_plan_id` in the `details`.
- **Backend `CreatePaymentIntentView` (`payments/views/create_payment_intent.py`):** This view receives the request. It creates a Stripe `PaymentIntent` for the `total_amount` of the `SingleDeliveryPlan` and a corresponding `Payment` record in the local database. It returns the `clientSecret` for the Stripe `PaymentIntent` to the frontend.
- **File (Payment Page):** `frontend/src/pages/CheckoutPage.tsx`
- **Action (Payment Page):** The user is then redirected to this unified `CheckoutPage.tsx` with the `clientSecret` and `intentType='payment'` passed in the navigation state.
- **File (Payment Form Component):** `frontend/src/forms/CheckoutForm.tsx`
- **Action (Payment Form):** Within `CheckoutPage.tsx`, the `CheckoutForm.tsx` component is initialized with the `clientSecret` and `intentType='payment'`. This `intent-aware` component securely collects the user's card details using Stripe Elements and calls `stripe.confirmPayment()`.

### Step 7: Payment Status
This step uses a single, universal page to display the outcome of the payment transaction.

- **File:** `frontend/src/pages/PaymentStatusPage.tsx`
- **Action:** After submitting the payment form, the user is redirected to this page. The redirect URL includes `payment_intent_client_secret`, `plan_id`, and `itemType='SINGLE_DELIVERY_PLAN_NEW'` as URL parameters.
- **Stripe Integration & Logic:** The `PaymentStatusPage.tsx` inspects the client secret and uses `stripe.retrievePaymentIntent()` to retrieve the status. For a successful `PaymentIntent`, it displays a success message and then redirects the user to their `SingleDeliveryPlanOverviewPage.tsx` (or dashboard).
- **Backend Sync (`payments/views/stripe_webhook.py`):** A successful `PaymentIntent` will trigger a Stripe Webhook event (`payment_intent.succeeded`) that the backend (`payments/views/stripe_webhook.py`) will process. The `handle_payment_intent_succeeded` function identifies `itemType='SINGLE_DELIVERY_PLAN_NEW'`. It updates the local `Payment` record's status to `'succeeded'`, activates the `SingleDeliveryPlan` by setting its status to `'active'`, and critically, **creates a new `Event` record** for the actual delivery using the plan's `start_date` as the `delivery_date` and the `notes` as the message.

## 2. Backend: API and Processing

### File: `events/serializers/single_delivery_plan_serializer.py`
- **Serializer:** `SingleDeliveryPlanSerializer` (inherits from `serializers.ModelSerializer`)
- **Purpose:** Serializes and deserializes `SingleDeliveryPlan` objects.
- **Fields:** Includes all fields from the `SingleDeliveryPlan` model, with `id`, `user`, `status`, `created_at`, `updated_at` set as read-only.

### File: `events/views/single_delivery_plan_view.py`
- **View:** `SingleDeliveryPlanViewSet` (inherits from `viewsets.ModelViewSet`)
- **Permission:** `IsAuthenticated` ensures only logged-in users can access their plans.
- **Queryset:** Filters `SingleDeliveryPlan` objects to ensure users only retrieve/modify their own plans.
- **Endpoints & Actions:**
    - `GET /api/events/single-delivery-plans/`: Lists all single delivery plans for the authenticated user.
    - `GET /api/events/single-delivery-plans/{pk}/`: Retrieves a specific `SingleDeliveryPlan` by its ID.
    - `PATCH /api/events/single-delivery-plans/{pk}/`: Updates a specific `SingleDeliveryPlan` (used for recipient, preferences, structure updates).
    - `GET /api/events/single-delivery-plans/get-or-create-pending/`: Custom action to retrieve an existing `status='pending_payment'` plan or create a new one.
    - `POST /api/events/single-delivery-plans/{pk}/calculate-price/`: Custom action to calculate and return the `total_amount` for a given `budget`. This endpoint also performs server-side validation for `total_amount` during `partial_update` to prevent price manipulation.

### File: `events/urls.py`
- Registers the `SingleDeliveryPlanViewSet` under the `single-delivery-plans` endpoint, making it accessible at `/api/events/single-delivery-plans/`.

### File: `payments/views/create_payment_intent.py`
- **View:** `CreatePaymentIntentView`
- **Endpoint:** `POST /api/payments/create-payment-intent/`
- **Logic:**
    - Handles payment intent creation for various `item_type`s, including `'SINGLE_DELIVERY_PLAN_NEW'`.
    - Retrieves the `SingleDeliveryPlan` based on `single_delivery_plan_id` from the request.
    - Creates a Stripe `PaymentIntent` using the `total_amount` from the plan, attaching metadata including `item_type`.
    - Creates a corresponding local `Payment` record with `status='pending'`.
    - Returns the `clientSecret` of the `PaymentIntent`.

### File: `payments/utils/webhook_handlers.py`
- **Function:** `handle_payment_intent_succeeded(payment_intent)`
- **Logic for `SINGLE_DELIVERY_PLAN_NEW`:**
    - Identified by `item_type` in `PaymentIntent` metadata.
    - Retrieves the corresponding local `Payment` record and updates its `status` to `'succeeded'`.
    - Retrieves the `SingleDeliveryPlan` and sets its `status` to `'active'`.
    - **Crucially, creates an `Event` object** associated with this plan, setting its `delivery_date` to the plan's `start_date` and its `message` to the plan's `notes` field.

## 3. Database Models

### File: `events/models/single_delivery_plan.py`
- **Model:** `SingleDeliveryPlan`
- **Purpose:** Extends the `OrderBase` model to represent a single flower delivery with a one-time payment.
- **Key Fields:**
    - `budget`: `DecimalField`, nullable. The monetary budget allocated for the single bouquet.
    - `total_amount`: `DecimalField`, nullable. The calculated total cost (budget + service fee) for the delivery.
- **Inherited from `OrderBase`:** Includes common fields like `user` (ForeignKey to User), `status` (e.g., 'pending_payment', 'active'), `currency`, `recipient_details` (first name, last name, address, etc.), `notes` (used for the delivery message), `start_date` (used for the delivery date), `created_at`, `updated_at`, and preference fields (colors, flower types).

### File: `events/models/event.py`
- **Model:** `Event`
- **Purpose:** Represents a single, scheduled delivery event. For single delivery plans, one `Event` instance is created upon successful payment.
- **Key Fields:**
    - `order`: `ForeignKey` to `OrderBase` (which `SingleDeliveryPlan` inherits from). This links the individual delivery to its parent single delivery plan.
    - `delivery_date`: The specific date for the delivery.
    - `message`: The message to be included with this particular delivery.
    - `status`: The status of the individual delivery (e.g., 'scheduled', 'delivered', 'cancelled').

### File: `payments/models/payment.py`
- **Model:** `Payment`
- **Purpose:** Records individual payment transactions made by users.
- **Key Fields:**
    - `user`: `ForeignKey` to `User`.
    - `order`: `ForeignKey` to `OrderBase` (linking to `SingleDeliveryPlan`).
    - `stripe_payment_intent_id`: `CharField`. Used for single payments initiated via Payment Intents.
    - `amount`: `DecimalField`. The amount of the payment.
    - `status`: `CharField(choices=STATUS_CHOICES)`. The state of the payment (e.g., 'pending', 'succeeded', 'failed').
