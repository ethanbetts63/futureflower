from django.core.management.base import BaseCommand
from marketing.utils.scraper import (
    load_searched_terms, save_searched_terms,
    load_searched_feeds, save_searched_feeds,
    load_planned_emails, save_planned_emails,
    next_terms, scrape_term,
)


class Command(BaseCommand):
    help = 'Scrape iTunes for podcasts and save qualifying leads to podcasts.jsonl.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--batch',
            type=int,
            default=10,
            help='Number of entries to write per run (default: 10).',
        )

    def handle(self, *args, **options):
        searched_terms = load_searched_terms()
        searched_feeds = load_searched_feeds()
        planned_emails = load_planned_emails()

        if not next_terms(searched_terms, 1):
            self.stdout.write(self.style.WARNING('All 676 terms have been searched. Nothing left to do.'))
            return

        target = options['batch']
        total_written = 0
        total_skipped = 0
        consecutive_empty = 0

        while total_written < target:
            upcoming = next_terms(searched_terms, 1)
            if not upcoming:
                self.stdout.write(self.style.WARNING('All 676 terms exhausted before target was reached.'))
                break

            term = upcoming[0]
            remaining_needed = target - total_written

            written, skipped, searched_feeds, planned_emails, _ = scrape_term(
                term, searched_feeds, self.stdout.write,
                limit=remaining_needed, planned_emails=planned_emails,
            )
            searched_terms.append(term)
            total_written += written
            total_skipped += skipped

            if written == 0 and skipped == 0:
                consecutive_empty += 1
                if consecutive_empty >= 5:
                    self.stdout.write(self.style.WARNING('5 consecutive terms returned nothing. Stopping early.'))
                    break
            else:
                consecutive_empty = 0

            # Save after each term so a crash loses nothing
            save_searched_terms(searched_terms)
            save_searched_feeds(searched_feeds)
            save_planned_emails(planned_emails)

        remaining_terms = 676 - len(searched_terms)
        self.stdout.write(self.style.SUCCESS(
            f'\nDone. Written: {total_written} | Skipped: {total_skipped}'
        ))
        self.stdout.write(f'Terms searched: {len(searched_terms)}/676 | Remaining: {remaining_terms}')
        next_t = next_terms(searched_terms, 1)
        if next_t:
            self.stdout.write(f"Next term: '{next_t[0]}'")
