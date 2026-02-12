# futureflower/data_management/utils/generation_utils/colors_generator.py
import json
import os
from events.models import Color

class ColorGenerator:
    def __init__(self, command):
        self.command = command
        # Corrected path from .../utils/generation_utils/ to .../data/
        self.file_path = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'colors.json')

    def run(self):
        """
        Deletes all existing Color objects and repopulates the database
        with data from colors.json.
        """
        self.command.stdout.write("Deleting all existing colors...")
        Color.objects.all().delete()
        self.command.stdout.write("All colors deleted.")

        self.command.stdout.write(f"Loading color data from {self.file_path}...")
        try:
            with open(self.file_path, 'r') as f:
                colors_data = json.load(f)
        except FileNotFoundError:
            self.command.stderr.write(self.command.style.ERROR(f"Error: colors.json not found at {self.file_path}"))
            return

        colors_to_create = [
            Color(name=color_data['name'], hex_code=color_data.get('hex', ''))
            for color_data in colors_data
        ]

        self.command.stdout.write(f"Creating {len(colors_to_create)} new colors...")
        Color.objects.bulk_create(colors_to_create)
        self.command.stdout.write(self.command.style.SUCCESS("Successfully created new colors."))
