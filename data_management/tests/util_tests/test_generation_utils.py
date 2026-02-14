import pytest
import os
from unittest.mock import MagicMock
from data_management.utils.generation_utils.flowers_generator import FlowerGenerator
from data_management.utils.generation_utils.terms_generator import TermsUpdateOrchestrator
from data_management.models import TermsAndConditions
from events.models import FlowerType

@pytest.mark.django_db
class TestGenerationUtils:
    def test_flower_generator(self, tmp_path):
        # Mock command and data file
        command = MagicMock()
        generator = FlowerGenerator(command=command)
        
        # Create a dummy flowers.json
        data_dir = tmp_path / "data"
        data_dir.mkdir()
        flowers_file = data_dir / "flowers.json"
        import json
        with open(flowers_file, 'w') as f:
            json.dump(["Rose", "Lily", "Tulip"], f)
        
        # Patch the path to the data file
        with pytest.MonkeyPatch.context() as mp:
            mp.setattr(generator, 'file_path', str(flowers_file))
            generator.run()
        
        assert FlowerType.objects.count() == 3
        assert FlowerType.objects.filter(name="Rose").exists()

    def test_terms_generator(self, tmp_path):
        command = MagicMock()
        orchestrator = TermsUpdateOrchestrator(command=command)
        
        # Create dummy terms_v1.html
        data_dir = tmp_path / "data"
        data_dir.mkdir()
        terms_file = data_dir / "terms_v1.html"
        terms_file.write_text("<p>Terms content</p>")
        
        with pytest.MonkeyPatch.context() as mp:
            mp.setattr(orchestrator, 'data_dir', str(data_dir))
            orchestrator.run()
        
        assert TermsAndConditions.objects.count() == 1
        assert TermsAndConditions.objects.get(version=1).content == "<p>Terms content</p>"
