from twilio.rest import Client
from django.conf import settings
from typing import Union

def send_reminder_sms(notification: 'Notification', recipient_phone_number: str) -> Union[str, bool]:
    """
    Sends a single event reminder SMS based on a Notification object using Twilio API.

    This function constructs the SMS and sends it via Twilio.

    Args:
        notification: The Notification instance to be sent.
        recipient_phone_number: The phone number to send the reminder to.

    Returns:
        The Message SID if the SMS was sent successfully, False otherwise.
    """
    if not notification.user or not notification.event or not recipient_phone_number:
        # Cannot send an SMS without context or a recipient.
        return False

    try:
        # 1. Construct the message
        message_body = f"Reminder from ForeverFlower: {notification.event.name} on {notification.event.event_date}."
        
        # 2. Construct the full webhook URL
        status_callback_url = f"{settings.SITE_URL}/api/webhooks/twilio/status/"

        # 3. Send the SMS using Twilio API
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

        message = client.messages.create(
            body=message_body,
            messaging_service_sid=settings.TWILIO_MESSAGING_SERVICE_SID,
            to=recipient_phone_number,
            status_callback=status_callback_url
        )

        # 4. Return the SID on success
        if message.sid:
            return message.sid
        else:
            return False

    except Exception as e:
        # The exception will be caught by the Notification.send() method,
        # so we can just re-raise it to be handled there.
        raise e
