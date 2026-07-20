import json
from pathlib import Path
from django.core.management.base import BaseCommand

BASE_DIR    = Path(__file__).resolve().parent.parent.parent
JSONL_PATH  = BASE_DIR / "podcasts.jsonl"
REVIEW_PATH = BASE_DIR / "country_review.json"


class Command(BaseCommand):
    help = 'Drop non-Australian entries from podcasts.jsonl using country_review.json.'

    def handle(self, *args, **options):
        if not JSONL_PATH.exists():
            self.stdout.write(self.style.WARNING("podcasts.jsonl not found."))
            return

        if not REVIEW_PATH.exists():
            self.stdout.write(self.style.WARNING("country_review.json not found."))
            return

        review = json.loads(REVIEW_PATH.read_text(encoding="utf-8"))
        rejected = {
            entry["feed_url"]
            for bucket in ("not_aus", "unsure")
            for entry in review.get(bucket, [])
        }
        reviewed = rejected | {
            entry["feed_url"] for entry in review.get("aus", [])
        }

        with open(JSONL_PATH, "r", encoding="utf-8") as f:
            entries = [json.loads(line) for line in f if line.strip()]

        kept = []
        dropped = 0
        unreviewed = 0

        for entry in entries:
            feed_url = entry.get("feed_url", "")

            if feed_url in rejected:
                dropped += 1
                self.stdout.write(f"  - {entry.get('podcast_name', feed_url)}")
                continue

            if feed_url not in reviewed:
                unreviewed += 1

            kept.append(entry)

        with open(JSONL_PATH, "w", encoding="utf-8") as f:
            for entry in kept:
                f.write(json.dumps(entry, ensure_ascii=False) + "\n")

        self.stdout.write(f"\nDropped: {dropped} | Remaining in queue: {len(kept)}")

        if unreviewed:
            self.stdout.write(self.style.WARNING(
                f"{unreviewed} entry(s) had no decision in country_review.json and were kept. "
                f"Review them before writing intros."
            ))
