import pytest
from io import StringIO
from unittest.mock import patch
from django.core.management import call_command
from django.core.management.base import CommandError

@pytest.mark.django_db
class TestGenerateCommand:

    @patch('data_management.management.commands.generate.TermsUpdateOrchestrator')
    def test_generate_terms_flag(self, mock_orchestrator):
        """Test that the --terms flag calls the TermsUpdateOrchestrator."""
        out = StringIO()
        call_command('generate', '--terms', stdout=out)
        
        mock_orchestrator.assert_called_once()
        mock_orchestrator.return_value.run.assert_called_once()
        assert 'Starting Terms and Conditions generation...' in out.getvalue()

    @patch('data_management.management.commands.generate.DatabaseArchiver')
    def test_archive_flag(self, mock_archiver):
        """Test that the --archive flag calls the DatabaseArchiver."""
        out = StringIO()
        call_command('generate', '--archive', stdout=out)
        
        mock_archiver.assert_called_once()
        mock_archiver.return_value.run.assert_called_once()
        assert 'Starting database archive...' in out.getvalue()

    def test_no_flags(self):
        """Test that the command shows a warning if no flags are provided."""
        out = StringIO()
        call_command('generate', stdout=out)
        assert 'No generation flag specified' in out.getvalue()

    @patch('data_management.management.commands.generate.DatabaseArchiver')
    @patch('data_management.management.commands.generate.TermsUpdateOrchestrator')
    def test_multiple_flags(self, mock_terms_orchestrator, mock_archiver):
        """Test that multiple flags can be used at the same time."""
        out = StringIO()
        call_command('generate', '--terms', '--archive', stdout=out)

        mock_terms_orchestrator.assert_called_once()
        mock_archiver.assert_called_once()

        output = out.getvalue()
        assert 'Starting Terms and Conditions generation...' in output
        assert 'Starting database archive...' in output
