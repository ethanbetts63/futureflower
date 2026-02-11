import logging
import requests
from django.conf import settings
from twilio.rest import Client

logger = logging.getLogger(__name__)

def send_admin_payment_notification(payment_id: str):
    """
    Sends a notification to the admin via email and SMS after a successful payment.

    Args:
        payment_id: The ID of the successful payment, for logging purposes.
    """
    message = "YOU'RE RICH! ForeverFlower just made money! LETS GOOOOOOO!"
    subject = "🎉 You Got Paid! 🎉"
    
    admin_email = settings.ADMIN_EMAIL
    admin_number = settings.ADMIN_NUMBER

    if not all([admin_email, admin_number]):
        logger.warning(
            "Admin contact details (ADMIN_EMAIL, ADMIN_NUMBER) are not fully configured. "
            "Cannot send payment notification for payment_id: %s.", payment_id
        )
        return

    try:
        # Send email to admin directly via Mailgun
        response = requests.post(
            f"https://api.mailgun.net/v3/{settings.MAILGUN_DOMAIN}/messages",
            auth=("api", settings.MAILGUN_API_KEY),
            data={"from": settings.DEFAULT_FROM_EMAIL,
                  "to": [admin_email],
                  "subject": subject,
                  "text": message})
        response.raise_for_status()

        # Send SMS to admin directly via Twilio
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        client.messages.create(
            body=message,
            messaging_service_sid=settings.TWILIO_MESSAGING_SERVICE_SID,
            to=admin_number
        )

    except Exception as e:
        logger.error(
            "An error occurred while sending admin payment notification for payment_id: %s. Error: %s",
            payment_id, e
        )
