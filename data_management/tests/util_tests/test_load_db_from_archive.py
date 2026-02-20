import pytest
import os
import subprocess
from unittest.mock import patch, MagicMock, call, ANY
from io import StringIO
from data_management.utils.archive_db.load_db_from_archive import load_db_from_latest_archive

@pytest.fixture
def mock_command():
    """Fixture to create a mock management command with stdout and stderr."""
    command = MagicMock()
    command.stdout = StringIO()
    command.stderr = StringIO()
    command.style = MagicMock()
    command.style.SUCCESS = lambda x: x
    command.style.ERROR = lambda x: x
    command.style.WARNING = lambda x: x
    return command

@patch('data_management.utils.archive_db.load_db_from_archive.os.path.exists')
@patch('data_management.utils.archive_db.load_db_from_archive.os.listdir')
@patch('data_management.utils.archive_db.load_db_from_archive.os.path.isdir', return_value=True)
class TestLoadDbFromArchive:

    @patch('data_management.utils.archive_db.load_db_from_archive.subprocess.run')
    def test_load_success(self, mock_subprocess_run, mock_isdir, mock_listdir, mock_exists, mock_command):
        """Test the successful loading of data from an archive."""
        # Setup mocks
        mock_exists.return_value = True
        mock_listdir.return_value = ['2025-12-21_12-00-00']
        
        # Execute
        load_db_from_latest_archive(command=mock_command)
        
        # Assertions
        # 1 call for flush + 17 calls for loaddata = 18 calls total
        assert mock_subprocess_run.call_count == 18 
        
        stdout = mock_command.stdout.getvalue()
        assert "Loading data from latest archive" in stdout
        assert "Flushing database..." in stdout
        assert "Loading users.user.json" in stdout
        assert "Data loading from archive complete" in stdout

    def test_archive_dir_not_found(self, mock_isdir, mock_listdir, mock_exists, mock_command):
        """Test the case where the base archive directory does not exist."""
        # Mock exists to return False for the base directory check
        # The first call to exists is for base_archive_dir
        mock_exists.side_effect = [False]
        
        load_db_from_latest_archive(command=mock_command)
        
        stderr = mock_command.stderr.getvalue()
        assert "Archive directory not found" in stderr

    def test_no_archive_subdirs_found(self, mock_isdir, mock_listdir, mock_exists, mock_command):
        """Test the case where there are no archive subdirectories."""
        mock_exists.return_value = True
        mock_listdir.return_value = [] # No subdirectories
        
        load_db_from_latest_archive(command=mock_command)
        
        stderr = mock_command.stderr.getvalue()
        assert "No archive directories found" in stderr

    @patch('data_management.utils.archive_db.load_db_from_archive.subprocess.run')
    def test_flush_failure(self, mock_subprocess_run, mock_isdir, mock_listdir, mock_exists, mock_command):
        """Test the case where the flush command fails."""
        mock_exists.return_value = True
        mock_listdir.return_value = ['2025-12-21_12-00-00']
        mock_subprocess_run.side_effect = subprocess.CalledProcessError(1, 'cmd', stderr='Flush failed')
        
        load_db_from_latest_archive(command=mock_command)
        
        stderr = mock_command.stderr.getvalue()
        assert "Failed to flush database" in stderr
        assert "Flush failed" in stderr
        
    @patch('data_management.utils.archive_db.load_db_from_archive.subprocess.run')
    def test_loaddata_failure(self, mock_subprocess_run, mock_isdir, mock_listdir, mock_exists, mock_command):
        """Test the case where a loaddata command fails."""
        mock_exists.return_value = True
        mock_listdir.return_value = ['2025-12-21_12-00-00']
        
        # Make flush succeed but first loaddata (users.user.json) fail
        mock_subprocess_run.side_effect = [
            MagicMock(), # Success for flush
            subprocess.CalledProcessError(1, 'cmd', stderr='Load failed')
        ]
        
        load_db_from_latest_archive(command=mock_command)
        
        stderr = mock_command.stderr.getvalue()
        # users.user.json is the first file in load_order
        assert "Failed to load users.user.json" in stderr
        assert "Load failed" in stderr
        assert "Aborting data load" in stderr
