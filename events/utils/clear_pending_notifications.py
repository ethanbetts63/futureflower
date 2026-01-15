from ..models import Event, Notification

def clear_pending_notifications(event: 'Event'):
    """
    Deletes all notifications with a 'pending' status for a given event.
    """
    Notification.objects.filter(event=event, status='pending').delete()
