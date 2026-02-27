import json
from pathlib import Path
from django.core.management.base import BaseCommand
from marketing.utils.emailer import send_email

BASE_DIR           = Path(__file__).resolve().parent.parent.parent
JSONL_PATH         = BASE_DIR / "podcasts.jsonl"
CONTACTED_PATH     = BASE_DIR / "contacted_podcasts.jsonl"
TEMPLATE_PATH      = BASE_DIR / "email.txt"
PLACEHOLDER        = "__________________________________________"


def load_entries():
    if not JSONL_PATH.exists():
        return []
    with open(JSONL_PATH, "r", encoding="utf-8") as f:
        return [json.loads(line) for line in f if line.strip()]


def save_entries(entries):
    with open(JSONL_PATH, "w", encoding="utf-8") as f:
        for entry in entries:
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")


def append_contacted(entry):
    with open(CONTACTED_PATH, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")


def build_body(custom_intro: str) -> str:
    template = TEMPLATE_PATH.read_text(encoding="utf-8")
    return template.replace(PLACEHOLDER, custom_intro)


class Command(BaseCommand):
    help = 'Send outreach emails to all entries in podcasts.jsonl.'

    def handle(self, *args, **options):
        entries = load_entries()

        if not entries:
            self.stdout.write(self.style.WARNING("No entries in podcasts.jsonl."))
            return

        self.stdout.write(f"{len(entries)} entries to process.\n")
        sent = 0
        failed = 0

        for entry in list(entries):
            to           = entry.get("email", "")
            subject      = entry.get("subject", "")
            custom_intro = entry.get("custom_intro", "")
            podcast_name = entry.get("podcast_name", "")

            if not to or not subject:
                self.stdout.write(self.style.WARNING(
                    f"  Skipping '{podcast_name}' — missing email or subject."
                ))
                continue

            body = build_body(custom_intro)

            try:
                send_email(to=to, subject=subject, body=body)

                # Atomic update: remove from podcasts.jsonl, append to contacted
                entries = [e for e in entries if e.get("feed_url") != entry.get("feed_url")]
                save_entries(entries)
                append_contacted(entry)

                sent += 1
                self.stdout.write(self.style.SUCCESS(f"  Sent → {to}  ({podcast_name})"))

            except Exception as e:
                failed += 1
                self.stdout.write(self.style.ERROR(f"  Failed → {to}  ({podcast_name}): {e}"))

        self.stdout.write(f"\nDone. Sent: {sent} | Failed: {failed}")
