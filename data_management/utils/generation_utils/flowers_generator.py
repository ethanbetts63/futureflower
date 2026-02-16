# futureflower/data_management/utils/generation_utils/flowers_generator.py
import json
import os
from events.models import FlowerType

class FlowerGenerator:
    def __init__(self, command):
        self.command = command
        # Corrected path from .../utils/generation_utils/ to .../data/
        self.file_path = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'flowers.json')

    def run(self):
        """
        Deletes all existing FlowerType objects and repopulates the database
        with data from flowers.json.
        """
        self.command.stdout.write("Deleting all existing flower types...")
        FlowerType.objects.all().delete()
        self.command.stdout.write("All flower types deleted.")

        self.command.stdout.write(f"Loading flower type data from {self.file_path}...")
        try:
            with open(self.file_path, 'r') as f:
                flowers_data = json.load(f)
        except FileNotFoundError:
            self.command.stderr.write(self.command.style.ERROR(f"Error: flowers.json not found at {self.file_path}"))
            return

        flowers_to_create = [
            FlowerType(name=flower['name'], tagline=flower.get('tagline', ''))
            for flower in flowers_data
        ]

        self.command.stdout.write(f"Creating {len(flowers_to_create)} new flower types...")
        FlowerType.objects.bulk_create(flowers_to_create)
        self.command.stdout.write(self.command.style.SUCCESS("Successfully created new flower types."))
