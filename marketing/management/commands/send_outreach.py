import json
import time
from pathlib import Path
from django.core.management.base import BaseCommand
from marketing.utils.emailer import send_email

BASE_DIR        = Path(__file__).resolve().parent.parent.parent
CONTACTED_PATH  = BASE_DIR / "contacted_podcasts.jsonl"
TEMPLATE_PATH   = BASE_DIR / "email.txt"
PLACEHOLDER     = "__________________________________________"


def append_contacted(entry):
    with open(CONTACTED_PATH, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")


def build_body(custom_intro: str) -> str:
    template = TEMPLATE_PATH.read_text(encoding="utf-8")
    return template.replace(PLACEHOLDER, custom_intro)


class Command(BaseCommand):
    help = 'Send outreach emails from inbox/ (or outbox/ with --dir outbox).'

    def add_arguments(self, parser):
        parser.add_argument(
            '--count',
            type=int,
            default=1,
            help='Number of emails to send (default: 1).',
        )

    def handle(self, *args, **options):
        inbox_dir = BASE_DIR / "inbox"

        if not inbox_dir.exists():
            self.stdout.write(self.style.WARNING("inbox/ directory not found."))
            return

        files = sorted(inbox_dir.glob("*.json"))

        if not files:
            self.stdout.write(self.style.WARNING("No files in inbox/."))
            return

        targets = files[:options['count']]
        self.stdout.write(f"{len(files)} in inbox/. Sending {len(targets)}.\n")

        sent = 0
        failed = 0

        for path in targets:
            entry = json.loads(path.read_text(encoding="utf-8"))
            to           = entry.get("email", "")
            subject      = entry.get("subject", "")
            custom_intro = entry.get("custom_intro", "")
            podcast_name = entry.get("podcast_name", "")

            body = build_body(custom_intro)

            try:
                send_email(to=to, subject=subject, body=body)
                append_contacted(entry)
                path.unlink()

                sent += 1
                self.stdout.write(self.style.SUCCESS(f"  Sent → {to}  ({podcast_name})"))

                if sent < len(targets):
                    self.stdout.write("  Waiting 30s...")
                    time.sleep(30)

            except Exception as e:
                failed += 1
                self.stdout.write(self.style.ERROR(f"  Failed → {to}  ({podcast_name}): {e}"))

        self.stdout.write(f"\nDone. Sent: {sent} | Failed: {failed}")
