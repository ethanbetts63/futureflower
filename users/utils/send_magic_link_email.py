import logging

import requests
from django.conf import settings

from data_management.models import BlockedEmail

logger = logging.getLogger(__name__)


def send_magic_link_email(user, token, order=None):
    """Email a non-blocking, single-use order management link."""
    if BlockedEmail.objects.filter(email=user.email).exists():
        logger.info('Order access email to %s suppressed because it is blocklisted.', user.email)
        return False

    destination = '/manage-order' if not order else f'/manage-order/{order.id}'
    access_url = f'{settings.SITE_URL}{destination}?token={token}'
    subject = 'Manage your FutureFlower order'
    text = f'Your FutureFlower order is ready. Use this private link to view or manage it:\n\n{access_url}\n\nThis link expires in 30 minutes.'
    html = f'<p>Your FutureFlower order is ready.</p><p><a href="{access_url}">View or manage your order</a></p><p>This private link expires in 30 minutes.</p>'
    try:
        response = requests.post(
            f'https://api.mailgun.net/v3/{settings.MAILGUN_DOMAIN}/messages',
            auth=('api', settings.MAILGUN_API_KEY),
            data={'from': settings.DEFAULT_FROM_EMAIL, 'to': [user.email], 'subject': subject, 'text': text, 'html': html},
            timeout=10,
        )
        if response.status_code == 200:
            return True
        logger.error('Magic link email to %s failed: %s %s', user.email, response.status_code, response.text)
    except Exception:
        logger.exception('Magic link email to %s failed.', user.email)
    return False
