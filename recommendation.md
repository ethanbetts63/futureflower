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

### 4. `load_db_from_latest_archive` references non-existent model
`data_management/utils/archive_db/load_db_from_archive.py` includes `notifications.notification.json` in its load order, but no notifications app or model exists.

---

## Events App

### 5. Discount model is incomplete and unused
`events/models/discount.py` has no discount amount/percentage field and is never referenced in views, serializers, or pricing logic. It's also not registered in `admin.py`. Either complete the feature (add amount, integrate into pricing) or remove the model to reduce confusion.

### 6. Hash fields on OrderBase are never populated
`events/models/order_base.py` has `hash_recipient_first_name`, `hash_recipient_last_name`, `hash_recipient_street_address` but no code populates them. Only `anonymize_user()` in the users app touches them. If they're only for anonymization, that's fine, but document this clearly or add a `pre_save` signal.

### 7. Event reminder template references wrong fields
`events/templates/notifications/emails/event_reminder.html` uses `{{ event.name }}` and `{{ event.event_date }}` but the Event model has `delivery_date` and no `name` field. This template will render blank values.

### 8. Inconsistent price validation tolerances
- `events/views/upfront_plan_view.py` uses `< 0.02` tolerance
- `events/serializers/subscription_plan_serializer.py` uses `> 0.01` tolerance

Standardize to one value (suggest `0.01`).

### 9. SubscriptionPlanSerializer missing `payments` field
`events/serializers/upfront_plan_serializer.py` includes nested `payments`, but `subscription_plan_serializer.py` doesn't. Inconsistent API response shape.

### 10. Event creation in `perform_create` lacks `@transaction.atomic`
`events/views/upfront_plan_view.py` creates the UpfrontPlan then bulk_creates Events separately. If bulk_create fails, the plan exists without events. Wrap in a transaction.

---

## Users App

### 11. `anonymize_user()` silently returns if HASHING_SALT is missing
`users/utils/anonymize_user.py` prints a warning and returns without anonymizing if `HASHING_SALT` is not configured. The `DeleteUserView` returns 204 (success) even though nothing was anonymized. Should raise an exception instead.

### 12. Replace `print()` with Django logging
Multiple files use `print()` for errors:
- `users/utils/anonymize_user.py`
- `users/views/delete_user_view.py`
- `users/views/password_reset_request_view.py`
- `users/utils/send_password_reset_email.py`
- `data_management/views/add_to_blocklist_view.py`
- `payments/utils/send_admin_payment_notification.py`

### 13. No timeout on Mailgun requests
`users/utils/send_password_reset_email.py` calls `requests.post()` without a `timeout` parameter. Could hang indefinitely on network issues.

---

## Payments App

### 14. Webhook handlers should be more explicitly idempotent
`handle_payment_intent_succeeded()` does check if payment status is already `succeeded`, which is good. But `handle_invoice_payment_succeeded()` relies on `get_or_create` for the Payment record. Document the idempotency guarantees or add explicit checks throughout.

### 15. `handle_setup_intent_failed()` is a no-op
`payments/utils/webhook_handlers.py` - this handler only logs the failure. No user notification, no status update. Should at minimum update the plan status.

---

## Data Management App

### 16. BlockedEmail and TermsAndConditions not registered in admin
`data_management/admin.py` is empty. These models should be accessible via Django admin for operational management.



## Frontend

### 18. No client-side data caching
Every page re-fetches data on navigation. Plan details, colors, flower types, and user profile are fetched fresh each time. Consider React Query or SWR for caching and deduplication.

### 19. No error boundaries
No React Error Boundary components. A crash in any component takes down the entire app. Add error boundaries around major route sections.

### 20. Admin section is a stub
`frontend/src/pages/admin/AdminHomePage.tsx` is minimal (~25 lines). Either build it out or remove it from routing to avoid confusion.

### 22. `ConfigContext` fetches from non-existent endpoint
`frontend/src/context/ConfigContext.tsx` calls `getAppConfig()` which hits `/api/data/products/single-event-price/` - this endpoint doesn't exist in the backend `urls.py`.
