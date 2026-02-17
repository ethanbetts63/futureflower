from django.urls import path
from partners.views import (
    PartnerRegistrationView,
    PartnerDashboardView,
    PartnerUpdateView,
    ValidateDiscountCodeView,
    DeliveryRequestDetailView,
    DeliveryRequestRespondView,
    DeliveryRequestListView,
    DeliveryRequestMarkDeliveredView,
    StripeConnectOnboardView,
    StripeConnectStatusView,
    PayoutListView,
    PayoutDetailView,
)

urlpatterns = [
    # Phase 1
    path('register/', PartnerRegistrationView.as_view(), name='partner-register'),
    path('dashboard/', PartnerDashboardView.as_view(), name='partner-dashboard'),
    path('update/', PartnerUpdateView.as_view(), name='partner-update'),
    path('validate-discount-code/', ValidateDiscountCodeView.as_view(), name='validate-discount-code'),

    # Phase 2
    path('delivery-requests/', DeliveryRequestListView.as_view(), name='delivery-request-list'),
    path('delivery-requests/<str:token>/details/', DeliveryRequestDetailView.as_view(), name='delivery-request-detail'),
    path('delivery-requests/<str:token>/respond/', DeliveryRequestRespondView.as_view(), name='delivery-request-respond'),
    path('delivery-requests/<str:token>/mark-delivered/', DeliveryRequestMarkDeliveredView.as_view(), name='delivery-request-mark-delivered'),

    # Phase 3
    path('stripe-connect/onboard/', StripeConnectOnboardView.as_view(), name='stripe-connect-onboard'),
    path('stripe-connect/status/', StripeConnectStatusView.as_view(), name='stripe-connect-status'),
    path('payouts/', PayoutListView.as_view(), name='payout-list'),
    path('payouts/<int:payout_id>/', PayoutDetailView.as_view(), name='payout-detail'),
]
