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

        terms = next_terms(searched_terms, options['batch'])

        if not terms:
            self.stdout.write(self.style.WARNING('All 676 terms have been searched. Nothing left to do.'))
            return

        total_written = 0
        total_skipped = 0

        for term in terms:
            written, skipped, searched_feeds = scrape_term(
                term, searched_feeds, self.stdout.write
            )
            searched_terms.append(term)
            total_written += written
            total_skipped += skipped

            # Save after each term so a crash mid-batch loses nothing
            save_searched_terms(searched_terms)
            save_searched_feeds(searched_feeds)

        remaining = 676 - len(searched_terms)
        self.stdout.write(self.style.SUCCESS(
            f'\nBatch complete. Written: {total_written} | Skipped: {total_skipped}'
        ))
        self.stdout.write(
            f'Terms searched: {len(searched_terms)}/676 | Remaining: {remaining}'
        )
        upcoming = next_terms(searched_terms, 1)
        if upcoming:
            self.stdout.write(f"Next term: '{upcoming[0]}'")
