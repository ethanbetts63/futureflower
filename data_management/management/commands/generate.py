import json
import os
from django.core.management.base import BaseCommand
from data_management.utils.generation_utils.terms_generator import TermsUpdateOrchestrator
from data_management.utils.archive_db.database_archiver import DatabaseArchiver

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
            '--colors',
            action='store_true',
            help='Generate basic colors and write to colors.json.',
        )
        parser.add_argument(
            '--flowers',
            action='store_true',
            help='Generate flower list and write to flowers.json.',
        )

    def handle(self, *args, **options):
        something_generated = False

        command_dir = os.path.dirname(os.path.abspath(__file__))
        data_dir = os.path.join(command_dir, '..', '..', 'data')

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

        if options['colors']:
            something_generated = True
            self.stdout.write(self.style.SUCCESS('Generating colors.json...'))
            colors_data = [
                {"name": "Red", "hex": "#FF0000"},
                {"name": "Green", "hex": "#008000"},
                {"name": "Blue", "hex": "#0000FF"},
                {"name": "White", "hex": "#FFFFFF"},
                {"name": "Black", "hex": "#000000"},
                {"name": "Yellow", "hex": "#FFFF00"},
                {"name": "Purple", "hex": "#800080"},
                {"name": "Pink", "hex": "#FFC0CB"},
                {"name": "Orange", "hex": "#FFA500"},
            ]
            file_path = os.path.join(data_dir, 'colors.json')
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            with open(file_path, 'w') as f:
                json.dump(colors_data, f, indent=4)
            self.stdout.write(self.style.SUCCESS(f'Successfully generated {os.path.abspath(file_path)}'))

        if options['flowers']:
            something_generated = True
            self.stdout.write(self.style.SUCCESS('Generating flowers.json...'))
            flowers_list = [
                "Rose", "Tulip", "Carnation", "Peony", "Sunflower", "Orchid", "Lily", "Alstroemeria", "Stock",
                "Daffodil", "Daisy", "Hyacinth", "Iris", "Chrysanthemum", "Geranium", "Magnolia", "Lavender",
                "Poppy", "Bluebell", "Marigold", "Amaryllis", "Camellia", "Begonia", "Dahlia", "Zinnia",
                "Snapdragon", "Petunia", "Pansy", "Jasmine", "Hellebore", "Gardenia", "Fuchsia", "Clematis",
                "Azalea", "Anemone", "Crocus", "Ranunculus", "Gladiolus", "Foxglove", "Aster", "Forget-me-not",
                "Lily of the Valley", "Hibiscus", "Cyclamen", "Freesia", "Cosmos", "Sweet Pea", "Verbena",
                "Primrose", "Heather", "Rhododendron", "Lotus", "Violets", "Impatiens", "Calendula",
                "Black-eyed Susan", "Cherry Blossom", "Plumeria", "Bromeliad", "Calla Lily", "Canna", "Saffron",
                "Statice", "Waxflower", "Yarrow", "Allium", "Bleeding Heart", "Echinacea", "Gaillardia",
                "Morning Glory", "Nasturtium", "Phlox", "Salvia", "Sedum", "Thistle", "Veronica", "Wallflower",
                "Wisteria", "Gloxinia", "Cornflower", "Hydrangea", "Bougainvillea", "Gerbera Daisy", "Buddleia",
                "Lantana"
            ]
            file_path = os.path.join(data_dir, 'flowers.json')
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            with open(file_path, 'w') as f:
                json.dump(flowers_list, f, indent=4)
            self.stdout.write(self.style.SUCCESS(f'Successfully generated {os.path.abspath(file_path)}'))

        if not something_generated:
            self.stdout.write(self.style.WARNING(
                'No generation flag specified. Please use --terms, --archive, --colors, or --flowers.'
            ))

