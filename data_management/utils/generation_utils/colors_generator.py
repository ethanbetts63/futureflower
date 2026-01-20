# foreverflower/data_management/utils/generate_colors.py
import json
import os
from events.models import Color

def generate_colors():
    """
    Deletes all existing Color objects and repopulates the database
    with data from colors.json.
    """
    print("Deleting all existing colors...")
    Color.objects.all().delete()
    print("All colors deleted.")

    # Path to the JSON file
    file_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'colors.json')

    print(f"Loading color data from {file_path}...")
    with open(file_path, 'r') as f:
        colors_data = json.load(f)

    colors_to_create = []
    for color_data in colors_data:
        colors_to_create.append(
            Color(name=color_data['name'], hex_code=color_data.get('hex', ''))
        )

    print(f"Creating {len(colors_to_create)} new colors...")
    Color.objects.bulk_create(colors_to_create)
    print("Successfully created new colors.")

