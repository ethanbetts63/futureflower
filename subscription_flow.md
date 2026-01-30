# Subscription Flow

This document outlines the complete, detailed flow for creating and managing flower subscriptions in the ForeverFlower project. The process is broken down into frontend user interactions, backend API handling, and database updates.

## 1. Frontend: The User's Journey

### Step 1: Account Creation & Plan Initialization
- **Action:** The user's journey to create a subscription starts by navigating to `/event-gate` 
- **`EventGate.tsx`:** This component acts as a universal gatekeeper for both upfront and subscription plan creation flows. It determines the flow type by checking if the current `location.pathname` includes 'subscription'. If it's a subscription flow, it calls `getOrCreatePendingSubscriptionPlan()` to initialize a pending subscription plan. Otherwise, it calls `getOrCreatePendingUpfrontPlan()` for an upfront plan. It also handles user authentication, redirecting to account creation if necessary, and then navigates the user to the next appropriate step based on the plan type.
- **API Call:** It calls `getOrCreatePendingSubscriptionPlan()` (from `frontend/src/api/subscriptionPlans.ts`), which sends a `GET` request to the backend endpoint at `/api/events/subscription-plans/get-or-create-pending/`.
- **Backend Logic (`events/views/subscription_plan_view.py`):** The `get_or_create_pending` action within `SubscriptionPlanViewSet` handles this request. It searches for an existing `SubscriptionPlan` for the authenticated user that has `status='pending_payment'`. If such a plan is found, its data is returned. If no pending plan exists, a new `SubscriptionPlan` instance is created, associated with the user, set with `status='pending_payment'`, and its data is returned.
- **Navigation:** The frontend receives the plan data and navigates the user to the next step of the flow, likely a structure editing page for the newly created or retrieved pending subscription plan.

### Step 2: Recipient Details
- **File:** `frontend/src/components/RecipientCard.tsx` (for display), `frontend/src/pages/user_dashboard/subscription_management/EditRecipientPage.tsx`
- **Action:** The user provides recipient details for the subscription deliveries. These details are managed and edited via the dashboard after plan initialization.

### Step 3: Delivery Preferences
- **File:** `frontend/src/components/PreferencesCard.tsx` (for display), `frontend/src/pages/user_dashboard/subscription_management/EditPreferencesPage.tsx`
- **Action:** The user can select preferred and rejected colors and flower types for their subscription deliveries. These preferences can be set during initial plan creation or edited later via the dashboard.

### Step 4: Custom Messages
- **File:** `frontend/src/forms/SubscriptionStructureForm.tsx` (contains `subscription_message` field), `frontend/src/components/SubscriptionStructureCard.tsx` (displays the message).
- **Action:** The user can provide a single, custom message to be included with all deliveries of their subscription.
- **API Call:** This message is saved as part of the subscription's structure update via `updateSubscriptionPlan()` (from `frontend/src/api/subscriptionPlans.ts`).

### Step 5: Subscription Structure
- **File:** `frontend/src/forms/SubscriptionStructureForm.tsx`, `frontend/src/components/SubscriptionStructureEditor.tsx`
- **Action:** The user defines the core recurring aspects of their subscription:
    - **Bouquet Budget:** The amount spent per bouquet for each delivery.
    - **Delivery Frequency:** How often deliveries occur (e.g., `monthly`, `quarterly`, `bi-annually`, `annually`).
    - **First Delivery Date:** The desired start date for the subscription deliveries.
- **API Call (Price Calculation):** As the user adjusts the bouquet budget, `SubscriptionStructureEditor.tsx` (a wrapper component for the form) debounces a call to `calculateSubscriptionPrice()` (from `frontend/src/api/subscriptionPlans.ts`). This function sends a `POST` request to the backend endpoint `/api/events/subscription-plans/{planId}/calculate-price/`.
- **Backend Logic (`events/views/subscription_plan_view.py`):** The `calculate_price` action within `SubscriptionPlanViewSet` receives the `budget` and calculates the `price_per_delivery`. This calculation includes a service fee, which is the greater of `budget * 0.05` (5% commission) or a minimum flat fee of `15.0`. The `price_per_delivery` (budget + fee) is then returned.
- **API Call (Save Structure):** When the user is satisfied with the structure and proceeds, `updateSubscriptionPlan()` (from `frontend/src/api/subscriptionPlans.ts`) is called. This saves the selected `budget`, `frequency`, `start_date`, `subscription_message`, and the calculated `price_per_delivery` to the `SubscriptionPlan` model.

### Step 6: Confirmation
- **File:** `frontend/src/components/SubscriptionPlanSummary.tsx` (component for displaying a consolidated summary of the plan details).
- **Action:** The user reviews a complete summary of their chosen subscription plan, including the structure, recipient information, preferences, and the recurring price per delivery. This summary is typically presented on a dedicated confirmation page or integrated into the checkout experience before payment initiation.

### Step 7: Payment
This step establishes the recurring payment mechanism for the subscription via Stripe. It uses an integrated payment form on the confirmation page rather than a separate checkout page.

#### Payment Flow (Subscription Activation)
- **File (Confirmation Page):** `frontend/src/pages/subscription_flow/Step5ConfirmationPage.tsx`
- **Action (Payment Initiation):** After reviewing the summary, the user clicks the `PaymentInitiatorButton`.
- **API Call (`createSubscription`):** The button's logic calls a function like `createSubscription()` (from `frontend/src/api/subscriptionPlans.ts`). This sends a `POST` request to the backend endpoint `/api/payments/create-subscription/`, including the `subscription_plan_id`.
- **Backend `CreateSubscriptionView` (`payments/views/create_subscription_view.py`):**
    - This view retrieves the `SubscriptionPlan` instance from the database using the provided `subscription_plan_id`.
    - It handles the Stripe Customer aspect: if the `request.user` already has a `stripe_customer_id`, it retrieves that customer; otherwise, a new Stripe Customer is created, and its ID is saved to the user's profile.
    - Using the `price_data` parameter, a dynamic price is defined within the subscription creation call. This uses the `SubscriptionPlan`'s `price_per_delivery` and `frequency`, and crucially, links it to a **pre-existing, fixed Stripe Product ID** stored in `settings.STRIPE_SUBSCRIPTION_PRODUCT_ID`. This avoids creating a new Product for every subscription.
    - The Stripe Subscription is then created, linking the customer to this dynamic price. `payment_behavior='default_incomplete'` is set to manage payments that might require further authentication (e.g., 3D Secure). The `latest_invoice.payment_intent` is expanded to obtain details for the initial payment.
    - The generated `stripe_subscription_id` is saved back to the local `SubscriptionPlan` model.
    - Finally, the `clientSecret` from the `latest_invoice.payment_intent` is returned to the frontend.
- **Action (Embedded Payment Form):** The frontend logic within `Step5ConfirmationPage.tsx` receives the `clientSecret`. It then uses this secret to initialize and display a Stripe Payment Element directly on the confirmation page. This allows the user to securely enter their payment details without leaving the page.
- **Action (Payment Confirmation):** Upon submission, Stripe.js handles the confirmation of the initial payment using the `clientSecret`.

### Step 8: Payment Status / Subscription Activation
- **File:** `frontend/src/pages/PaymentStatusPage.tsx`
- **Action:** After the user submits the embedded payment form and Stripe processes the initial payment, the frontend logic redirects the user to this universal status page. The URL includes `payment_intent_client_secret`, `plan_id`, and `source` as query parameters.
- **Stripe Integration & Logic:** The `PaymentStatusPage.tsx` uses the Stripe client-side library to retrieve the status of the initial `PaymentIntent` based on the `payment_intent_client_secret`.
- **Backend Sync:** A successful `PaymentIntent` for a subscription will trigger a Stripe Webhook event (`invoice.payment_succeeded`) that the backend (`payments/views/stripe_webhook.py`) will process. This webhook handler ensures that the local `SubscriptionPlan`'s status is accurately updated to reflect the successful activation of the subscription. The `PaymentStatusPage.tsx` will display a success message and then redirect the user to their `SubscriptionPlanOverviewPage.tsx`.

---

## 2. Backend: API and Subscription Processing

### File: `events/views/subscription_plan_view.py`
- **View:** `SubscriptionPlanViewSet` (inherits from `viewsets.ModelViewSet`)
- **Permission:** `IsAuthenticated` ensures only logged-in users can access their plans.
- **Queryset:** Filters `SubscriptionPlan` objects to ensure users only retrieve/modify their own plans.
- **Endpoints & Actions:**
    - `GET /api/events/subscription-plans/`: Lists all subscription plans for the authenticated user.
    - `POST /api/events/subscription-plans/`: (Although `get_or_create_pending` handles initial creation, this endpoint could theoretically allow direct creation if desired).
    - `GET /api/events/subscription-plans/{pk}/`: Retrieves a specific `SubscriptionPlan` by its ID.
    - `PATCH /api/events/subscription-plans/{pk}/`: Updates a specific `SubscriptionPlan` (used for recipient, preferences, structure, message updates).
    - `DELETE /api/events/subscription-plans/{pk}/`: Deletes a specific `SubscriptionPlan`.
    - `GET /api/events/subscription-plans/get-or-create-pending/`: Custom action to retrieve an existing `status='pending_payment'` plan or create a new one.
    - `POST /api/events/subscription-plans/{pk}/calculate-price/`: Custom action to calculate and return the `price_per_delivery` for a given `budget`.

### File: `payments/views/create_subscription_view.py`
- **View:** `CreateSubscriptionView` (inherits from `APIView`)
- **Permission:** `IsAuthenticated`
- **Endpoint:** `POST /api/payments/create-subscription/`
- **Logic:**
    - Validates `subscription_plan_id` from the request.
    - Fetches the local `SubscriptionPlan` object, ensuring it belongs to the `request.user`.
    - **Stripe Customer Management:**
        - Checks `request.user.stripe_customer_id`. If it exists, retrieves the Stripe Customer.
        - If not, creates a new Stripe Customer using the user's email and name, then saves the new `stripe_customer_id` to the local `User` model.
    - **Stripe Price and Subscription Creation:**
        - Creates the actual Stripe Subscription. The `items` array uses `price_data` to dynamically define the price for this specific subscription.
        - `price_data` includes the `unit_amount` (from `plan.price_per_delivery * 100`), `currency`, and `recurring` details (from `plan.frequency`).
        - Crucially, `price_data` also specifies the `product`, using a **fixed product ID** from `settings.STRIPE_SUBSCRIPTION_PRODUCT_ID`. This means a new Stripe Product is **not** created for each subscription.
        - Configures `payment_behavior='default_incomplete'` and `payment_settings={'save_default_payment_method': 'on_subscription'}`.
        - Expands `latest_invoice.payment_intent` to get details required for the initial payment.
    - **Local Database Update:** Saves the `stripe_subscription_id` received from Stripe back to the local `SubscriptionPlan` model.
    - **Response:** Returns the `clientSecret` from the `latest_invoice.payment_intent` to the frontend, enabling it to complete the initial payment.

### File: `payments/views/stripe_webhook.py`
- **View:** `StripeWebhookView` (inherits from `APIView`)
- **Permission:** `AllowAny` (as Stripe webhooks are external requests)
- **Endpoint:** Configured in the Stripe dashboard to receive events.
- **Logic for Subscription-Related Events:**
    - **Signature Verification:** Crucially verifies the incoming webhook payload using `stripe.Webhook.construct_event` to ensure its authenticity.
    - **Event Handling:** Delegates to specific handlers based on `event['type']`:
        - `payment_intent.succeeded`: Handled by `handle_payment_intent_succeeded`. This would update the local `Payment` record for the initial payment and potentially other `SubscriptionPlan` statuses.
        - `invoice.payment_succeeded`: Handled by `handle_invoice_payment_succeeded`. This is critical for recurring subscription payments. It records successful invoice payments as `Payment` objects in the local database and confirms the ongoing status of the subscription.
        - `payment_intent.payment_failed`: Handled by `handle_payment_intent_failed`. This would record failed initial payments and might trigger updates to the local `SubscriptionPlan` status or user notifications.
        - **Inferred handlers for other subscription lifecycle events (not explicitly shown in file, but standard for robust Stripe integrations):**
            - `customer.subscription.created`: To confirm the subscription is active on the local model if creation was asynchronous.
            - `customer.subscription.updated`: To sync any changes to the subscription (e.g., plan changes, renewal dates) from Stripe to the local database.
            - `customer.subscription.deleted`: To mark the local `SubscriptionPlan` as cancelled or inactive when a subscription is ended in Stripe.

---

## 3. Backend: Pricing Calculation

### File: `events/views/subscription_plan_view.py` (specifically `calculate_price` action)
- **Logic:**
    - The `calculate_price` action associated with `SubscriptionPlanViewSet` performs a straightforward calculation for `price_per_delivery`.
    - It takes a `budget` (expected to be a float or convertible to one).
    - A service `fee` is determined: `max(budget * 0.05, 15.0)`. This means a 5% commission on the budget, with a minimum fee of $15.
    - The `price_per_delivery` is simply `budget + fee`.
    - This endpoint returns a dictionary containing `price_per_delivery`.

---

## 4. Database Models

### File: `events/models/subscription_plan.py`
- **Model:** `SubscriptionPlan`
- **Purpose:** Extends the `OrderBase` model to represent a user's recurring flower delivery subscription. It holds all specific details pertaining to a subscription.
- **Key Fields:**
    - `start_date`: `DateField`, nullable. Indicates the planned date for the first delivery.
    - `budget`: `DecimalField(max_digits=10, decimal_places=2)`, nullable. The monetary budget allocated per bouquet for each delivery.
    - `frequency`: `CharField(max_length=20, choices=FREQUENCY_CHOICES)`, nullable. Defines how often deliveries occur (e.g., 'monthly', 'quarterly').
    - `price_per_delivery`: `DecimalField(max_digits=10, decimal_places=2)`, nullable. The calculated total cost (budget + service fee) for each individual delivery/billing cycle.
    - `stripe_subscription_id`: `CharField(max_length=255)`, nullable. Stores the unique identifier provided by Stripe for managing the recurring subscription.
    - `subscription_message`: `TextField`, nullable. A consistent message to accompany all deliveries within the subscription.
- **Inherited from `OrderBase`:** Includes common fields like `user` (ForeignKey to User), `status` (e.g., 'pending_payment', 'active', 'cancelled'), `currency`, `recipient_details` (first name, last name, address, etc.), `notes`, `created_at`, `updated_at`, and preference fields (colors, flower types).

### File: `events/models/event.py`
- **Model:** `Event`
- **Purpose:** Represents a single, scheduled delivery event. For subscriptions, these `Event` instances would be automatically generated and linked to the overarching `SubscriptionPlan`.
- **Key Fields:**
    - `order`: `ForeignKey` to `OrderBase` (which `SubscriptionPlan` inherits from). This links an individual delivery to its parent subscription plan.
    - `delivery_date`: The specific date for the delivery.
    - `message`: The message to be included with this particular delivery.
    - `status`: The status of the individual delivery (e.g., 'scheduled', 'delivered', 'cancelled').

### File: `payments/models/payment.py`
- **Model:** `Payment`
- **Purpose:** Records individual payment transactions made by users.
- **Key Fields:**
    - `user`: `ForeignKey` to `User`.
    - `order`: `ForeignKey` to `OrderBase` (linking to either `UpfrontPlan` or `SubscriptionPlan`).
    - `stripe_payment_intent_id`: `CharField`, nullable. Used for single payments initiated via Payment Intents (like the initial payment for a subscription).
    - `amount`: `DecimalField`. The amount of the payment.
    - `status`: `CharField(choices=STATUS_CHOICES)`. The state of the payment (e.g., 'pending', 'succeeded', 'failed').
    - *(Note: For recurring subscription payments (invoices), the `handle_invoice_payment_succeeded` webhook handler in `stripe_webhook.py` would be responsible for creating new `Payment` records.)*

---

## 5. User Dashboard: Post-Subscription Experience

After a user successfully subscribes, they can manage their active subscriptions and view details through their dashboard.

### File: `frontend/src/pages/UserDashboardPage.tsx`
- **Purpose:** The central entry point for a user's dashboard.
- **Features:** Displays a welcome message, basic user information, and aggregates summaries of all active plans. It includes the `SubscriptionPlanTable` component to list all the user's subscriptions.

### File: `frontend/src/components/SubscriptionPlanTable.tsx`
- **Purpose:** A reusable component designed to display a tabular list of the user's `SubscriptionPlan`s.
- **Features:**
    - Fetches the user's subscription plans by calling `getSubscriptionPlans()` from `frontend/src/api/subscriptionPlans.ts`.
    - Presents plan details in a table format, showing status, recipient name, price per delivery, and frequency.
    - Provides a "View" button (`<Eye />` icon) that links directly to the `SubscriptionPlanOverviewPage.tsx` for a detailed view of each plan.

### File: `frontend/src/pages/user_dashboard/subscription_management/SubscriptionPlanOverviewPage.tsx`
- **Purpose:** Provides a comprehensive and detailed view of a single `SubscriptionPlan`. This is the primary page for managing an active subscription.
- **Features:**
    - Displays various facets of the plan using dedicated card components: `SubscriptionStructureCard`, `RecipientCard`, `PreferencesCard`, and `PaymentHistoryCard`.
    - Includes a `PlanActivationBanner` if the plan's status is not 'active', prompting the user to complete payment if necessary.
    - Offers navigation links (`editUrl` props) to dedicated editing pages for recipient, structure, and preferences (e.g., `/dashboard/subscription-plans/{planId}/edit-recipient`), facilitating plan modifications.


