from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.event_view import EventViewSet
from .views.pricing_view import calculate_upfront_price
from .views.preference_views import ColorViewSet, FlowerTypeViewSet

router = DefaultRouter()
router.register(r'colors', ColorViewSet, basename='color')
router.register(r'flower-types', FlowerTypeViewSet, basename='flower-type')
router.register(r'events', EventViewSet, basename='event')

urlpatterns = [
    path('calculate-price/', calculate_upfront_price, name='calculate-price'),
    path('', include(router.urls)),
]