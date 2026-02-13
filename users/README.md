# Users App

## Purpose

The `users` app handles user identity, authentication, profile management, and GDPR-compliant account deletion (anonymization).

## Model

### User (extends AbstractUser)
Custom user model with additional fields for:
- **Password reset throttling:** `password_reset_last_sent_at`
- **Legal compliance:** `agreed_to_terms` (FK to TermsAndConditions)
- **Stripe integration:** `stripe_customer_id`
- **Partner tracking:** `referred_by_partner` (FK to Partner), `source_partner` (FK to Partner)
- **Anonymization:** `anonymized_at`, `hash_first_name`, `hash_last_name`, `hash_email` (indexed)

## Key Flows

### Registration
1. User submits email, password, first_name, last_name, and optional `source_partner_id` to `POST /api/users/register/`
2. Account created with email as username
3. JWT tokens (access + refresh) returned immediately
4. No email verification currently required

### Password Reset
1. `POST /api/users/password-reset/request/` - Sends reset email via Mailgun (rate limited to 1 per 60 seconds per user)
2. Always returns 200 regardless of whether email exists (prevents user enumeration)
3. Checks BlockedEmail list before sending
4. `POST /api/users/password-reset/confirm/<uidb64>/<token>/` - Sets new password (token valid for 1 hour)

### Account Deletion (Anonymization)
Orchestrated by `utils/anonymize_user.py`:
1. Deletes pending UpfrontPlans; anonymizes active plans (hashes recipient PII, deletes undelivered events)
2. Hashes user PII (first_name, last_name, email) using HMAC-SHA256 with system salt
3. Wipes original PII fields
4. Replaces email/username with `deleted_{pk}@deleted.com` / `deleted_user_{pk}`
5. Sets `is_active = False`, records `anonymized_at` timestamp

## API Endpoints

All under `/api/users/`:

- `POST /register/` - Create account (public)
- `GET/PATCH /me/` - View/update profile (authenticated)
- `DELETE /delete/` - Anonymize and deactivate account (authenticated)
- `PUT /change-password/` - Change password (authenticated)
- `POST /password-reset/request/` - Request reset email (public)
- `POST /password-reset/confirm/<uidb64>/<token>/` - Confirm reset (public)

## Utilities

- `hash_value(value, salt)` - HMAC-SHA256 hashing for PII anonymization
- `anonymize_user(user)` - Full 5-step anonymization workflow
- `send_password_reset_email(user)` - Mailgun API email with signed unsubscribe link

## Templates

- `users/emails/password_reset_email.html` - HTML password reset email
- `users/emails/password_reset_email.txt` - Plain text fallback
