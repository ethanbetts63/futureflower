import json
import requests
from pathlib import Path
from django.core.management.base import BaseCommand
from django.conf import settings

BASE_DIR  = Path(__file__).resolve().parent.parent.parent
OUTBOX_DIR = BASE_DIR / "outbox"


class Command(BaseCommand):
    help = 'Upload enriched outbox entries to the live server inbox.'

    def add_arguments(self, parser):
        parser.add_argument('--dev', action='store_true', help='Upload to local dev server (http://127.0.0.1:8000).')
        parser.add_argument('--count', type=int, default=None, help='Max number of files to upload.')

    def handle(self, *args, **options):
        if not OUTBOX_DIR.exists():
            self.stdout.write(self.style.WARNING("outbox/ directory not found."))
            return

        files = sorted(OUTBOX_DIR.glob("*.json"))
        if not files:
            self.stdout.write(self.style.WARNING("No files in outbox/."))
            return

        if options['count'] is not None:
            files = files[:options['count']]

        server_url = 'http://127.0.0.1:8000' if options['dev'] else self._get_server_url()
        api_key = self._get_api_key()
        if not server_url or not api_key:
            return

        upload_url = f"{server_url.rstrip('/')}/api/marketing/upload/"
        headers = {'X-Internal-API-Key': api_key, 'Content-Type': 'application/json'}

        self.stdout.write(f"{len(files)} file(s) in outbox. Uploading to {upload_url}\n")

        uploaded = 0
        failed = 0

        for path in files:
            entry = json.loads(path.read_text(encoding='utf-8'))
            email = entry.get('email', path.stem)
            try:
                response = requests.post(upload_url, json=entry, headers=headers, timeout=15)
                response.raise_for_status()
                path.unlink()
                uploaded += 1
                self.stdout.write(self.style.SUCCESS(f"  Uploaded -> {email}"))
            except requests.HTTPError:
                failed += 1
                self.stdout.write(self.style.ERROR(f"  Failed -> {email}: HTTP {response.status_code} {response.text}"))
            except Exception as e:
                failed += 1
                self.stdout.write(self.style.ERROR(f"  Failed -> {email}: {e}"))

        self.stdout.write(f"\nDone. Uploaded: {uploaded} | Failed: {failed}")

    def _get_server_url(self):
        url = getattr(settings, 'MARKETING_SERVER_URL', None)
        if not url:
            self.stderr.write(self.style.ERROR(
                "MARKETING_SERVER_URL is not configured in settings. Set it in your .env file."
            ))
            return None
        return url

    def _get_api_key(self):
        key = getattr(settings, 'INTERNAL_API_KEY', None)
        if not key:
            self.stderr.write(self.style.ERROR(
                "INTERNAL_API_KEY is not configured in settings. Set it in your .env file."
            ))
            return None
        return key
