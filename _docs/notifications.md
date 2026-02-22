# Notifications — SMS & Email Audit

## All Notification Triggers

| # | Who | Channel | Trigger | Timing | Method |
|---|-----|---------|---------|--------|--------|
| 1 | Admin | Email + SMS | Payment received | Immediate | Direct API |
| 2 | Customer | Email | Payment received | Immediate | Direct API |
| 3 | Admin | Email + SMS | Plan cancelled (if events already ordered) | Immediate | Direct API |
| 4 | Admin | Email | Event created at payment | T-7 days (queued) | Cron |
| 5 | Admin | SMS | Event created at payment | T-7 days (queued) | Cron |
| 6 | Admin | Email | Event created at payment | T-3 days (queued) | Cron |
| 7 | Admin | SMS | Event created at payment | T-3 days (queued) | Cron |
| 8 | Customer | Email | Event created at payment | Delivery day (queued) | Cron |
| 9 | Admin | Email | Admin marks event as ordered | Delivery day (queued) | Cron |
| 10 | Admin | SMS | Admin marks event as ordered | Delivery day (queued) | Cron |
| 11 | Customer | Email | Forgot password request | Immediate | Direct API |
| 12 | Admin | Email | Forgot password request | Immediate | Direct API |
| 13 | Partner | Email | Forgot password request | Immediate | Direct API |

## Notes

- Recurring subscription renewals send admin a payment alert (#1) but do **not** send the customer an order confirmation (#2).
- The T-7/T-3 admin reminders (#4–7) are cancelled and replaced by the delivery-day set (#9–10) when admin marks the order as placed with the florist.
- Partners have no live SMS/email yet — partner delivery request code is stubbed out with TODOs.
- Forgot password (#11–13) is not yet implemented — listed here as a requirement.
