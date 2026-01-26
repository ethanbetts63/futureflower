from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.event_view import EventViewSet
from .views.pricing_view import calculate_upfront_price
from .views.color_view import ColorViewSet
from .views.flower_type_view import FlowerTypeViewSet
from .views.flower_plan_view import FlowerPlanViewSet, get_latest_inactive_flower_plan, calculate_plan_modification
from .views.get_or_create_inactive_plan_view import GetOrCreateInactivePlanView

router = DefaultRouter()
router.register(r'colors', ColorViewSet, basename='color')
router.register(r'flower-types', FlowerTypeViewSet, basename='flower-type')
router.register(r'flower-plans', FlowerPlanViewSet, basename='flower-plan')
# This must be last, as its empty prefix will catch anything not matched above.
router.register(r'', EventViewSet, basename='event')

urlpatterns = [
    path('calculate-price/', calculate_upfront_price, name='calculate-price'),
    path('flower-plans/get-latest-inactive/', get_latest_inactive_flower_plan, name='get-latest-inactive-flower-plan'),
    path('flower-plans/get-or-create-inactive/', GetOrCreateInactivePlanView.as_view(), name='get-or-create-inactive-plan'),
    path('flower-plans/<int:plan_id>/calculate-modification/', calculate_plan_modification, name='calculate-plan-modification'),
    path('', include(router.urls)),
]