
## Project-Level
### 2. Root-level `package.json` is nearly empty
`package.json` at root only has `date-fns`. All real frontend deps are in `frontend/package.json`. Consider removing the root `package.json` and `node_modules/` if they aren't serving a purpose, or set up npm workspaces properly.

### 5. Event reminder template references wrong fields
`events/templates/notifications/emails/event_reminder.html` uses `{{ event.name }}` and `{{ event.event_date }}` but the Event model has `delivery_date` and no `name` field. This template will render blank values.

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

### 16. The "Active vs. Inactive" State Confusion
Users with unpaid plans are often forced back through the configuration flow to find a payment button. The dashboard and plan overview pages should provide a direct "Complete Payment" or "Activate" button to streamline the path to revenue for existing pending plans.

### 21. Event Evidence Images
Add image upload fields to the `Event` model for admin documentation purposes:
- `ordering_evidence_image` — screenshot of the placed order
- `delivery_evidence_image` — photo confirmation of delivery

Deferred because media storage infrastructure (S3 or equivalent) adds complexity that isn't justified yet. The text evidence fields (`ordering_evidence_text`, `delivery_evidence_text`) cover the immediate need. Revisit once media uploads are needed elsewhere in the app.
---

### 23. Terms Acceptance Versioning

**Current state:** `TermsAcceptance` records which version of each terms type a user accepted. Accepting any version of a type is currently sufficient to proceed.

**Future work:** Add logic to require re-acceptance when a newer version is published. The check would be:

```python
latest = TermsAndConditions.objects.filter(terms_type='customer').order_by('-published_at').first()
user.terms_acceptances.filter(terms=latest).exists()
```

Instead of the current looser check:

```python
user.terms_acceptances.filter(terms__terms_type='customer').exists()
```

Deferred because terms are not expected to change frequently and the infrastructure (TermsAcceptance model, API endpoint, frontend gating) is already in place. Swap the check when versioning becomes a real requirement.

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

### 23. skip a delivery 
long term it would be good to be able to offer the user when they go to cancel their cubscription something like "going on holiday? why not just put your subscription on hold"

### 24. need to add logic for paying florists a delivery fee. 