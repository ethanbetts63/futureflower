from django.core.management.base import BaseCommand
from marketing.utils.emailer import send_email


class Command(BaseCommand):
    help = 'Send an email via the dev Gmail account.'

    def add_arguments(self, parser):
        parser.add_argument('--to',      required=True,  help='Recipient email address.')
        parser.add_argument('--subject', required=True,  help='Email subject line.')
        parser.add_argument('--body',    required=True,  help='Email body text.')

    def handle(self, *args, **options):
        to      = options['to']
        subject = options['subject']
        body    = options['body']

        self.stdout.write(f"Sending to {to}...")
        try:
            send_email(to=to, subject=subject, body=body)
            self.stdout.write(self.style.SUCCESS(f"Sent to {to}."))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Failed: {e}"))
