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
