# Admin Dashboard & Notification System — Implementation Plan

## Overview

This document covers two stages:

- **Stage 1** — Event model changes + backend admin API + frontend admin task queue (buildable and testable independently)
- **Stage 2** — Notification model + management command + wiring into webhooks

All new backend code lives in `data_management`. The frontend admin section is integrated into the existing `/dashboard` layout (same pattern as the partner dashboard), not a separate shell.

---

## Stage 1: Event Model, Admin API, and Frontend Task Queue

### Step 1 — Update the Event Model

**File:** `events/models/event.py`

- Rename `in_progress` → `ordered` in `STATUS_CHOICES`. Update the human-readable label too: `('ordered', 'Ordered')`.
- Add four new fields:
  - `ordered_at = models.DateTimeField(null=True, blank=True)` — timestamp of when admin marked the event as ordered
  - `ordering_evidence_text = models.TextField(null=True, blank=True)` — admin pastes confirmation number, order details, etc.
  - `delivered_at = models.DateTimeField(null=True, blank=True)` — timestamp of when admin confirmed delivery
  - `delivery_evidence_text = models.TextField(null=True, blank=True)` — admin notes on confirmed delivery
- Create and apply migration.
- Check `events/admin.py` to make sure the renamed status doesn't break any list_filter or list_display references.

---

### Step 2 — Admin Event Serializer

**New file:** `data_management/serializers/admin_event_serializer.py`

This serializer is for read-only event detail views. It must flatten all the information an admin needs to place an order with a third-party florist — no clicking around to find recipient details.

Fields to include:

**Event fields:**
- `id`, `delivery_date`, `status`, `message`
- `ordered_at`, `ordering_evidence_text`
- `delivered_at`, `delivery_evidence_text`

**From `event.order` (the OrderBase):**
- `order_id`, `order_type` (derived: "Upfront Plan" or "Subscription Plan"), `budget`, `total_amount`, `frequency`
- `start_date`, `preferred_delivery_time`, `delivery_notes`
- Recipient: `recipient_first_name`, `recipient_last_name`, `recipient_street_address`, `recipient_suburb`, `recipient_city`, `recipient_state`, `recipient_postcode`, `recipient_country`
- Preferences: `flower_notes`, `preferred_flower_types` (list of names, not PKs)

**From `event.order.user`:**
- `customer_first_name`, `customer_last_name`, `customer_email`

This is a flat serializer (no nested objects) — everything at the top level so the frontend can render without extra lookups.

Export from `data_management/serializers/__init__.py`.

---

### Step 3 — Admin Dashboard View

**New file:** `data_management/views/admin_dashboard_view.py`

- Method: `GET`
- URL: `/api/data/admin/dashboard/`
- Permission: `IsAdminUser` (DRF built-in — requires `is_staff=True`)

Logic:
1. Compute `cutoff = today + 14 days`
2. Query three event sets:
   - **to_order:** `Event.objects.filter(status='scheduled', delivery_date__lte=cutoff).select_related('order', 'order__user').prefetch_related('order__preferred_flower_types').order_by('delivery_date')`
   - **ordered:** `Event.objects.filter(status='ordered').select_related('order', 'order__user').prefetch_related('order__preferred_flower_types').order_by('delivery_date')`
   - **delivered:** `Event.objects.filter(status='delivered').select_related('order', 'order__user').prefetch_related('order__preferred_flower_types').order_by('-delivered_at')[:50]` (cap at 50 to avoid loading all history)
3. Serialize each set with `AdminEventSerializer`
4. Return `{ to_order: [...], ordered: [...], delivered: [...] }`

---

### Step 4 — Admin Event Detail View

**New file:** `data_management/views/admin_event_detail_view.py`

- Method: `GET`
- URL: `/api/data/admin/events/<int:pk>/`
- Permission: `IsAdminUser`

Returns a single event serialized with `AdminEventSerializer`. Used by the frontend "View" button on each task card and the detail page.

---

### Step 5 — Mark Ordered View

**New file:** `data_management/views/admin_mark_ordered_view.py`

- Method: `POST`
- URL: `/api/data/admin/events/<int:pk>/mark-ordered/`
- Permission: `IsAdminUser`

Request body:
```json
{
  "ordered_at": "2025-03-15T10:30:00",
  "ordering_evidence_text": "Order #12345 placed via FTD, confirmation email received."
}
```

Logic:
1. Fetch the Event by PK — return 404 if not found
2. Validate that `status == 'scheduled'` — return 400 if not (guard against double-submit)
3. Set `status = 'ordered'`, `ordered_at = <from request>`, `ordering_evidence_text = <from request>`
4. Save the event
5. **Cancel pending notifications:** query `Notification.objects.filter(related_event=event, status='pending')` and set each to `status='cancelled'` (bulk update)
6. **Create delivery-day notifications:** call `create_admin_delivery_day_notifications(event)` (Stage 2 utility — stub this in Stage 1, wire it in Stage 2)
7. Return the updated event serialized with `AdminEventSerializer`

---

### Step 6 — Mark Delivered View

**New file:** `data_management/views/admin_mark_delivered_view.py`

- Method: `POST`
- URL: `/api/data/admin/events/<int:pk>/mark-delivered/`
- Permission: `IsAdminUser`

Request body:
```json
{
  "delivered_at": "2025-03-15T14:00:00",
  "delivery_evidence_text": "Customer confirmed via phone. Left at front door."
}
```

Logic:
1. Fetch the Event by PK
2. Validate `status == 'ordered'` — return 400 if not
3. Set `status = 'delivered'`, `delivered_at`, `delivery_evidence_text`
4. Save
5. Return updated event

---

### Step 7 — Wire URLs

**File:** `data_management/urls.py`

Add:
```
GET  /api/data/admin/dashboard/                    → AdminDashboardView
GET  /api/data/admin/events/<pk>/                  → AdminEventDetailView
POST /api/data/admin/events/<pk>/mark-ordered/     → AdminMarkOrderedView
POST /api/data/admin/events/<pk>/mark-delivered/   → AdminMarkDeliveredView
```

Check that `data_management/urls.py` is included in the root `futureflower/urls.py` (it should already be at `/api/data/`).

---

### Step 8 — Frontend: Restructure Admin into Dashboard

**Remove:**
- `frontend/src/pages/admin/AdminLayout.tsx` — delete this file
- The `/admin-dashboard` route block in `App.tsx` — remove it

**Update `frontend/src/pages/user_dashboard/UserDashboardLayout.tsx`:**

Add a conditional admin section to the sidebar, following the exact same pattern as the `user?.is_partner` block:

```tsx
{(user?.is_staff || user?.is_superuser) && (
  <div className="border-t border-gray-600 pt-4">
    <p className="text-xs uppercase tracking-wider text-gray-400 mb-4">Admin</p>
    <div className="flex flex-col space-y-6">
      <Link to="/dashboard/admin" className="text-lg hover:text-gray-300">Task Queue</Link>
    </div>
  </div>
)}
```

Also add `is_staff` and `is_superuser` to the navigation context links conditionally (following the existing `is_partner` pattern).

**Update `App.tsx`:**

Add admin routes inside the existing `/dashboard` route block:

```tsx
{/* Admin routes */}
<Route path="admin" element={<AdminGuard><AdminDashboardPage /></AdminGuard>} />
<Route path="admin/events/:eventId" element={<AdminGuard><AdminEventDetailPage /></AdminGuard>} />
<Route path="admin/events/:eventId/mark-ordered" element={<AdminGuard><MarkOrderedPage /></AdminGuard>} />
<Route path="admin/events/:eventId/mark-delivered" element={<AdminGuard><MarkDeliveredPage /></AdminGuard>} />
```

`AdminGuard` is a small wrapper component that redirects to `/dashboard` if `!user?.is_staff && !user?.is_superuser`. Create it at `frontend/src/components/AdminGuard.tsx`.

---

### Step 9 — Frontend API Layer

**New file:** `frontend/src/api/admin.ts`

```ts
getAdminDashboard()                          → GET /api/data/admin/dashboard/
getAdminEvent(id: number)                    → GET /api/data/admin/events/{id}/
markEventOrdered(id, payload)                → POST /api/data/admin/events/{id}/mark-ordered/
markEventDelivered(id, payload)              → POST /api/data/admin/events/{id}/mark-delivered/
```

All use `authedFetch` from `apiClient.ts`.

---

### Step 10 — Frontend TypeScript Types

**New file:** `frontend/src/types/Admin.ts`

```ts
interface AdminEvent {
  id: number;
  delivery_date: string;
  status: 'scheduled' | 'ordered' | 'delivered' | 'cancelled';
  message: string | null;
  ordered_at: string | null;
  ordering_evidence_text: string | null;
  delivered_at: string | null;
  delivery_evidence_text: string | null;
  // Order fields
  order_id: number;
  order_type: string;
  budget: string;
  total_amount: string;
  frequency: string | null;
  preferred_delivery_time: string | null;
  delivery_notes: string | null;
  // Recipient
  recipient_first_name: string;
  recipient_last_name: string;
  recipient_street_address: string;
  recipient_suburb: string;
  recipient_city: string;
  recipient_state: string;
  recipient_postcode: string;
  recipient_country: string;
  // Preferences
  flower_notes: string | null;
  preferred_flower_types: string[];
  // Customer
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
}

interface AdminDashboard {
  to_order: AdminEvent[];
  ordered: AdminEvent[];
  delivered: AdminEvent[];
}

interface MarkOrderedPayload {
  ordered_at: string;
  ordering_evidence_text: string;
}

interface MarkDeliveredPayload {
  delivered_at: string;
  delivery_evidence_text: string;
}
```

Export from `frontend/src/types/index.ts`.

---

### Step 11 — AdminDashboardPage

**Replace** `frontend/src/pages/admin/AdminHomePage.tsx` with a fully functional `AdminDashboardPage.tsx`.

On mount: fetch `getAdminDashboard()`, store in state.

Layout: Three sections stacked vertically (or columns on wide screens). Each section has:
- A heading: "To Order", "Ordered", "Delivered"
- A count badge
- A list of event cards

Each **event card** shows:
- Recipient full name
- Delivery date (formatted, e.g. "Mon 15 March 2025")
- Budget (e.g. "$150")
- Suburb / City
- Days until delivery (for "To Order" section — adds urgency, e.g. "in 3 days" in red if ≤ 3)
- Buttons:
  - **To Order cards:** `View` button + `Place Order` button (navigates to `/dashboard/admin/events/:id/mark-ordered`)
  - **Ordered cards:** `View` button + `Confirm Delivery` button (navigates to `/dashboard/admin/events/:id/mark-delivered`)
  - **Delivered cards:** `View` button only

Empty states for each section: "No events currently in this queue."

---

### Step 12 — AdminEventDetailPage

**New file:** `frontend/src/pages/admin/AdminEventDetailPage.tsx`

On mount: fetch `getAdminEvent(eventId)`.

Layout — two clear sections:

**Section 1: Order Details** (everything needed to place the order)
- Recipient: Full name, street address, suburb, city, state, postcode, country
- Delivery: Date, preferred time, delivery notes
- Order: Budget, total amount, plan type, frequency
- Flowers: Type names (comma-separated), flower notes
- Card message: the `message` field
- Customer contact: name, email (so admin can contact if needed)

Make the address section especially easy to copy (single line of formatted address).

**Section 2: Status & Evidence**
- Current status badge
- If ordered: show `ordered_at` timestamp and `ordering_evidence_text`
- If delivered: show `delivered_at` timestamp and `delivery_evidence_text`
- Action buttons:
  - If scheduled: "Place Order" → `/dashboard/admin/events/:id/mark-ordered`
  - If ordered: "Confirm Delivery" → `/dashboard/admin/events/:id/mark-delivered`

Back link: "← Back to Task Queue"

---

### Step 13 — MarkOrderedPage

**New file:** `frontend/src/pages/admin/MarkOrderedPage.tsx`

On mount: fetch the event to show a summary header (recipient name, delivery date).

Form:
- **Ordered At** — datetime-local input, defaulting to current datetime
- **Order Evidence** — textarea, placeholder: "Paste confirmation number, order details, or any relevant notes here."
- Submit button: "Mark as Ordered"
- Cancel link: "← Back to event"

On submit: call `markEventOrdered(id, payload)`. On success: navigate to `/dashboard/admin`. Show error toast on failure.

---

### Step 14 — MarkDeliveredPage

**New file:** `frontend/src/pages/admin/MarkDeliveredPage.tsx`

Same structure as MarkOrderedPage.

Form:
- **Delivered At** — datetime-local input, defaulting to current datetime
- **Delivery Evidence** — textarea, placeholder: "Note any delivery confirmation details."
- Submit button: "Confirm Delivery"

On submit: call `markEventDelivered(id, payload)`. On success: navigate to `/dashboard/admin`.

---

## Stage 2: Notification System

### Step 15 — Notification Model

**New file:** `data_management/models/notification.py`

```python
class Notification(models.Model):
    RECIPIENT_TYPE_CHOICES = (
        ('admin', 'Admin'),
        ('partner', 'Partner'),
        ('customer', 'Customer'),
    )
    CHANNEL_CHOICES = (
        ('email', 'Email'),
        ('sms', 'SMS'),
    )
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('sent', 'Sent'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    )

    recipient_type = models.CharField(max_length=20, choices=RECIPIENT_TYPE_CHOICES)
    # Only one of these will be set, depending on recipient_type:
    recipient_partner = models.ForeignKey('partners.Partner', null=True, blank=True, on_delete=models.SET_NULL, related_name='notifications')
    recipient_user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name='notifications')
    # Admin recipients are resolved from settings at send time — no FK needed.

    channel = models.CharField(max_length=10, choices=CHANNEL_CHOICES)
    subject = models.CharField(max_length=255, null=True, blank=True)  # email only
    body = models.TextField()

    scheduled_for = models.DateField()

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    sent_at = models.DateTimeField(null=True, blank=True)
    error_message = models.TextField(null=True, blank=True)

    # Traceability
    related_event = models.ForeignKey('events.Event', null=True, blank=True, on_delete=models.SET_NULL, related_name='notifications')

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['scheduled_for']
```

**Recipient resolution logic (at send time, not stored):**
- `admin` → `settings.ADMIN_EMAIL` / `settings.ADMIN_NUMBER`
- `partner` → `notification.recipient_partner.user.email` / `notification.recipient_partner.phone`
- `customer` → `notification.recipient_user.email` / (no phone currently)

Register in `data_management/admin.py` with `list_display = ['recipient_type', 'channel', 'status', 'scheduled_for', 'related_event']` and filters for status, channel, recipient_type.

Export from `data_management/models/__init__.py`.

Create and apply migration.

---

### Step 16 — Notification Sender Utility

**New file:** `data_management/utils/notification_sender.py`

```python
def resolve_recipient(notification):
    """Returns (email, phone) tuple. Either may be None depending on recipient_type."""

def send_notification(notification):
    """
    Resolves recipient, sends via Mailgun (email) or Twilio (SMS).
    Updates notification.status, notification.sent_at, notification.error_message.
    Saves the notification record.
    Does NOT raise exceptions — logs failures and marks status='failed'.
    """
```

Implementation notes:
- Reuse the Mailgun `requests.post()` pattern from `users/utils/send_password_reset_email.py` (same Mailgun domain and API key)
- Reuse the Twilio `Client.messages.create()` pattern from `payments/utils/send_admin_payment_notification.py`
- Add `timeout=10` to the Mailgun request (fixes recommendation #6)
- Wrap in try/except; on exception set `status='failed'`, `error_message=str(e)`

---

### Step 17 — Notification Factory Utility

**New file:** `data_management/utils/notification_factory.py`

```python
def create_admin_event_notifications(event):
    """
    Creates 4 pending admin notifications for a newly created event:
    - email at delivery_date - 7 days
    - sms at delivery_date - 7 days
    - email at delivery_date - 3 days
    - sms at delivery_date - 3 days

    Skips creating a notification if the scheduled_for date is in the past.
    Each notification body includes: recipient name, full address, delivery date, budget, flower types.
    """

def cancel_event_notifications(event):
    """
    Called when admin marks an event as 'ordered'.
    Sets status='cancelled' on all pending notifications for this event.
    """

def create_admin_delivery_day_notifications(event):
    """
    Called when admin marks an event as 'ordered'.
    Creates 2 notifications (email + sms) scheduled for event.delivery_date:
    "Delivery day today — please confirm once delivered: [Recipient] at [Address]"
    """
```

Note: `create_admin_event_notifications` is also where you stub in the call from Step 5's `mark_ordered_view` — it was a placeholder in Stage 1 and gets real implementation here.

---

### Step 18 — Wire Notifications into Webhook Handlers

**File:** `payments/utils/webhook_handlers.py`

In `handle_payment_intent_succeeded`, after `Event.objects.bulk_create(events_to_create)` for `UPFRONT_PLAN_NEW`:
```python
from data_management.utils.notification_factory import create_admin_event_notifications
for event in created_events:
    create_admin_event_notifications(event)
```

In `handle_payment_intent_succeeded`, for `SUBSCRIPTION_PLAN_NEW`, after the first Event is created:
```python
create_admin_event_notifications(first_event)
```

In `handle_invoice_payment_succeeded`, after the recurring Event is created:
```python
create_admin_event_notifications(event)
```

Also: **fix and wire `send_admin_payment_notification`** (recommendation #1). Update its message to include useful order information: recipient name, delivery date, budget. Call it from `handle_payment_intent_succeeded` and `handle_invoice_payment_succeeded` for immediate "new order" alerting (this runs outside the cron, fires at webhook time).

---

### Step 19 — Management Command: send_notifications

**New file:** `data_management/management/commands/send_notifications.py`

```python
class Command(BaseCommand):
    help = 'Sends all pending notifications scheduled for today or earlier.'

    def handle(self, *args, **options):
        today = date.today()
        due = Notification.objects.filter(status='pending', scheduled_for__lte=today)
        sent, failed = 0, 0
        for notification in due:
            send_notification(notification)
            if notification.status == 'sent':
                sent += 1
            else:
                failed += 1
        self.stdout.write(f'Done. Sent: {sent}, Failed: {failed}')
```

Set up as a daily cron job on the server. If it misses a day, the next run picks up anything overdue (since `scheduled_for__lte=today` catches everything in the past too).

---

### Step 20 — Clean Up Existing Notification Stubs

**File:** `payments/utils/send_admin_payment_notification.py`

- Update the message to include order context (see Step 18)
- This utility stays as the *immediate* payment notification — it's called directly from webhooks, not via the cron system

**File:** `data_management/management/commands/send_test_email.py`

- Currently imports `events.utils.send_reminder_email` (doesn't exist) and references a `Notification` class (didn't exist until Stage 2)
- After Stage 2, update this command to use the real `Notification` model and `send_notification` utility
- Reference: recommendation #3

**File:** `events/templates/notifications/emails/event_reminder.html`

- Currently uses `{{ event.name }}` and `{{ event.event_date }}` — fields that don't exist
- Update template to use `{{ event.delivery_date }}` and `{{ recipient_name }}` (passed as context)
- Reference: recommendation #5

---

## File Map Summary

| New/Changed File | What |
|---|---|
| `events/models/event.py` | Rename status, add 4 evidence fields |
| `events/migrations/XXXX_...py` | Migration for above |
| `data_management/models/notification.py` | New Notification model |
| `data_management/models/__init__.py` | Export Notification |
| `data_management/serializers/admin_event_serializer.py` | Flat serializer for admin event views |
| `data_management/views/admin_dashboard_view.py` | Three-bucket task queue endpoint |
| `data_management/views/admin_event_detail_view.py` | Single event detail endpoint |
| `data_management/views/admin_mark_ordered_view.py` | Mark event ordered + notification logic |
| `data_management/views/admin_mark_delivered_view.py` | Mark event delivered |
| `data_management/urls.py` | Wire four new admin endpoints |
| `data_management/utils/notification_sender.py` | Resolve recipient + send via Mailgun/Twilio |
| `data_management/utils/notification_factory.py` | Create / cancel admin notifications |
| `data_management/management/commands/send_notifications.py` | Daily cron command |
| `data_management/admin.py` | Register Notification model |
| `payments/utils/webhook_handlers.py` | Wire notification creation into event creation |
| `payments/utils/send_admin_payment_notification.py` | Update message content, wire into handlers |
| `frontend/src/pages/admin/AdminLayout.tsx` | **Delete** |
| `frontend/src/pages/admin/AdminDashboardPage.tsx` | Replaces AdminHomePage — task queue UI |
| `frontend/src/pages/admin/AdminEventDetailPage.tsx` | Full order detail view |
| `frontend/src/pages/admin/MarkOrderedPage.tsx` | Form to mark ordered |
| `frontend/src/pages/admin/MarkDeliveredPage.tsx` | Form to mark delivered |
| `frontend/src/components/AdminGuard.tsx` | Route guard for staff routes |
| `frontend/src/pages/user_dashboard/UserDashboardLayout.tsx` | Add admin sidebar section |
| `frontend/src/App.tsx` | Remove /admin-dashboard, add /dashboard/admin/* routes |
| `frontend/src/api/admin.ts` | API calls for admin endpoints |
| `frontend/src/types/Admin.ts` | TypeScript types |

---

## Build & Test Order

1. Step 1 (Event model + migration) — migrate, verify in Django admin
2. Steps 2–7 (backend API) — test all four endpoints via Postman or curl with a staff user JWT
3. Steps 8–14 (frontend stage 1) — full end-to-end test of task queue: see events, mark ordered, mark delivered
4. Step 15 (Notification model + migration)
5. Steps 16–17 (utilities) — unit test `create_admin_event_notifications`, `cancel_event_notifications`
6. Step 18 (wire into webhooks) — test via Stripe CLI event replay
7. Step 19 (management command) — run manually, verify notifications are sent
8. Step 20 (clean up stubs)
