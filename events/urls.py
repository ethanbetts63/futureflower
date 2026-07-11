from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.event_view import EventViewSet
from .views.flower_type_view import FlowerTypeViewSet
from .views.order_view import OrderViewSet

router = DefaultRouter()
router.register(r'flower-types', FlowerTypeViewSet, basename='flower-type')
router.register(r'orders', OrderViewSet, basename='order')
# This must be last, as its empty prefix will catch anything not matched above.
router.register(r'', EventViewSet, basename='event')

urlpatterns = [
    path('', include(router.urls)),
]
