import json
from pathlib import Path
from django.core.management.base import BaseCommand

BASE_DIR    = Path(__file__).resolve().parent.parent.parent
JSONL_PATH  = BASE_DIR / "podcasts.jsonl"
OUTBOX_DIR  = BASE_DIR / "outbox"


class Command(BaseCommand):
    help = 'Move filled entries from podcasts.jsonl to outbox/ as individual JSON files.'

    def handle(self, *args, **options):
        if not JSONL_PATH.exists():
            self.stdout.write(self.style.WARNING("podcasts.jsonl not found."))
            return

        with open(JSONL_PATH, "r", encoding="utf-8") as f:
            entries = [json.loads(line) for line in f if line.strip()]

        OUTBOX_DIR.mkdir(exist_ok=True)

        remaining = []
        promoted = 0

        for entry in entries:
            if entry.get("subject") and entry.get("custom_intro"):
                filename = entry["email"].replace("/", "_") + ".json"
                dest = OUTBOX_DIR / filename
                dest.write_text(json.dumps(entry, ensure_ascii=False, indent=2), encoding="utf-8")
                promoted += 1
                self.stdout.write(self.style.SUCCESS(f"  + {entry['email']}"))
            else:
                remaining.append(entry)

        with open(JSONL_PATH, "w", encoding="utf-8") as f:
            for entry in remaining:
                f.write(json.dumps(entry, ensure_ascii=False) + "\n")

        self.stdout.write(f"\nPromoted: {promoted} | Remaining in queue: {len(remaining)}")
