from django.core.management.base import BaseCommand, CommandParser
from PIL import Image
import os

class Command(BaseCommand):
    help = 'Resizes an image to multiple widths for responsive use.'

    def add_arguments(self, parser: CommandParser) -> None:
        parser.add_argument('image_path', type=str, help='The path to the image to resize.')
        parser.add_argument(
            '--widths',
            type=str,
            help='A comma-separated list of widths to resize the image to (e.g., "320,640,1024").',
            default='320,640,768,1024,1280'
        )

    def handle(self, *args, **options):
        image_path = options['image_path']
        
        try:
            width_strs = options['widths'].split(',')
            widths = [int(w) for w in width_strs]
        except (ValueError, AttributeError):
            self.stdout.write(self.style.ERROR("Invalid format for --widths. Please use a comma-separated list of numbers."))
            return

        if not os.path.exists(image_path):
            self.stdout.write(self.style.ERROR(f"Image not found at: {image_path}"))
            return

        directory, filename = os.path.split(image_path)
        name, ext = os.path.splitext(filename)

        try:
            with Image.open(image_path) as img:
                for width in widths:
                    # Calculate new height to maintain aspect ratio
                    aspect_ratio = img.height / img.width
                    height = int(width * aspect_ratio)

                    # Resize image
                    resized_img = img.resize((width, height), Image.Resampling.LANCZOS)
                    
                    # Save the new image as webp with specified quality
                    new_filename = f"{name}-{width}w.webp"
                    new_filepath = os.path.join(directory, new_filename)
                    
                    resized_img.save(new_filepath, 'WEBP', quality=100)
                    self.stdout.write(self.style.SUCCESS(f"Successfully created {new_filepath}"))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"An error occurred: {e}"))
