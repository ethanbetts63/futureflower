from datetime import date, timedelta
from data_management.models import Notification


def _build_event_body(event):
    order = event.order
    flower_types = ', '.join(order.preferred_flower_types.values_list('name', flat=True)) or 'Not specified'
    return (
        f"Upcoming FutureFlower delivery requires ordering.\n\n"
        f"Recipient: {order.recipient_first_name} {order.recipient_last_name}\n"
        f"Address: {order.recipient_street_address}, {order.recipient_suburb}, "
        f"{order.recipient_city}, {order.recipient_state} {order.recipient_postcode}, "
        f"{order.recipient_country}\n"
        f"Delivery Date: {event.delivery_date}\n"
        f"Budget: ${order.budget}\n"
        f"Flower Types: {flower_types}\n"
    )


def create_admin_event_notifications(event):
    """
    Creates 4 pending admin notifications for a newly created event:
    - email at delivery_date - 7 days
    - sms at delivery_date - 7 days
    - email at delivery_date - 3 days
    - sms at delivery_date - 3 days

    Skips creating a notification if the scheduled_for date is in the past.
    """
    today = date.today()
    body = _build_event_body(event)

    schedule_offsets = [7, 3]
    channels = ['email', 'sms']

    notifications_to_create = []
    for days_before in schedule_offsets:
        scheduled_for = event.delivery_date - timedelta(days=days_before)
        if scheduled_for < today:
            continue
        for channel in channels:
            notifications_to_create.append(
                Notification(
                    recipient_type='admin',
                    channel=channel,
                    subject=f"Action Required: Order flowers for delivery on {event.delivery_date}",
                    body=body,
                    scheduled_for=scheduled_for,
                    related_event=event,
                )
            )

    if notifications_to_create:
        Notification.objects.bulk_create(notifications_to_create)


def cancel_event_notifications(event):
    """
    Called when admin marks an event as 'ordered'.
    Sets status='cancelled' on all pending notifications for this event.
    """
    Notification.objects.filter(related_event=event, status='pending').update(status='cancelled')


def create_admin_delivery_day_notifications(event):
    """
    Called when admin marks an event as 'ordered'.
    Creates 2 notifications (email + sms) scheduled for event.delivery_date:
    "Delivery day today — please confirm once delivered."
    """
    order = event.order
    body = (
        f"Delivery day today — please confirm once delivered.\n\n"
        f"Recipient: {order.recipient_first_name} {order.recipient_last_name}\n"
        f"Address: {order.recipient_street_address}, {order.recipient_suburb}, "
        f"{order.recipient_city}, {order.recipient_state} {order.recipient_postcode}, "
        f"{order.recipient_country}\n"
        f"Delivery Date: {event.delivery_date}\n"
    )

    notifications = [
        Notification(
            recipient_type='admin',
            channel='email',
            subject=f"Delivery Day: {order.recipient_first_name} {order.recipient_last_name} on {event.delivery_date}",
            body=body,
            scheduled_for=event.delivery_date,
            related_event=event,
        ),
        Notification(
            recipient_type='admin',
            channel='sms',
            body=body,
            scheduled_for=event.delivery_date,
            related_event=event,
        ),
    ]
    Notification.objects.bulk_create(notifications)
