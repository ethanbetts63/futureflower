from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.event_view import EventViewSet
from .views.color_view import ColorViewSet
from .views.flower_type_view import FlowerTypeViewSet
from .views.upfront_plan_view import UpfrontPlanViewSet, get_latest_pending_upfront_plan, calc_upfront_price_for_plan
from .views.get_or_create_inactive_plan_view import GetOrCreateInactivePlanView

router = DefaultRouter()
router.register(r'colors', ColorViewSet, basename='color')
router.register(r'flower-types', FlowerTypeViewSet, basename='flower-type')
router.register(r'upfront-plans', UpfrontPlanViewSet, basename='upfront-plan')
# This must be last, as its empty prefix will catch anything not matched above.
router.register(r'', EventViewSet, basename='event')

urlpatterns = [
    path('upfront-plans/get-latest-pending/', get_latest_pending_upfront_plan, name='get-latest-pending-upfront-plan'),
    path('upfront-plans/get-or-create-pending/', GetOrCreateInactivePlanView.as_view(), name='get-or-create-pending-upfront-plan'),
    path('upfront-plans/<int:plan_id>/calc-upfront-price/', calculate_plan_modification, name='calc-upfront-price'),
    path('', include(router.urls)),
]