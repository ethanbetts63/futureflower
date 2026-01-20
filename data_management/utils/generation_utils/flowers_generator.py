# foreverflower/data_management/utils/generate_flowers.py
import json
import os
from events.models import FlowerType

def generate_flowers():
    """
    Deletes all existing FlowerType objects and repopulates the database
    with data from flowers.json.
    """
    print("Deleting all existing flower types...")
    FlowerType.objects.all().delete()
    print("All flower types deleted.")

    # Path to the JSON file
    file_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'flowers.json')

    print(f"Loading flower type data from {file_path}...")
    with open(file_path, 'r') as f:
        flowers_data = json.load(f)

    flowers_to_create = []
    for flower_name in flowers_data:
        flowers_to_create.append(
            FlowerType(name=flower_name)
        )

    print(f"Creating {len(flowers_to_create)} new flower types...")
    FlowerType.objects.bulk_create(flowers_to_create)
    print("Successfully created new flower types.")
