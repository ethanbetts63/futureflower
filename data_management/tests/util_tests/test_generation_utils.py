import pytest
from unittest.mock import MagicMock
from data_management.utils.generation_utils.terms_generator import TermsUpdateOrchestrator
from data_management.models import TermsAndConditions

@pytest.mark.django_db
class TestGenerationUtils:
    def test_terms_generator(self, tmp_path):
        command = MagicMock()
        
        # Create dummy terms file with correct naming convention
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
