# Upfront Payment Flow

This document outlines the complete, detailed flow for creating and paying for a flower plan in the ForeverFlower project. The process is broken down into frontend user interactions, backend API handling, and database updates.

## 1. Frontend: The User's Journey

The user journey begins with account creation and proceeds through a multi-step flow to define and pay for a flower plan.

### Step 1: Account Creation & Plan Initialization
- **Action:** The user's journey to create a plan starts by navigating to `/event-gate`. This is the universal entry point for starting a new plan, regardless of whether the user is logged in or not.
- **`EventGate.tsx`:** This component acts as a gatekeeper for the event creation flow.
    - **Authentication Check:** It verifies if the user is logged in. If not, it redirects them to the account creation page (`/book-flow/create-account`). A new user will register and then be sent back to the `/event-gate` upon login.
    - **API Call:** If the user is authenticated, it calls the `getOrCreateInactiveFlowerPlan` function. This function sends a `GET` request to the backend endpoint at `/api/events/flower-plans/get-or-create-inactive/`.
- **`get_or_create_inactive_plan_view.py`:**
    - **Backend Logic:** This view handles the request from the `EventGate`. It searches for an existing `FlowerPlan` for the authenticated user that is marked as `is_active=False`.
    - If an inactive plan is found, it returns that plan's data. This allows a user to pick up where they left off.
    - If no inactive plan exists, it creates a new `FlowerPlan` instance, associates it with the user, sets `is_active=False`, and returns the data for the newly created plan.
- **Navigation:** The `EventGate` receives the plan data from the backend and then navigates the user to the next step of the flow at `/book-flow/flower-plan/${plan.id}/recipient`, ready for them to start filling out the details.

### Step 2: Recipient Details
- **File:** `frontend/src/pages/flow/Step2RecipientPage.tsx`
- **Action:** The user enters the recipient's name and address.
- **API Call:** The `updateFlowerPlan` function is called, sending a `PATCH` request to the backend to update the `FlowerPlan` with the recipient's information.

### Step 3: Delivery Preferences
- **File:** `frontend/src/pages/flow/Step3PreferenceSelectionPage.tsx`
- **Action:** The user can optionally select preferred and rejected colors and flower types.
- **API Call:** `updateFlowerPlan` is called to save these preferences to the `FlowerPlan`.

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
- **API Call (Price Calculation):** As the user adjusts the structure, a debounced `POST` request is sent to `/api/events/calculate-price/`. This backend endpoint calculates the total upfront cost and returns it. Becuase the payment is upfront and the service is evenly spaced expenditures in the future, its an annuity and therefor we can provide a upfront discount to account for that. 
- **API Call (Save Structure):** When the user proceeds, `updateFlowerPlan` is called to save the selected structure and the calculated `total_amount` to the `FlowerPlan`.

### Step 6: Confirmation
- **File:** `frontend/src/pages/flow/Step6BookingConfirmationPage.tsx`
- **Action:** The user reviews a complete summary of their plan, including structure, recipient, preferences, messages, and the final price.
- **Navigation:** Upon confirmation, the user is taken to the payment page.

### Step 7: Payment
- **File:** `frontend/src/pages/flow/Step7PaymentPage.tsx`
- **Action:** The user is presented with a Stripe Elements payment form.
- **API Call:**
    1. The `createPaymentIntent` function is called, which sends a `POST` request to `/api/payments/create-payment-intent/`.
    2. The backend `CreatePaymentIntentView` creates a Stripe `PaymentIntent` and a corresponding `Payment` record in the local database with a `status` of `'pending'`.
    3. The `clientSecret` for the Stripe `PaymentIntent` is returned to the frontend.
- **Stripe Integration:** The `clientSecret` is used to initialize the `CheckoutForm` component, which securely collects the user's card details.

### Step 8: Payment Status
- **File:** `frontend/src/pages/flow/Step8PaymentStatusPage.tsx`
- **Action:** After submitting the payment form, the user is redirected to this page.
- **Stripe Integration:** The page retrieves the payment status from Stripe using the `payment_intent_client_secret` from the URL parameters. It then displays a success or failure message to the user.

## 2. Backend: API and Payment Processing

The Django backend handles the business logic, data persistence, and communication with the Stripe API.

### `create_payment_intent.py`
- **View:** `CreatePaymentIntentView`
- **Endpoint:** `/api/payments/create-payment-intent/`
- **Logic:**
    - Receives the `flower_plan_id` from the frontend.
    - Finds the corresponding `FlowerPlan`.
    - Creates a Stripe `PaymentIntent` with the `total_amount` of the plan. Metadata, including `flower_plan_id`, `user_id`, and plan structure details, is attached to the intent.
    - Creates a `Payment` record in the database, linking it to the user and `FlowerPlan`, and setting its initial `status` to `'pending'`.
    - Returns the `clientSecret` of the `PaymentIntent` to the frontend.

### `stripe_webhook.py`
- **View:** `StripeWebhookView`
- **Endpoint:** Listens for events from Stripe (configured in the Stripe dashboard).
- **Logic for `payment_intent.succeeded`:**
    - Verifies the webhook signature to ensure the request is from Stripe.
    - Retrieves the `PaymentIntent` object from the event payload.
    - Finds the local `Payment` record using the `stripe_payment_intent_id`.
    - Updates the `Payment` record's `status` to `'succeeded'`.
    - Retrieves the `FlowerPlan` using the `flower_plan_id` from the webhook metadata.
    - **Activates the plan** by setting `is_active` to `True`.
    - If the payment was for a plan modification, it updates the `FlowerPlan`'s budget, years, and delivery frequency based on the metadata passed in the `PaymentIntent`.
    - Sends a notification to the site admin about the successful payment.

## 3. Backend: Pricing Calculation

The upfront price for a flower plan is not a simple sum of all deliveries. Instead, it is calculated as the **present value of an annuity**, which offers a discount to the user for paying the full cost upfront.

### `events/utils/pricing_calculators.py`
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

### `events/models/flower_plan.py`
- **Model:** `FlowerPlan`
- **Purpose:** The central model that holds all information for a user's plan.
- **Key Fields:** `user`, `is_active`, `start_date`, `budget`, `deliveries_per_year`, `years`, `total_amount`, recipient details, and links to preferences.

### `events/models/event.py`
- **Model:** `Event`
- **Purpose:** Represents a single, specific delivery within a `FlowerPlan`.
- **Key Fields:** `flower_plan` (foreign key), `delivery_date`, `message`, `status`.

### `payments/models/payment.py`
- **Model:** `Payment`
- **Purpose:** Records a payment transaction.
- **Key Fields:** `user`, `flower_plan` (foreign key), `stripe_payment_intent_id`, `amount`, `status` (`pending`, `succeeded`, `failed`).

## 5. User Dashboard: Post-Payment Experience

After a successful payment, the user can manage their active plan through the dashboard.

### `UserDashboardPage.tsx`
- **Purpose:** The main dashboard view.
- **Features:** Displays a welcome message, user details, and a summary of the next upcoming delivery across all plans. It lists all of the user's plans in the `FlowerPlanTable` component.

### `PlanOverviewPage.tsx`
- **Purpose:** Provides a comprehensive, detailed view of a single `FlowerPlan`.
- **Features:**
    - Displays all plan details using modular components like `PlanStructureCard`, `DeliveryDatesCard`, `PreferencesCard`, and `RecipientCard`.
    - Shows payment history via the `PaymentHistoryCard`.
    - Allows the user to edit various parts of the plan, which will trigger a similar, but modified, flow for handling payment for any plan upgrades.
    - If a plan has been created but not yet paid for (`is_active` is `False`), it displays a `PlanActivationBanner` prompting the user to complete payment.

## 6. Flow vs. User Dashboard: Component Analysis

The project separates the user journey into two main directories: `flow` for the initial creation of a plan, and `user_dashboard` for viewing and editing existing plans. This analysis compares the two.

### Equivalent Pages
- **Recipient Details:**
    - **Creation:** `flow/Step2RecipientPage.tsx`
    - **Editing:** `user_dashboard/EditRecipientPage.tsx`
- **Plan Structure:**
    - **Creation:** `flow/Step5StructurePage.tsx`
    - **Editing:** `user_dashboard/EditStructurePage.tsx`
- **Preferences:**
    - **Creation:** `flow/Step3PreferenceSelectionPage.tsx`
    - **Editing:** `user_dashboard/EditPreferencesPage.tsx`
- **Messages:**
    - **Creation:** `flow/Step4CustomMessagePage.tsx`
    - **Editing:** `user_dashboard/EditMessagesPage.tsx`

### Shared Components
The project makes good use of shared components to reduce code duplication between the creation and editing flows.
- **`RecipientEditor`**: Contains the form for recipient details and is used by both `Step2RecipientPage.tsx` and `EditRecipientPage.tsx`.
- **`StructureEditor`**: Contains the form for the plan's structure (budget, years, etc.) and is used by both `Step5StructurePage.tsx` and `EditStructurePage.tsx`.
- **UI Components:** Standard UI elements from `shadcn/ui` (like `Card`, `Button`, `Spinner`) and custom components like `Seo` and `BackButton` are used consistently across both flows.

### Opportunities for Consolidation
While some pages are already shared, there is an opportunity to further reduce duplication.
- **Recipient & Structure Pages:**
    - The page-level components for managing the recipient (`Step2RecipientPage.tsx` vs. `EditRecipientPage.tsx`) and the plan structure (`Step5StructurePage.tsx` vs. `EditStructurePage.tsx`) are currently separate files.
    - Their internal logic for fetching data, managing form state, and handling save/cancel actions is highly similar.
    - **Recommendation:** These could be consolidated into single, more robust components. For example, a single `RecipientPage.tsx` could handle both creation and editing, using a URL parameter (like `?source=management`) to slightly alter its behavior (e.g., the redirect path on save, the title, or the save button text).


