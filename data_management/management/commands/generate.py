from django.core.management.base import BaseCommand
from data_management.utils.generation_utils.terms_generator import TermsUpdateOrchestrator
from data_management.utils.archive_db.database_archiver import DatabaseArchiver
from data_management.utils.generation_utils.flowers_generator import FlowerGenerator

class Command(BaseCommand):
    help = 'Generates data for the application. Use flags to specify what to generate.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--terms',
            action='store_true',
            help='Generate Terms and Conditions from HTML data files.',
        )
        parser.add_argument(
            '--archive',
            action='store_true',
            help='Archive the current database state to JSON files.',
        )
        parser.add_argument(
            '--flowers',
            action='store_true',
            help='Generate flower list and write to flowers.json.',
        )

    def handle(self, *args, **options):
        something_generated = False

        if options['terms']:
            something_generated = True
            self.stdout.write(self.style.SUCCESS('Starting Terms and Conditions generation...'))
            orchestrator = TermsUpdateOrchestrator(command=self)
            orchestrator.run()

        if options['archive']:
            something_generated = True
            self.stdout.write(self.style.SUCCESS('Starting database archive...'))
            archiver = DatabaseArchiver(command=self)
            archiver.run()

        if options['flowers']:
            something_generated = True
            self.stdout.write(self.style.SUCCESS('Generating flowers.json...'))
            generator = FlowerGenerator(command=self)
            generator.run()

        if not something_generated:
            self.stdout.write(self.style.WARNING(
                'No generation flag specified. Please use --terms, --archive, or --flowers.'
            ))


