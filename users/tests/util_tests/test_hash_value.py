import pytest
from users.utils.hash_value import hash_value

def test_hash_value_success():
    """
    Test that hash_value returns a non-empty string for valid inputs.
    """
    value = "test_value"
    salt = "secret_salt"
    hashed = hash_value(value, salt)
    assert isinstance(hashed, str)
    assert len(hashed) > 0

def test_hash_value_consistency():
    """
    Test that hash_value returns the same hash for the same input and salt.
    """
    value = "consistent_value"
    salt = "consistent_salt"
    hash1 = hash_value(value, salt)
    hash2 = hash_value(value, salt)
    assert hash1 == hash2

def test_hash_value_different_inputs():
    """
    Test that different inputs produce different hashes with the same salt.
    """
    value1 = "value1"
    value2 = "value2"
    salt = "common_salt"
    hash1 = hash_value(value1, salt)
    hash2 = hash_value(value2, salt)
    assert hash1 != hash2

def test_hash_value_different_salts():
    """
    Test that the same input produces different hashes with different salts.
    """
    value = "common_value"
    salt1 = "salt1"
    salt2 = "salt2"
    hash1 = hash_value(value, salt1)
    hash2 = hash_value(value, salt2)
    assert hash1 != hash2

def test_hash_value_invalid_input_non_string_value():
    """
    Test that hash_value handles non-string value input gracefully (returns empty string).
    """
    value = 123
    salt = "salt"
    # The function expects strings and checks with isinstance
    hashed = hash_value(value, salt) # type: ignore
    assert hashed == ""

def test_hash_value_invalid_input_non_string_salt():
    """
    Test that hash_value handles non-string salt input gracefully (returns empty string).
    """
    value = "value"
    salt = 123
    hashed = hash_value(value, salt) # type: ignore
    assert hashed == ""
