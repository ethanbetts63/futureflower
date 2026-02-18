# Simplification Recommendations

Ideas for reducing complexity across the project, organized by scope.

---

## Project-Level

### 1. Consolidate `send_admin_payment_notification`
`payments/utils/send_admin_payment_notification.py` is fully implemented but never called from any webhook handler or view. Either wire it into `handle_payment_intent_succeeded()` or delete it.

### 2. Root-level `package.json` is nearly empty
`package.json` at root only has `date-fns`. All real frontend deps are in `frontend/package.json`. Consider removing the root `package.json` and `node_modules/` if they aren't serving a purpose, or set up npm workspaces properly.

### 3. `send_test_email` command references non-existent code
`data_management/management/commands/send_test_email.py` imports `events.utils.send_reminder_email` (doesn't exist) and uses a `Notification` class (doesn't exist). The `--reminder_test` flag will crash on use.

---

## Events App

### 4. Hash fields on OrderBase are never populated
`events/models/order_base.py` has `hash_recipient_first_name`, `hash_recipient_last_name`, `hash_recipient_street_address` but no code populates them. Only `anonymize_user()` in the users app touches them. If they're only for anonymization, that's fine, but document this clearly or add a `pre_save` signal.

### 5. Event reminder template references wrong fields
`events/templates/notifications/emails/event_reminder.html` uses `{{ event.name }}` and `{{ event.event_date }}` but the Event model has `delivery_date` and no `name` field. This template will render blank values.

---

## Users App

### 6. No timeout on Mailgun requests
`users/utils/send_password_reset_email.py` calls `requests.post()` without a `timeout` parameter. Could hang indefinitely on network issues.

---

## Payments App

### 7. Webhook handlers should be more explicitly idempotent
`handle_payment_intent_succeeded()` does check if payment status is already `succeeded`, which is good. But `handle_invoice_payment_succeeded()` relies on `get_or_create` for the Payment record. Document the idempotency guarantees or add explicit checks throughout.

### 8. `handle_setup_intent_failed()` is a no-op
`payments/utils/webhook_handlers.py` - this handler only logs the failure. No user notification, no status update. Should at minimum update the plan status.

---

## Frontend

### 9. No client-side data caching
Every page re-fetches data on navigation. Plan details, flower types, and user profile are fetched fresh each time. Consider React Query or SWR for caching and deduplication.

### 10. No error boundaries
No React Error Boundary components. A crash in any component takes down the entire app. Add error boundaries around major route sections.

### 11. Admin section is a stub
`frontend/src/pages/admin/AdminHomePage.tsx` is minimal (~25 lines). Either build it out or remove it from routing to avoid confusion.

### 12. Move to HttpOnly Cookies for Authentication
The current JWT implementation stores tokens in `localStorage`, which is vulnerable to XSS. Moving to `HttpOnly` cookies would improve security by making tokens inaccessible to JavaScript. This requires updating the Django backend to set cookies and the frontend to include credentials in requests, as well as handling CSRF protection more explicitly.

### 13. Summary Table for Checkout
The `OrderSummaryCard` on the checkout page currently calculates "Handling" fees and totals using frontend-only logic. This creates a risk of discrepancies between what the user sees and what they are actually charged. Fee calculations should be centralized or retrieved from the API.

### 14. Empty States and "What's Next?"
The dashboard currently lacks helpful empty states. Instead of just stating "You have no plans," it should provide a clear call-to-action (CTA) to start the creation flow, guiding new users toward their first purchase.

### 15. Post-Purchase Editing Friction
The entire post-purchase management system needs a rethink. Currently, making small changes (like updating delivery notes or flower preferences) requires navigating to separate edit pages. Implementing in-place editing or modal-based updates would significantly improve the user experience.

### 16. The "Active vs. Inactive" State Confusion
Users with unpaid plans are often forced back through the configuration flow to find a payment button. The dashboard and plan overview pages should provide a direct "Complete Payment" or "Activate" button to streamline the path to revenue for existing pending plans.

### 17. The "Inconsistent Routing" Issue
There is a mismatch between defined routes in `App.tsx` and internal navigation (e.g., `/dashboard/upfront-plans/` vs `/dashboard/plans/`). This needs to be audited and unified to prevent 404s and broken links during plan management.

### 18. Active Upfront Plan Modification: Schedule Desync
When an active Upfront plan is modified (budget, years, or frequency), the system successfully calculates the price difference and updates the plan metadata via the `UPFRONT_PLAN_MODIFY` webhook handler. However, it does **not** update or re-generate the existing `DeliveryEvent` objects. This results in a "Stale Schedule" where the user has paid for a new structure, but the system still tracks deliveries based on the old one.

### 19. unused file? 
C:\Users\ethan\coding\futureflower\events\views\public_upfront_price_view.py im fairly sure that this is not being used. C:\Users\ethan\coding\futureflower\events\urls.py but maybe im wrong. check me. 

### 20. Get rid of the anonymization stuff.
It would be good to have but right now its overkill.

### 21. Event Evidence Images
Add image upload fields to the `Event` model for admin documentation purposes:
- `ordering_evidence_image` — screenshot of the placed order
- `delivery_evidence_image` — photo confirmation of delivery

Deferred because media storage infrastructure (S3 or equivalent) adds complexity that isn't justified yet. The text evidence fields (`ordering_evidence_text`, `delivery_evidence_text`) cover the immediate need. Revisit once media uploads are needed elsewhere in the app.

---

### 22. Payment Method Fraud Prevention for Discount Codes

**Problem:** Discount codes are restricted to first-time customers, but this is only enforced per-account. A bad actor could create multiple accounts and reuse the same credit card to claim the discount repeatedly.

**Ideal Solution (Option C — Pre-Confirmation Check):**

1. Add a `stripe_payment_method_id` field to the `Payment` model to record which card/method was used for each payment.
2. Change the payment intent to use `capture_method: 'manual'` when a discount code is involved. This authorizes the card but doesn't charge it yet.
3. After the user attaches their payment method (but before confirming the charge), call Stripe to retrieve the payment method fingerprint (`payment_method.card.fingerprint`). Stripe assigns the same fingerprint to the same physical card regardless of which account uses it.
4. Check your database: has this fingerprint been used on a *different* account that also used a discount code? If yes, reject the payment and cancel the intent.
5. If clean, confirm the payment intent to capture the funds.

**Why this is deferred:** It adds meaningful complexity (manual capture flow, fingerprint storage, new validation step) for a fraud vector that only matters at scale. The current per-account first-purchase check is sufficient for now. Revisit when discount code abuse becomes a measurable problem.