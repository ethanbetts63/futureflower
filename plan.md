Phase 1: Backend Refactoring


  The goal of this phase is to make the backend the authoritative source for all payment-related business logic.


   * File: payments/views/create_payment_intent.py
       * Change: The CreatePaymentIntentView will be modified to handle different item_type values sent from the frontend.
       * How: The view will be refactored to use if/elif blocks based on an item_type parameter in the request body. It will contain specific logic
         branches to calculate the correct amount for 'UPFRONT_PLAN_MODIFY', 'UPFRONT_PLAN_NEW', and 'SUBSCRIPTION_PLAN_NEW'. It will no longer
         trust an amount sent from the client for modifications.


   * File: payments/utils/webhook_handlers.py
       * Change: The handle_payment_intent_succeeded function will be updated to handle fulfillment for different transaction types.
       * How: It will be refactored to use if/elif blocks based on the item_type found in the payment's metadata. This will ensure the correct
         fulfillment logic is run, whether it's updating an existing plan's data or creating a new recurring subscription in Stripe.

  ---


  Phase 2: Frontend Core Implementation

  This phase involves creating the new, reusable frontend components that form the foundation of the new system.


   * New File: frontend/src/pages/CheckoutPage.tsx
       * Purpose: This will be the single, unified payment page for the entire application.
       * How: It will be a simple component that reads a clientSecret from the useLocation state, and uses it to render the Stripe Elements provider
         and the CheckoutForm.


   * New File: frontend/src/components/PaymentInitiatorButton.tsx
       * Purpose: A reusable button to encapsulate all payment initiation logic.
       * How: This component will take itemType and details as props. Its onClick handler will call the createPaymentIntent API function and, on
         success, navigate to the new /checkout page with the returned clientSecret.


   * File: frontend/src/api/payments.ts
       * Change: The TypeScript definition for the createPaymentIntent payload will be updated to match the new generic structure: { item_type:
         string; details: object }.


   * File: frontend/src/App.tsx
       * Change: The application's routes will be updated.
       * How: A new route will be added (<Route path="/checkout" element={<CheckoutPage />} />), and the old, redundant routes for
         UserDashboardPaymentPage and Step7PaymentPage will be removed.

  ---

  Phase 3: Frontend Integration

  This phase involves integrating the new core components into the existing user flows.


   * File: frontend/src/components/StructureEditor.tsx
       * Change: This component will be simplified significantly.
       * How: The complex handleSave logic for payments will be removed. It will be replaced by rendering the new PaymentInitiatorButton, passing
         the appropriate props (itemType='UPFRONT_PLAN_MODIFY', and the plan details).


   * File: frontend/src/pages/upfront_flow/Step6BookingConfirmationPage.tsx (and other plan creation confirmation pages)
       * Change: The navigation logic will be updated.
       * How: The existing button will be replaced with the PaymentInitiatorButton, configured with the correct itemType for new plan creation.

  ---

  Phase 4: Deprecation and Cleanup

  The final step is to remove the now-obsolete files to clean up the codebase.


   * Files to be Deleted:
       * frontend/src/components/PaymentProcessor.tsx
       * frontend/src/pages/user_dashboard/UserDashboardPaymentPage.tsx
       * frontend/src/pages/upfront_flow/Step7PaymentPage.tsx
