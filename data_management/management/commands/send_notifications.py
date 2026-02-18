from datetime import date
from django.core.management.base import BaseCommand
from data_management.models import Notification
from data_management.utils.notification_sender import send_notification


class Command(BaseCommand):
    help = 'Sends all pending notifications scheduled for today or earlier.'

    def handle(self, *args, **options):
        today = date.today()
        due = Notification.objects.filter(status='pending', scheduled_for__lte=today)
        sent, failed = 0, 0
        for notification in due:
            send_notification(notification)
            if notification.status == 'sent':
                sent += 1
            else:
                failed += 1
        self.stdout.write(f'Done. Sent: {sent}, Failed: {failed}')
