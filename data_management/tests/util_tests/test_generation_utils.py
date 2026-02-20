import pytest
import os
import json
from unittest.mock import MagicMock, patch
from data_management.utils.generation_utils.flowers_generator import FlowerGenerator
from data_management.utils.generation_utils.terms_generator import TermsUpdateOrchestrator
from data_management.models import TermsAndConditions
from events.models import FlowerType

@pytest.mark.django_db
class TestGenerationUtils:
    def test_flower_generator(self, tmp_path):
        # Mock command and data file
        command = MagicMock()
        
        # Create a dummy flowers.json with correct structure
        data_dir = tmp_path / "data"
        data_dir.mkdir()
        flowers_file = data_dir / "flowers.json"
        
        flowers_data = [
            {"name": "Rose", "tagline": "Classic"},
            {"name": "Lily", "tagline": "Elegant"},
            {"name": "Tulip", "tagline": "Spring"}
        ]
        
        with open(flowers_file, 'w') as f:
            json.dump(flowers_data, f)
        
        # Patch the file path within the class instance or init
        # Since file_path is set in __init__, we need to patch it after instantiation or mock os.path.join
        
        # Easier: Instantiate then overwrite file_path
        generator = FlowerGenerator(command=command)
        generator.file_path = str(flowers_file)
        
        generator.run()
        
        assert FlowerType.objects.count() == 3
        assert FlowerType.objects.filter(name="Rose").exists()

    def test_terms_generator(self, tmp_path):
        command = MagicMock()
        
        # Create dummy terms file with correct naming convention
        # Pattern: ^(florist|customer|affiliates)_terms(?:_v([\d\.]+))?\.html$
        data_dir = tmp_path / "data"
        data_dir.mkdir()
        terms_file = data_dir / "customer_terms_v1.0.html"
        terms_file.write_text("<p>Customer Terms content</p>", encoding='utf-8')
        
        orchestrator = TermsUpdateOrchestrator(command=command)
        # Overwrite data_dir to point to our temp dir
        orchestrator.data_dir = str(data_dir)
        
        orchestrator.run()
        
        assert TermsAndConditions.objects.count() == 1
        terms = TermsAndConditions.objects.first()
        assert terms.terms_type == 'customer'
        assert terms.version == '1.0'
        assert terms.content == "<p>Customer Terms content</p>"
