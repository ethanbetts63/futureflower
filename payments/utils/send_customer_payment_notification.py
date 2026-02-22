import logging
import requests
from django.conf import settings
from django.template.loader import render_to_string

logger = logging.getLogger(__name__)


def send_customer_payment_notification(user, order):
    """
    Sends an immediate payment confirmation email to the customer after a successful payment.
    """
    if not user.email:
        logger.warning("No email for user %s — skipping customer payment notification.", user.pk)
        return

    first_name = user.first_name or user.username
    recipient_name = f"{order.recipient_first_name} {order.recipient_last_name}".strip()

    context = {
        'first_name': first_name,
        'recipient_name': recipient_name,
        'start_date': order.start_date,
        'budget': order.budget,
    }
    html_body = render_to_string('notifications/emails/customer_payment_confirmation.html', context)
    text_body = (
        f"Hi {first_name},\n\n"
        f"Your FutureFlower order has been confirmed!\n\n"
        f"Recipient: {recipient_name}\n"
        f"First delivery: {order.start_date}\n"
        f"Budget per bouquet: ${order.budget}\n\n"
        f"Thank you for choosing FutureFlower!"
    )

    try:
        response = requests.post(
            f"https://api.mailgun.net/v3/{settings.MAILGUN_DOMAIN}/messages",
            auth=("api", settings.MAILGUN_API_KEY),
            data={
                "from": settings.DEFAULT_FROM_EMAIL,
                "to": [user.email],
                "subject": "Your FutureFlower order is confirmed",
                "text": text_body,
                "html": html_body,
            },
            timeout=10,
        )
        response.raise_for_status()
    except Exception as e:
        logger.error("Failed to send customer payment notification for user %s: %s", user.pk, e)
