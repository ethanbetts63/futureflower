import os
import re
from django.conf import settings
from data_management.models import TermsAndConditions
from django.utils.timezone import now

# Maps filename prefix to the terms_type choice value
FILENAME_TYPE_MAP = {
    'florist': 'florist',
    'customer': 'customer',
    'affiliates': 'affiliate',
}

# Matches: florist_terms.html, customer_terms_v2.html, affiliates_terms_v1.0.html, etc.
TERMS_FILE_PATTERN = re.compile(
    r'^(florist|customer|affiliates)_terms(?:_v([\d\.]+))?\.html$'
)

class TermsUpdateOrchestrator:
    def __init__(self, command):
        self.command = command
        self.data_dir = os.path.join(settings.BASE_DIR, 'data_management', 'data')

    def run(self):
        self.command.stdout.write(self.command.style.SUCCESS("Starting Terms and Conditions update..."))

        html_files = [f for f in os.listdir(self.data_dir) if TERMS_FILE_PATTERN.match(f)]

        if not html_files:
            self.command.stdout.write(self.command.style.WARNING("No terms HTML files found."))
            return

        for file_name in html_files:
            self.process_file(file_name)

        self.command.stdout.write(self.command.style.SUCCESS("Successfully updated Terms and Conditions."))

    def process_file(self, file_name):
        match = TERMS_FILE_PATTERN.match(file_name)
        if not match:
            self.command.stdout.write(self.command.style.ERROR(f"Could not parse {file_name}"))
            return

        prefix, version = match.group(1), match.group(2) or '1.0'
        terms_type = FILENAME_TYPE_MAP[prefix]

        if TermsAndConditions.objects.filter(terms_type=terms_type, version=version).exists():
            self.command.stdout.write(self.command.style.NOTICE(
                f"{terms_type} v{version} already exists. Skipping."
            ))
            return

        file_path = os.path.join(self.data_dir, file_name)
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        terms = TermsAndConditions.objects.create(
            terms_type=terms_type,
            version=version,
            content=content,
            published_at=now(),
        )
        self.command.stdout.write(self.command.style.SUCCESS(f"Created: {terms}"))
