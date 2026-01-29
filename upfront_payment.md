# Upfront Payment Flow

This document outlines the complete, detailed flow for creating and paying for a flower plan in the ForeverFlower project. The process is broken down into frontend user interactions, backend API handling, and database updates.

## 1. Frontend: The User's Journey

The user journey begins with account creation and proceeds through a multi-step flow to define and pay for a flower plan.

### Step 1: Account Creation & Plan Initialization
- **Action:** The user's journey to create a plan starts by navigating to `/event-gate` after they hit any order button across the site. This is the universal entry point for starting a new plan, regardless of whether the user is logged in or not.
- **`EventGate.tsx`:** This component acts as a gatekeeper for the event creation flow.
    - **Authentication Check:** It verifies if the user is logged in. If not, it redirects them to the account creation page (`/book-flow/create-account`). A new user will register and then be sent back to the `/event-gate` upon login.
    - **API Call:** If the user is authenticated, it calls the `getOrCreatePendingUpfrontPlan` function. This function sends a `GET` request to the backend endpoint at `/api/events/upfront-plans/get-or-create-pending/`.
- **File:** `frontend/src/components/EventGate.tsx`
- **File:** `events/views/get_or_create_inactive_plan_view.py`
    - **Backend Logic:** This view handles the request from the `EventGate`. It searches for an existing `UpfrontPlan` for the authenticated user that is marked with `status='pending_payment'`.
    - If an inactive plan is found, it returns that plan's data. This allows a user to pick up where they left off. Inactive essentially just means unpayed for. 
    - If no such plan exists, it creates a new `UpfrontPlan` instance, associates it with the user, sets `status='pending_payment'`, and returns the data for the newly created plan.
- **Navigation:** The `EventGate` receives the plan data from the backend and then navigates the user to the next step of the flow at `/book-flow/upfront-plan/${plan.id}/recipient`, ready for them to start filling out the details.

### Step 2: Recipient Details
- **File:** `frontend/src/pages/flow/Step2RecipientPage.tsx`
- **Action:** The user enters the recipient's name and address.
- **API Call:** The `updateUpfrontPlan` function is called, sending a `PATCH` request to the backend to update the `UpfrontPlan` with the recipient's information.

### Step 3: Delivery Preferences
- **File:** `frontend/src/pages/flow/Step3PreferenceSelectionPage.tsx`
- **Action:** The user can optionally select preferred and rejected colors and flower types.
- **API Call:** `updateUpfrontPlan` is called to save these preferences to the `UpfrontPlan`.

### Step 4: Custom Messages
- **File:** `frontend/src/pages/flow/Step4CustomMessagePage.tsx`
- **Action:** The user can write a single message for all deliveries or a custom message for each one.
- **API Call:** The `updateEvent` function is called for each delivery `Event` associated with the plan to save the messages. This implies the backend has already generated the individual `Event` instances based on a default or previously set plan structure.

### Step 5: Plan Structure
- **File:** `frontend/src/pages/flow/Step5StructurePage.tsx`
- **Action:** The user defines the core structure of the plan:
    - Budget per delivery
    - Number of deliveries per year
    - Total number of years
- **API Call (Price Calculation):** As the user adjusts the structure, a debounced `POST` request is sent to `/api/events/upfront-plans/<plan_id>/calculate-modification/`. This backend endpoint calculates the total upfront cost and returns it. Because the payment is upfront and the service is evenly spaced expenditures in the future, its an annuity and therefor we can provide a upfront discount to account for that. 
- **API Call (Save Structure):** When the user proceeds, `updateUpfrontPlan` is called to save the selected structure and the calculated `total_amount` to the `UpfrontPlan`.

### Step 6: Confirmation
- **File:** `frontend/src/pages/flow/Step6BookingConfirmationPage.tsx`
- **Action:** The user reviews a complete summary of their plan, including structure, recipient, preferences, messages, and the final price.
- **Navigation:** Upon confirmation, the user is taken to the payment page.

### Step 7: Payment
This step leverages a universal payment page (`CheckoutPage.tsx`) which utilizes a shared form component (`CheckoutForm.tsx`) for consistency across different payment flows. Payment initiation is handled by the `PaymentInitiatorButton.tsx` component.

#### Payment Flow (Booking & Dashboard Management)
- **File (Payment Initiation):** `frontend/src/components/PaymentInitiatorButton.tsx`
- **Action (Payment Initiation):** When a user needs to make a payment (either for a new booking or a plan modification), the `PaymentInitiatorButton.tsx` component is used. It calls the `createPaymentIntent` function to send a `POST` request to the backend.
- **Backend `CreatePaymentIntentView`:** This view creates a Stripe `PaymentIntent` and a corresponding `Payment` record in the local database. It returns the `clientSecret` for the Stripe `PaymentIntent` to the frontend.
- **File (Payment Page):** `frontend/src/pages/CheckoutPage.tsx`
- **Action (Payment Page):** The user is then redirected to this universal `CheckoutPage.tsx` with the `clientSecret` passed in the navigation state.
- **File (Payment Form Component):** `frontend/src/forms/CheckoutForm.tsx`
- **Action (Payment Form):** Within `CheckoutPage.tsx`, the `CheckoutForm.tsx` component is initialized with the `clientSecret`. This component securely collects the user's card details using Stripe Elements.

### Step 8: Payment Status
This step uses a single, universal page to display the outcome of any payment transaction, whether from the booking flow or a dashboard modification.

- **File:** `frontend/src/pages/PaymentStatusPage.tsx`
- **Action:** After submitting the payment form, the user is redirected to this page. The redirect URL includes `payment_intent_client_secret`, `plan_id`, and `source` (e.g., `'management'`) as URL parameters.
- **Stripe Integration & Logic:** The page retrieves the payment status from Stripe using the `payment_intent_client_secret` from the URL parameters. It then uses the `plan_id` and `source` parameters to dynamically:
    - Determine the appropriate redirection path if the user needs to "Try Again".
    - Display a success or failure message to the user, tailored to whether it was an initial plan payment or a modification.

## 2. Backend: API and Payment Processing

The Django backend handles the business logic, data persistence, and communication with the Stripe API.

### File: `payments/views/create_payment_intent.py`
- **View:** `CreatePaymentIntentView`
- **Endpoint:** `/api/payments/create-payment-intent/`
- **Logic:**
    - Receives the `upfront_plan_id` and, potentially, updated plan details (budget, deliveries, years, amount) from the frontend.
    - Creates a Stripe `PaymentIntent` with the `total_amount` (either the plan's original total or the new calculated amount for modifications). Metadata, including `upfront_plan_id`, `user_id`, and plan structure details (especially for modifications), is attached to the intent.
    - Creates a `Payment` record in the database, linking it to the user and `OrderBase`, and setting its initial `status` to `'pending'`.
    - Returns the `clientSecret` of the `PaymentIntent` to the frontend.

### File: `payments/views/stripe_webhook.py`
- **View:** `StripeWebhookView`
- **Endpoint:** Listens for events from Stripe (configured in the Stripe dashboard).
- **Logic for `payment_intent.succeeded`:**
    - Verifies the webhook signature to ensure the request is from Stripe.
    - Retrieves the `PaymentIntent` object from the event payload.
    - Finds the local `Payment` record using the `stripe_payment_intent_id`.
    - Updates the `Payment` record's `status` to `'succeeded'`.
    - Retrieves the `UpfrontPlan` using the `upfront_plan_id` from the webhook metadata, and its `OrderBase` parent instance (`orderbase_ptr`).
    - **Activates the plan** by setting `status` to `'active'`.
    - If the payment was for a plan modification, it updates the `UpfrontPlan`'s relevant fields (e.g., budget, years, delivery frequency) based on the metadata passed in the `PaymentIntent`).
    - Sends a notification to the site admin about the successful payment.

## 3. Backend: Pricing Calculation

The upfront price for a flower plan is not a simple sum of all deliveries. Instead, it is calculated as the **present value of an annuity**, which offers a discount to the user for paying the full cost upfront.

### File: `events/utils/upfront_price_calc.py`
- **Function:** `forever_flower_upfront_price`
- **Logic:**
    1.  **Fee per Delivery:** A service fee is calculated for each delivery. This fee is the greater of either a 5% commission on the bouquet budget (`commission_pct=0.05`) or a minimum flat fee of $15 (`min_fee_per_delivery=15`).
    2.  **Annual Cost:** The total cost for one year of the plan is calculated by summing the annual flower costs (`budget` * `deliveries_per_year`) and the annual service fees (`fee_per_delivery` * `deliveries_per_year`).
    3.  **Present Value Calculation:** The final `upfront_price` is determined by calculating the present value of this total annual cost over the number of years in the plan. This calculation uses a fixed annual real rate of return of 4% (`annual_real_return=0.04`). The formula for the annuity factor is:
        ```
        Annuity Factor = (1 - (1 + r)^-N) / r
        ```
        Where `r` is the annual real return and `N` is the number of years.
    4.  **Final Price:** The `upfront_price` is the `total_cost_year` multiplied by this `annuity_factor`. This final price, along with a breakdown of the calculation, is then returned to the frontend.

## 4. Database Models

These are the core Django models that store the data for the entire flow.

### File: `events/models/upfront_plan.py` (for `UpfrontPlan` model)
- **Model:** `UpfrontPlan`
- **Purpose:** The `UpfrontPlan` model inherits from `OrderBase`. `OrderBase` is the central model for all order-related information. `UpfrontPlan` holds information specific to upfront payment plans.
- **Key Fields:** `user`, `status`, `start_date`, `budget`, `deliveries_per_year`, `years`, `total_amount`, recipient details, and links to preferences.

### `events/models/event.py`
- **Model:** `Event`
- **Purpose:** Represents a single, specific delivery within an `OrderBase` (specifically, an `UpfrontPlan` in this context).
- **Key Fields:** `order` (foreign key), `delivery_date`, `message`, `status`.

### `payments/models/payment.py`
- **Model:** `Payment`
- **Purpose:** Records a payment transaction.
- **Key Fields:** `user`, `order` (foreign key), `stripe_payment_intent_id`, `amount`, `status` (`pending`, `succeeded`, `failed`).

## 5. User Dashboard: Post-Payment Experience

After a successful payment, the user can manage their active plan through the dashboard.

### File: `frontend/src/pages/UserDashboardPage.tsx`
- **Purpose:** The main dashboard view.
- **Features:** Displays a welcome message, user details, and a summary of the next upcoming delivery across all plans. It lists all of the user's plans in the `UpfrontPlanTable` component.

### File: `frontend/src/pages/user_dashboard/upfront_management/PlanOverviewPage.tsx`
- **Purpose:** Provides a comprehensive, detailed view of a single `UpfrontPlan`.
- **Features:**
    - Displays all plan details using modular components like `PlanStructureCard`, `DeliveryDatesCard`, `PreferencesCard`, and `RecipientCard`.
    - Shows payment history via the `PaymentHistoryCard`.
    - Allows the user to edit various parts of the plan, which will trigger a similar, but modified, flow for handling payment for any plan upgrades.
    - If a plan has been created but not yet paid for (`is_active` is `False`), it displays a `PlanActivationBanner` prompting the user to complete payment.

## 6. Component Architecture & Reusability

The project separates the user journey into two main directories: `flow` for the initial creation of a plan, and `user_dashboard` for viewing and editing existing plans. This architecture prioritizes clear delineation of user journeys while maximizing code reusability through specialized, context-aware components.

### Equivalent Pages
- **Recipient Details:**
    - **Creation:** `flow/Step2RecipientPage.tsx`
    - **Editing:** `frontend/src/pages/user_dashboard/upfront_management/EditRecipientPage.tsx`
- **Preferences:**
    - **Creation:** `flow/Step3PreferenceSelectionPage.tsx`
    - **Editing:** `frontend/src/pages/user_dashboard/upfront_management/EditPreferencesPage.tsx`
- **Messages:**
    - **Creation:** `flow/Step4CustomMessagePage.tsx`
    - **Editing:** `frontend/src/pages/user_dashboard/upfront_management/EditMessagesPage.tsx`
- **Plan Structure:**
    - **Creation:** `flow/Step5StructurePage.tsx`
    - **Editing:** `frontend/src/pages/user_dashboard/upfront_management/EditStructurePage.tsx`
- **Payment:**
    - **Creation:** `flow/Step7PaymentPage.tsx`
    - **Editing:** `frontend/src/pages/CheckoutPage.tsx` (Handles payment for modifications)
- **Payment Status:**
    - **Universal:** `PaymentStatusPage.tsx` (handles status for both booking and management flows)

### Shared Components
The project extensively uses shared components to abstract common logic and UI elements, making the codebase modular and maintainable.
- **`RecipientEditor`**: Contains the form for recipient details and is used by both `Step2RecipientPage.tsx` and `EditRecipientPage.tsx`.
- **`StructureEditor`**: Contains the form for the plan's structure (budget, years, etc.) and is used by both `Step5StructurePage.tsx` and `EditStructurePage.tsx`.
- **`MessagesEditor`**: Manages message input for deliveries, used by both `Step4CustomMessagePage.tsx` and `EditMessagesPage.tsx`.
- **`PlanDisplay`**: A smart component responsible for fetching and providing core flower plan data (`plan`, `colorMap`, `flowerTypeMap`) to its children, used by `Step6BookingConfirmationPage.tsx` and `PlanOverviewPage.tsx`.

- **`PaymentInitiatorButton`**: Initiates the payment process by calling the backend API to create a Stripe `PaymentIntent`.
- **UI Components:** Standard UI elements from `shadcn/ui` (like `Card`, `Button`, `Spinner`) and custom components like `Seo` and `BackButton` are used consistently across both flows.

### Component Architecture Philosophy
Our architectural approach prioritizes maintaining dedicated page components for distinct user flows (e.g., initial booking flow vs. dashboard-based plan management). This explicit separation clearly delineates user journeys and contexts within the application. However, to prevent code duplication and promote maintainability, we consistently extract common logic, data fetching, and UI patterns into robust, context-aware "Editor" components (such as `StructureEditor` and `MessagesEditor`). These reusable components are then utilized by the dedicated page components, ensuring high code reuse without compromising the clarity of each user flow. This strategy enhances modularity, simplifies testing, and makes the codebase more scalable and easier to understand for developers.