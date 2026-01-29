from django.urls import path
from .views.create_payment_intent import CreatePaymentIntentView
from .views.create_subscription_view import CreateSubscriptionView
from .views.stripe_webhook import StripeWebhookView

app_name = 'payments'

urlpatterns = [
    path('create-payment-intent/', CreatePaymentIntentView.as_view(), name='create-payment-intent'),
    path('create-subscription/', CreateSubscriptionView.as_view(), name='create-subscription'),
    path('webhook/', StripeWebhookView.as_view(), name='stripe-webhook'),
]
