from django.urls import path
from .views.stripe_webhook import StripeWebhookView

app_name = 'payments'

urlpatterns = [
    path('webhook/', StripeWebhookView.as_view(), name='stripe-webhook'),
]
