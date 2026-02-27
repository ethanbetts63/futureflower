from django.core.management.base import BaseCommand
from marketing.utils.scraper import (
    load_searched_terms, save_searched_terms,
    load_searched_feeds, save_searched_feeds,
    next_terms, scrape_term,
)


class Command(BaseCommand):
    help = 'Scrape iTunes for podcasts and save qualifying leads to podcasts.jsonl.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--batch',
            type=int,
            default=1,
            help='Number of search terms to process in one run (default: 1).',
        )

    def handle(self, *args, **options):
        searched_terms = load_searched_terms()
        searched_feeds = load_searched_feeds()

        if not next_terms(searched_terms, 1):
            self.stdout.write(self.style.WARNING('All 676 terms have been searched. Nothing left to do.'))
            return

        target = options['batch']
        total_written = 0
        total_skipped = 0

        while total_written < target:
            upcoming = next_terms(searched_terms, 1)
            if not upcoming:
                self.stdout.write(self.style.WARNING('All 676 terms exhausted before target was reached.'))
                break

            term = upcoming[0]
            remaining_needed = target - total_written

            written, skipped, searched_feeds, _ = scrape_term(
                term, searched_feeds, self.stdout.write, limit=remaining_needed
            )
            searched_terms.append(term)
            total_written += written
            total_skipped += skipped

            # Save after each term so a crash loses nothing
            save_searched_terms(searched_terms)
            save_searched_feeds(searched_feeds)

        remaining_terms = 676 - len(searched_terms)
        self.stdout.write(self.style.SUCCESS(
            f'\nDone. Written: {total_written} | Skipped: {total_skipped}'
        ))
        self.stdout.write(f'Terms searched: {len(searched_terms)}/676 | Remaining: {remaining_terms}')
        next_t = next_terms(searched_terms, 1)
        if next_t:
            self.stdout.write(f"Next term: '{next_t[0]}'")
