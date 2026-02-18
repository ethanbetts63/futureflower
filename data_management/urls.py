from django.urls import path
from .views.add_to_blocklist_view import AddToBlocklistView
from .views.blocklist_success_view import BlocklistSuccessView
from .views.terms_and_conditions_view import LatestTermsAndConditionsView
from .views.admin_dashboard_view import AdminDashboardView
from .views.admin_event_detail_view import AdminEventDetailView
from .views.admin_mark_ordered_view import AdminMarkOrderedView
from .views.admin_mark_delivered_view import AdminMarkDeliveredView

app_name = 'data_management'

urlpatterns = [
    path('blocklist/block/<str:signed_email>/', AddToBlocklistView.as_view(), name='add_to_blocklist'),
    path('blocklist-success/', BlocklistSuccessView.as_view(), name='blocklist_success'),
    path('terms/latest/', LatestTermsAndConditionsView.as_view(), name='latest-terms'),
    # Admin endpoints
    path('admin/dashboard/', AdminDashboardView.as_view(), name='admin-dashboard'),
    path('admin/events/<int:pk>/', AdminEventDetailView.as_view(), name='admin-event-detail'),
    path('admin/events/<int:pk>/mark-ordered/', AdminMarkOrderedView.as_view(), name='admin-mark-ordered'),
    path('admin/events/<int:pk>/mark-delivered/', AdminMarkDeliveredView.as_view(), name='admin-mark-delivered'),
]
