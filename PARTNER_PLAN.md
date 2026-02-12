# Partner Infrastructure — 3-Phase Plan

(Full plan saved for reference - see conversation for details)

## Phase 1: Discount Codes & Non-Delivery Partners
## Phase 2: Delivery Partners
## Phase 3: Payouts via Stripe Connect
╭──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ Plan to implement                                                                                                                                │
│                                                                                                                                                  │
│ Partner Infrastructure — 3-Phase Plan                                                                                                            │
│                                                                                                                                                  │
│ Context                                                                                                                                          │
│                                                                                                                                                  │
│ FutureFlower needs partner infrastructure to support two partner types: non-delivery partners (influencers/florists who refer customers via     │
│ discount codes) and delivery partners (florists who fulfill orders). This is broken into 3 phases: (1) discount codes + non-delivery partners,   │
│ (2) delivery partners, (3) automated payouts via Stripe Connect.                                                                                 │
│                                                                                                                                                  │
│ Partners self-register. Commissions are tracked but paid manually until Phase 3. "New customer" = no previous succeeded payments (simple check). │
│                                                                                                                                                  │
│ ---                                                                                                                                              │
│ Phase 1: Discount Codes & Non-Delivery Partners                                                                                                  │
│                                                                                                                                                  │
│ New App: partners/                                                                                                                               │
│                                                                                                                                                  │
│ Create a new Django app with this structure:                                                                                                     │
│ partners/                                                                                                                                        │
│   __init__.py                                                                                                                                    │
│   apps.py                                                                                                                                        │
│   admin.py                                                                                                                                       │
│   urls.py                                                                                                                                        │
│   models/                                                                                                                                        │
│     __init__.py                                                                                                                                  │
│     partner.py                                                                                                                                   │
│     discount_code.py                                                                                                                             │
│     discount_usage.py                                                                                                                            │
│     commission.py                                                                                                                                │
│   serializers/                                                                                                                                   │
│     __init__.py                                                                                                                                  │
│     partner_registration_serializer.py                                                                                                           │
│     partner_dashboard_serializer.py                                                                                                              │
│     validate_discount_code_serializer.py                                                                                                         │
│   views/                                                                                                                                         │
│     __init__.py                                                                                                                                  │
│     partner_registration_view.py                                                                                                                 │
│     partner_dashboard_view.py                                                                                                                    │
│     validate_discount_code_view.py                                                                                                               │
│   utils/                                                                                                                                         │
│     __init__.py                                                                                                                                  │
│     commission_utils.py                                                                                                                          │
│   migrations/                                                                                                                                    │
│                                                                                                                                                  │
│ Models                                                                                                                                           │
│                                                                                                                                                  │
│ Partner (partners/models/partner.py)                                                                                                             │
│ - user — OneToOneField → User (CASCADE), related_name=partner_profile                                                                            │
│ - partner_type — CharField: non_delivery | delivery (default non_delivery)                                                                       │
│ - status — CharField: pending | active | suspended (default pending)                                                                             │
│ - business_name — CharField(255, blank)                                                                                                          │
│ - phone — CharField(30, blank)                                                                                                                   │
│ - created_at, updated_at                                                                                                                         │
│                                                                                                                                                  │
│ DiscountCode (partners/models/discount_code.py)                                                                                                  │
│ - partner — OneToOneField → Partner (CASCADE), related_name=discount_code                                                                        │
│ - code — CharField(30, unique, db_index) — auto-generated from slugified business name + random suffix                                           │
│ - discount_amount — DecimalField(10,2, default=5.00)                                                                                             │
│ - is_active — BooleanField(default=True)                                                                                                         │
│ - created_at                                                                                                                                     │
│                                                                                                                                                  │
│ DiscountUsage (partners/models/discount_usage.py)                                                                                                │
│ - discount_code — FK → DiscountCode (CASCADE)                                                                                                    │
│ - user — FK → User (CASCADE)                                                                                                                     │
│ - payment — OneToOneField → Payment (CASCADE)                                                                                                    │
│ - discount_applied — DecimalField(10,2)                                                                                                          │
│ - created_at                                                                                                                                     │
│                                                                                                                                                  │
│ Commission (partners/models/commission.py)                                                                                                       │
│ - partner — FK → Partner (CASCADE)                                                                                                               │
│ - payment — FK → Payment (CASCADE, null)                                                                                                         │
│ - event — FK → Event (SET_NULL, null)                                                                                                            │
│ - commission_type — CharField: referral | fulfillment                                                                                            │
│ - amount — DecimalField(10,2)                                                                                                                    │
│ - status — CharField: pending | approved | paid                                                                                                  │
│ - note — TextField(blank)                                                                                                                        │
│ - created_at, updated_at                                                                                                                         │
│                                                                                                                                                  │
│ User Model Change                                                                                                                                │
│                                                                                                                                                  │
│ users/models/user.py — Add:                                                                                                                      │
│ referred_by_partner = models.ForeignKey(                                                                                                         │
│     'partners.Partner', on_delete=models.SET_NULL,                                                                                               │
│     null=True, blank=True, related_name='referred_users'                                                                                         │
│ )                                                                                                                                                │
│ Set once when a user first applies a valid discount code. Never changed after.                                                                   │
│                                                                                                                                                  │
│ API Endpoints                                                                                                                                    │
│ ┌────────┬───────────────────────────────────────┬───────────────────────────┬───────────────────────────────────────────────────────────┐       │
│ │ Method │                 Path                  │           Auth            │                          Purpose                          │       │
│ ├────────┼───────────────────────────────────────┼───────────────────────────┼───────────────────────────────────────────────────────────┤       │
│ │ POST   │ /api/partners/register/               │ AllowAny                  │ Create User + Partner + DiscountCode, return JWT tokens   │       │
│ ├────────┼───────────────────────────────────────┼───────────────────────────┼───────────────────────────────────────────────────────────┤       │
│ │ GET    │ /api/partners/dashboard/              │ IsAuthenticated (partner) │ Partner profile, code stats, commissions summary          │       │
│ ├────────┼───────────────────────────────────────┼───────────────────────────┼───────────────────────────────────────────────────────────┤       │
│ │ POST   │ /api/partners/validate-discount-code/ │ IsAuthenticated           │ Validate code, return discount amount or rejection reason │       │
│ └────────┴───────────────────────────────────────┴───────────────────────────┴───────────────────────────────────────────────────────────┘       │
│ Registration accepts: email, password, first_name, last_name, business_name, phone, partner_type. Creates User (same pattern as                  │
│ RegisterSerializer), Partner, and auto-generated DiscountCode. Returns JWT tokens so partner is logged in immediately.                           │
│                                                                                                                                                  │
│ Validation rules for discount codes:                                                                                                             │
│ - Code exists and is_active=True                                                                                                                 │
│ - Partner status is active                                                                                                                       │
│ - User has zero succeeded payments (Payment.objects.filter(user=request.user, status='succeeded').exists() returns False)                        │
│ - User is not the partner's own user                                                                                                             │
│                                                                                                                                                  │
│ Payment Flow Changes                                                                                                                             │
│                                                                                                                                                  │
│ payments/views/create_payment_intent.py — Accept optional discount_code in details:                                                              │
│ 1. If provided, validate (same rules as validate endpoint)                                                                                       │
│ 2. Subtract discount_amount from amount_in_cents (floor at 50 cents for Stripe minimum)                                                          │
│ 3. Store discount_code in PaymentIntent metadata                                                                                                 │
│ 4. Set user.referred_by_partner = discount_code.partner if not already set                                                                       │
│                                                                                                                                                  │
│ payments/utils/webhook_handlers.py — In handle_payment_intent_succeeded, after payment status update:                                            │
│ 1. If PaymentIntent metadata has discount_code, create DiscountUsage record                                                                      │
│ 2. Call process_referral_commission(payment) from partners/utils/commission_utils.py                                                             │
│                                                                                                                                                  │
│ partners/utils/commission_utils.py — process_referral_commission(payment):                                                                       │
│ def process_referral_commission(payment):                                                                                                        │
│     partner = payment.user.referred_by_partner                                                                                                   │
│     if not partner:                                                                                                                              │
│         return                                                                                                                                   │
│     succeeded_count = Payment.objects.filter(user=payment.user, status='succeeded').count()                                                      │
│     if succeeded_count > 3:                                                                                                                      │
│         return                                                                                                                                   │
│     budget = payment.order.budget                                                                                                                │
│     if not budget:                                                                                                                               │
│         return                                                                                                                                   │
│     Commission.objects.create(                                                                                                                   │
│         partner=partner, payment=payment,                                                                                                        │
│         commission_type='referral',                                                                                                              │
│         amount=budget * Decimal('0.05'),                                                                                                         │
│         status='pending'                                                                                                                         │
│     )                                                                                                                                            │
│                                                                                                                                                  │
│ Also hook into handle_invoice_payment_succeeded for subscription payments — same commission logic applies.                                       │
│                                                                                                                                                  │
│ Frontend Changes                                                                                                                                 │
│                                                                                                                                                  │
│ New files:                                                                                                                                       │
│ ┌────────────────────────────────────────────────────────┬────────────────────────────────────────────────────────────┐                          │
│ │                          File                          │                          Purpose                           │                          │
│ ├────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────┤                          │
│ │ frontend/src/pages/partner/PartnerRegistrationPage.tsx │ Public registration form                                   │                          │
│ ├────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────┤                          │
│ │ frontend/src/pages/partner/PartnerDashboardPage.tsx    │ Code stats, commissions earned                             │                          │
│ ├────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────┤                          │
│ │ frontend/src/api/partners.ts                           │ registerPartner, getPartnerDashboard, validateDiscountCode │                          │
│ ├────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────┤                          │
│ │ frontend/src/types/Partner.ts                          │ Partner, DiscountCode, Commission types                    │                          │
│ ├────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────┤                          │
│ │ frontend/src/components/DiscountCodeInput.tsx          │ Input + "Apply" button with validation feedback            │                          │
│ └────────────────────────────────────────────────────────┴────────────────────────────────────────────────────────────┘                          │
│ Modified files:                                                                                                                                  │
│ ┌───────────────────────────────────────────────────────────────────────────────┬───────────────────────────────────────────────────────┐        │
│ │                                     File                                      │                        Change                         │        │
│ ├───────────────────────────────────────────────────────────────────────────────┼───────────────────────────────────────────────────────┤        │
│ │ frontend/src/App.tsx                                                          │ Add /partner/register, /partner/dashboard routes      │        │
│ ├───────────────────────────────────────────────────────────────────────────────┼───────────────────────────────────────────────────────┤        │
│ │ frontend/src/components/PaymentInitiatorButton.tsx                            │ Accept optional discountCode prop, include in details │        │
│ ├───────────────────────────────────────────────────────────────────────────────┼───────────────────────────────────────────────────────┤        │
│ │ Confirmation pages (upfront Step6, subscription Step5, single delivery Step5) │ Add DiscountCodeInput above payment button            │        │
│ ├───────────────────────────────────────────────────────────────────────────────┼───────────────────────────────────────────────────────┤        │
│ │ frontend/src/pages/FloristsPage.tsx                                           │ Add CTA linking to /partner/register                  │        │
│ └───────────────────────────────────────────────────────────────────────────────┴───────────────────────────────────────────────────────┘        │
│ DiscountCodeInput behavior: text input + "Apply" button → calls validateDiscountCode(code) → shows green success with partner name + discount    │
│ amount, or red error → lifts validated code to parent via callback → parent passes to PaymentInitiatorButton.                                    │
│                                                                                                                                                  │
│ Settings                                                                                                                                         │
│                                                                                                                                                  │
│ - Add "partners" to INSTALLED_APPS                                                                                                               │
│ - Add path("api/partners/", include("partners.urls")) to futureflower/urls.py                                                                   │
│                                                                                                                                                  │
│ Verification                                                                                                                                     │
│                                                                                                                                                  │
│ 1. Register partner → confirm User, Partner, DiscountCode created                                                                                │
│ 2. Validate code from new user → valid; from user with existing payments → rejected                                                              │
│ 3. Create PaymentIntent with discount code → confirm reduced amount                                                                              │
│ 4. Complete payment → confirm DiscountUsage + Commission created                                                                                 │
│ 5. 4th payment for same user → confirm NO commission created                                                                                     │
│ 6. Partner dashboard shows correct stats                                                                                                         │
│                                                                                                                                                  │
│ ---                                                                                                                                              │
│ Phase 2: Delivery Partners                                                                                                                       │
│                                                                                                                                                  │
│ Model Changes                                                                                                                                    │
│                                                                                                                                                  │
│ Partner — Add fields:                                                                                                                            │
│ - booking_slug — SlugField(100, unique, null, blank) — e.g. rosesandthorns                                                                       │
│ - street_address, suburb, city, state, postcode, country — address fields                                                                        │
│                                                                                                                                                  │
│ ServiceArea (partners/models/service_area.py) — New:                                                                                             │
│ - partner — FK → Partner (CASCADE)                                                                                                               │
│ - suburb — CharField(100)                                                                                                                        │
│ - city — CharField(100)                                                                                                                          │
│ - state — CharField(100, blank)                                                                                                                  │
│ - postcode — CharField(20, blank)                                                                                                                │
│ - country — CharField(100)                                                                                                                       │
│ - is_active — BooleanField(default=True)                                                                                                         │
│ - unique_together: (partner, suburb, city, country)                                                                                              │
│                                                                                                                                                  │
│ DeliveryRequest (partners/models/delivery_request.py) — New:                                                                                     │
│ - event — FK → Event (CASCADE)                                                                                                                   │
│ - partner — FK → Partner (CASCADE)                                                                                                               │
│ - status — CharField: pending | accepted | declined | expired                                                                                    │
│ - token — CharField(64, unique, db_index) — secrets.token_urlsafe(32)                                                                            │
│ - first_notified_at, second_notified_at, responded_at — DateTimeFields (null)                                                                    │
│ - expires_at — DateTimeField (delivery_date - 48 hours)                                                                                          │
│ - created_at, updated_at                                                                                                                         │
│                                                                                                                                                  │
│ User model — Add:                                                                                                                                │
│ source_partner = models.ForeignKey(                                                                                                              │
│     'partners.Partner', on_delete=models.SET_NULL,                                                                                               │
│     null=True, blank=True, related_name='sourced_users'                                                                                          │
│ )                                                                                                                                                │
│ Set when user registers after visiting via ?delivery_partner=<slug>.                                                                             │
│                                                                                                                                                  │
│ API Endpoints                                                                                                                                    │
│ Method: POST                                                                                                                                     │
│ Path: /api/partners/register/                                                                                                                    │
│ Auth: AllowAny                                                                                                                                   │
│ Purpose: Extended — delivery partners include address, slug, service_areas                                                                       │
│ ────────────────────────────────────────                                                                                                         │
│ Method: GET                                                                                                                                      │
│ Path: /api/partners/resolve-slug/<slug>/                                                                                                         │
│ Auth: AllowAny                                                                                                                                   │
│ Purpose: Returns partner_id + business_name for a booking slug                                                                                   │
│ ────────────────────────────────────────                                                                                                         │
│ Method: GET                                                                                                                                      │
│ Path: /api/partners/delivery-requests/<token>/details/                                                                                           │
│ Auth: AllowAny                                                                                                                                   │
│ Purpose: View order details (no login — token-based)                                                                                             │
│ ────────────────────────────────────────                                                                                                         │
│ Method: POST                                                                                                                                     │
│ Path: /api/partners/delivery-requests/<token>/respond/                                                                                           │
│ Auth: AllowAny                                                                                                                                   │
│ Purpose: Accept or decline (no login — token-based)                                                                                              │
│ ────────────────────────────────────────                                                                                                         │
│ Method: GET                                                                                                                                      │
│ Path: /api/partners/delivery-requests/                                                                                                           │
│ Auth: IsAuthenticated (partner)                                                                                                                  │
│ Purpose: List delivery requests for logged-in partner                                                                                            │
│ Accept/decline logic:                                                                                                                            │
│ - Accept: set status=accepted, event stays scheduled                                                                                             │
│ - Decline: set status=declined, if user.source_partner == this partner → create 5% commission, trigger reassignment                              │
│                                                                                                                                                  │
│ Delivery partner registration — Same endpoint, extended: when partner_type=delivery, require booking_slug, address fields, and service_areas[]   │
│ array. No DiscountCode generated for delivery partners.                                                                                          │
│                                                                                                                                                  │
│ User Registration Change                                                                                                                         │
│                                                                                                                                                  │
│ users/serializers/register_serializer.py — Accept optional source_partner_id. If valid delivery partner, set user.source_partner.                │
│                                                                                                                                                  │
│ Notification System                                                                                                                              │
│                                                                                                                                                  │
│ Management command: partners/management/commands/process_delivery_notifications.py — Daily cron job:                                             │
│                                                                                                                                                  │
│ 1. 14 days before delivery: Find Events with no DeliveryRequest yet → determine partner (user's source_partner if covers area, else geographic   │
│ match) → create DeliveryRequest with token → send email with accept/decline link → set first_notified_at                                         │
│ 2. 7 days before: Find pending DeliveryRequests with only first notification → send second email → set second_notified_at                        │
│ 3. Expired: Find pending DeliveryRequests past expires_at → set status=expired → trigger reassignment                                            │
│                                                                                                                                                  │
│ Reassignment (partners/utils/reassignment.py): Find another active delivery partner whose service areas cover the recipient's                    │
│ suburb+city+country, excluding already-tried partners. Create new DeliveryRequest, send notification immediately. If no partner available, flag  │
│ for admin.                                                                                                                                       │
│                                                                                                                                                  │
│ Notification links: {SITE_URL}/partner/delivery-request/{token} — frontend page showing order details + accept/decline buttons, calls            │
│ token-based API.                                                                                                                                 │
│                                                                                                                                                  │
│ Frontend Changes                                                                                                                                 │
│                                                                                                                                                  │
│ New files:                                                                                                                                       │
│ ┌───────────────────────────────────────────────────────┬──────────────────────────────────────────────────────────────────────────────────┐     │
│ │                         File                          │                                     Purpose                                      │     │
│ ├───────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────┤     │
│ │ frontend/src/pages/partner/DeliveryRequestPage.tsx    │ Public page at /partner/delivery-request/:token — order details + accept/decline │     │
│ ├───────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────┤     │
│ │ frontend/src/components/ServiceAreaInput.tsx          │ Multi-entry input for service areas                                              │     │
│ ├───────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────┤     │
│ │ frontend/src/types/DeliveryRequest.ts, ServiceArea.ts │ Type definitions                                                                 │     │
│ └───────────────────────────────────────────────────────┴──────────────────────────────────────────────────────────────────────────────────┘     │
│ Modified files:                                                                                                                                  │
│ ┌────────────────────────────────────────────────────────┬────────────────────────────────────────────────────────────────────────────────┐      │
│ │                          File                          │                                     Change                                     │      │
│ ├────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────┤      │
│ │ frontend/src/App.tsx                                   │ Add delivery request route                                                     │      │
│ ├────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────┤      │
│ │ frontend/src/api/partners.ts                           │ Add resolvePartnerSlug, getDeliveryRequestByToken, respondToDeliveryRequest    │      │
│ ├────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────┤      │
│ │ Landing page / root layout                             │ Check URL for ?delivery_partner=<slug>, resolve via API, store in localStorage │      │
│ ├────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────┤      │
│ │ frontend/src/pages/Step1CreateAccountPage.tsx          │ Read source_partner_id from localStorage, pass to registration                 │      │
│ ├────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────┤      │
│ │ frontend/src/api/auth.ts                               │ Pass optional source_partner_id in registration call                           │      │
│ ├────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────┤      │
│ │ frontend/src/pages/partner/PartnerRegistrationPage.tsx │ Conditional sections for delivery partner (address, slug, service areas)       │      │
│ ├────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────┤      │
│ │ frontend/src/pages/partner/PartnerDashboardPage.tsx    │ Add delivery requests tab                                                      │      │
│ └────────────────────────────────────────────────────────┴────────────────────────────────────────────────────────────────────────────────┘      │
│ Verification                                                                                                                                     │
│                                                                                                                                                  │
│ 1. Register delivery partner with service areas → confirm Partner, ServiceAreas created, no DiscountCode                                         │
│ 2. Visit ?delivery_partner=slug → confirm localStorage set                                                                                       │
│ 3. Register user with source partner → confirm user.source_partner set                                                                           │
│ 4. Run process_delivery_notifications with event 14 days out → confirm DeliveryRequest created, email sent                                       │
│ 5. Accept via token → confirm status=accepted                                                                                                    │
│ 6. Decline via token → confirm reassignment triggered, commission created for sourced users                                                      │
│ 7. Let request expire → confirm auto-decline + reassignment                                                                                      │
│                                                                                                                                                  │
│ ---                                                                                                                                              │
│ Phase 3: Payouts via Stripe Connect                                                                                                              │
│                                                                                                                                                  │
│ Model Changes                                                                                                                                    │
│                                                                                                                                                  │
│ Partner — Add:                                                                                                                                   │
│ - stripe_connect_account_id — CharField(255, null, blank)                                                                                        │
│ - stripe_connect_onboarding_complete — BooleanField(default=False)                                                                               │
│                                                                                                                                                  │
│ Payout (partners/models/payout.py) — New:                                                                                                        │
│ - partner — FK → Partner (CASCADE)                                                                                                               │
│ - payout_type — CharField: fulfillment | commission                                                                                              │
│ - amount — DecimalField(10,2)                                                                                                                    │
│ - currency — CharField(3, default='USD')                                                                                                         │
│ - stripe_transfer_id — CharField(255, null, unique)                                                                                              │
│ - status — CharField: pending | processing | completed | failed                                                                                  │
│ - period_start, period_end — DateFields                                                                                                          │
│ - note — TextField(blank)                                                                                                                        │
│ - created_at, updated_at                                                                                                                         │
│                                                                                                                                                  │
│ PayoutLineItem (partners/models/payout_line_item.py) — New:                                                                                      │
│ - payout — FK → Payout (CASCADE)                                                                                                                 │
│ - commission — OneToOneField → Commission (null) — prevents double-paying                                                                        │
│ - delivery_request — OneToOneField → DeliveryRequest (null) — prevents double-paying                                                             │
│ - amount — DecimalField(10,2)                                                                                                                    │
│ - description — CharField(255)                                                                                                                   │
│ - created_at                                                                                                                                     │
│                                                                                                                                                  │
│ API Endpoints                                                                                                                                    │
│ Method: POST                                                                                                                                     │
│ Path: /api/partners/stripe-connect/onboard/                                                                                                      │
│ Auth: IsAuthenticated (partner)                                                                                                                  │
│ Purpose: Create Stripe Express account, return onboarding URL                                                                                    │
│ ────────────────────────────────────────                                                                                                         │
│ Method: GET                                                                                                                                      │
│ Path: /api/partners/stripe-connect/status/                                                                                                       │
│ Auth: IsAuthenticated (partner)                                                                                                                  │
│ Purpose: Check onboarding completion                                                                                                             │
│ ────────────────────────────────────────                                                                                                         │
│ Method: GET                                                                                                                                      │
│ Path: /api/partners/payouts/                                                                                                                     │
│ Auth: IsAuthenticated (partner)                                                                                                                  │
│ Purpose: List payouts                                                                                                                            │
│ ────────────────────────────────────────                                                                                                         │
│ Method: GET                                                                                                                                      │
│ Path: /api/partners/payouts/<id>/                                                                                                                │
│ Auth: IsAuthenticated (partner)                                                                                                                  │
│ Purpose: Payout detail with line items                                                                                                           │
│ ────────────────────────────────────────                                                                                                         │
│ Method: POST                                                                                                                                     │
│ Path: /api/partners/delivery-requests/<token>/mark-delivered/                                                                                    │
│ Auth: AllowAny                                                                                                                                   │
│ Purpose: Partner marks delivery complete                                                                                                         │
│ Stripe Connect Onboarding Flow                                                                                                                   │
│                                                                                                                                                  │
│ 1. Partner clicks "Set up payouts" in dashboard                                                                                                  │
│ 2. Backend creates Stripe Express account → stripe.Account.create(type='express', ...)                                                           │
│ 3. Creates account link → stripe.AccountLink.create(...) with return/refresh URLs                                                                │
│ 4. Returns onboarding URL, frontend redirects                                                                                                    │
│ 5. On return, check charges_enabled + payouts_enabled → set stripe_connect_onboarding_complete=True                                              │
│                                                                                                                                                  │
│ Payout Processing                                                                                                                                │
│                                                                                                                                                  │
│ Management command: partners/management/commands/process_payouts.py                                                                              │
│                                                                                                                                                  │
│ Weekly fulfillment payouts (--type=fulfillment):                                                                                                 │
│ - For each delivery partner with completed Stripe Connect onboarding                                                                             │
│ - Find accepted DeliveryRequests where event.status=delivered and no PayoutLineItem exists                                                       │
│ - Sum budget amounts, create Payout + PayoutLineItems                                                                                            │
│ - Execute stripe.Transfer.create(amount, destination=partner.stripe_connect_account_id)                                                          │
│ - On success: status=completed. On failure: status=failed, don't mark commissions as paid                                                        │
│                                                                                                                                                  │
│ Monthly commission payouts (--type=commission):                                                                                                  │
│ - For each partner with completed onboarding                                                                                                     │
│ - Find Commissions with status=approved and no PayoutLineItem                                                                                    │
│ - Sum amounts, create Payout + PayoutLineItems                                                                                                   │
│ - Execute Stripe Transfer                                                                                                                        │
│ - Update Commission status to paid                                                                                                               │
│                                                                                                                                                  │
│ Commission approval workflow: Commissions created as pending → admin reviews and sets approved → only approved commissions included in payouts.  │
│                                                                                                                                                  │
│ Frontend Changes                                                                                                                                 │
│                                                                                                                                                  │
│ New files:                                                                                                                                       │
│ ┌────────────────────────────────────────────────────────────┬────────────────────────┐                                                          │
│ │                            File                            │        Purpose         │                                                          │
│ ├────────────────────────────────────────────────────────────┼────────────────────────┤                                                          │
│ │ frontend/src/pages/partner/StripeConnectOnboardingPage.tsx │ Initiate onboarding    │                                                          │
│ ├────────────────────────────────────────────────────────────┼────────────────────────┤                                                          │
│ │ frontend/src/pages/partner/StripeConnectReturnPage.tsx     │ Post-redirect landing  │                                                          │
│ ├────────────────────────────────────────────────────────────┼────────────────────────┤                                                          │
│ │ frontend/src/pages/partner/PayoutsPage.tsx                 │ Payout history         │                                                          │
│ ├────────────────────────────────────────────────────────────┼────────────────────────┤                                                          │
│ │ frontend/src/pages/partner/PayoutDetailPage.tsx            │ Payout with line items │                                                          │
│ ├────────────────────────────────────────────────────────────┼────────────────────────┤                                                          │
│ │ frontend/src/components/StripeConnectBanner.tsx            │ Banner prompting setup │                                                          │
│ ├────────────────────────────────────────────────────────────┼────────────────────────┤                                                          │
│ │ frontend/src/types/Payout.ts, PayoutLineItem.ts            │ Type definitions       │                                                          │
│ └────────────────────────────────────────────────────────────┴────────────────────────┘                                                          │
│ Modified files:                                                                                                                                  │
│ ┌─────────────────────────────────────────────────────┬───────────────────────────────────────────────┐                                          │
│ │                        File                         │                    Change                     │                                          │
│ ├─────────────────────────────────────────────────────┼───────────────────────────────────────────────┤                                          │
│ │ frontend/src/App.tsx                                │ Add Stripe Connect + payout routes            │                                          │
│ ├─────────────────────────────────────────────────────┼───────────────────────────────────────────────┤                                          │
│ │ frontend/src/api/partners.ts                        │ Add onboarding, status, payouts API functions │                                          │
│ ├─────────────────────────────────────────────────────┼───────────────────────────────────────────────┤                                          │
│ │ frontend/src/pages/partner/PartnerDashboardPage.tsx │ Add payout summary + Stripe Connect banner    │                                          │
│ └─────────────────────────────────────────────────────┴───────────────────────────────────────────────┘                                          │
│ Verification                                                                                                                                     │
│                                                                                                                                                  │
│ 1. Initiate Stripe Connect onboarding → confirm redirect, account created                                                                        │
│ 2. Complete onboarding (test mode) → confirm stripe_connect_onboarding_complete=True                                                             │
│ 3. Approve commission via admin → status changes to approved                                                                                     │
│ 4. Run process_payouts --type=commission → Payout created, Transfer executed, Commission→paid                                                    │
│ 5. Mark delivery as delivered → event status=delivered                                                                                           │
│ 6. Run process_payouts --type=fulfillment → Payout with correct budget amount                                                                    │
│ 7. Simulate failed transfer → Payout marked failed, commissions NOT marked paid                                                                  │
│                                                                                                                                                  │
│ ---                                                                                                                                              │
│ Critical Existing Files                                                                                                                          │
│ ┌────────────────────────────────────────────────────┬─────────────────────────────────────────────────────────┐                                 │
│ │                        File                        │                        Relevance                        │                                 │
│ ├────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────┤                                 │
│ │ payments/views/create_payment_intent.py            │ Phase 1: add discount code acceptance                   │                                 │
│ ├────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────┤                                 │
│ │ payments/utils/webhook_handlers.py                 │ Phase 1: add commission + discount usage creation       │                                 │
│ ├────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────┤                                 │
│ │ users/models/user.py                               │ Phase 1+2: add referred_by_partner + source_partner FKs │                                 │
│ ├────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────┤                                 │
│ │ users/serializers/register_serializer.py           │ Phase 2: accept source_partner_id                       │                                 │
│ ├────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────┤                                 │
│ │ frontend/src/components/PaymentInitiatorButton.tsx │ Phase 1: accept discountCode prop                       │                                 │
│ ├────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────┤                                 │
│ │ futureflower/settings.py                          │ Phase 1: add partners to INSTALLED_APPS                 │                                 │
│ ├────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────┤                                 │
│ │ futureflower/urls.py                              │ Phase 1: add partners URL include                       │                                 │
│ └────────────────────────────────────────────────────┴─────────────────────────────────────────────────────────┘      