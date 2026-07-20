from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.event_view import EventViewSet
from .views.order_view import OrderViewSet
from .views.guest_checkout_view import GuestCheckoutView

router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'', EventViewSet, basename='event')

urlpatterns = [
    path('guest-checkout/<str:action>/', GuestCheckoutView.as_view(), name='guest-checkout'),
    path('', include(router.urls)),
]
