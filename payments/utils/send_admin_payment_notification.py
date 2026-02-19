import logging
import requests
from django.conf import settings
from twilio.rest import Client

logger = logging.getLogger(__name__)


def send_admin_cancellation_notification(message: str):
    """
    Sends an admin notification for a plan cancellation event (email + SMS).
    """
    subject = "FutureFlower Plan Cancelled — Action May Be Required"
    admin_email = settings.ADMIN_EMAIL
    admin_number = settings.ADMIN_NUMBER

    if not all([admin_email, admin_number]):
        logger.warning(
            "Admin contact details not fully configured. Cannot send cancellation notification."
        )
        return

    try:
        response = requests.post(
            f"https://api.mailgun.net/v3/{settings.MAILGUN_DOMAIN}/messages",
            auth=("api", settings.MAILGUN_API_KEY),
            data={
                "from": settings.DEFAULT_FROM_EMAIL,
                "to": [admin_email],
                "subject": subject,
                "text": message,
            },
            timeout=10,
        )
        response.raise_for_status()

        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        client.messages.create(
            body=message,
            messaging_service_sid=settings.TWILIO_MESSAGING_SERVICE_SID,
            to=admin_number,
        )

    except Exception as e:
        logger.error(
            "An error occurred while sending admin cancellation notification. Error: %s", e
        )


def send_admin_payment_notification(payment_id: str, order=None):
    """
    Sends an immediate notification to the admin via email and SMS after a successful payment.

    Args:
        payment_id: The ID of the successful payment, for logging purposes.
        order: The OrderBase instance associated with the payment (optional, for order context).
    """
    subject = "New FutureFlower Order Received"

    if order:
        message = (
            f"New order received!\n\n"
            f"Recipient: {order.recipient_first_name} {order.recipient_last_name}\n"
            f"Delivery Date: {order.start_date}\n"
            f"Budget: ${order.budget}\n"
            f"Payment ID: {payment_id}"
        )
    else:
        message = f"New FutureFlower payment received. Payment ID: {payment_id}"

    admin_email = settings.ADMIN_EMAIL
    admin_number = settings.ADMIN_NUMBER

    if not all([admin_email, admin_number]):
        logger.warning(
            "Admin contact details (ADMIN_EMAIL, ADMIN_NUMBER) are not fully configured. "
            "Cannot send payment notification for payment_id: %s.", payment_id
        )
        return

    try:
        response = requests.post(
            f"https://api.mailgun.net/v3/{settings.MAILGUN_DOMAIN}/messages",
            auth=("api", settings.MAILGUN_API_KEY),
            data={
                "from": settings.DEFAULT_FROM_EMAIL,
                "to": [admin_email],
                "subject": subject,
                "text": message,
            },
            timeout=10,
        )
        response.raise_for_status()

        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        client.messages.create(
            body=message,
            messaging_service_sid=settings.TWILIO_MESSAGING_SERVICE_SID,
            to=admin_number,
        )

    except Exception as e:
        logger.error(
            "An error occurred while sending admin payment notification for payment_id: %s. Error: %s",
            payment_id, e
        )
