from .base_analytics_view import BaseAnalyticsView

class AutomatedNotificationHistoryView(BaseAnalyticsView):
    """
    Provides time-series data for automated notifications.
    """
    CHANNELS = ['primary_email', 'primary_sms', 'backup_email', 'backup_sms', 'emergency_contact_email']
