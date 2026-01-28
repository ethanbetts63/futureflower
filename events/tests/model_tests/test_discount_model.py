import pytest
from datetime import datetime, timedelta
from django.utils import timezone
from events.models import Discount
from events.tests.factories.discount_factory import DiscountFactory

@pytest.mark.django_db
def test_discount_creation():
    """
    Test that a discount can be created successfully.
    """
    discount = DiscountFactory()
    assert isinstance(discount, Discount)
    assert discount.code is not None
    assert discount.florist_name is not None
    assert discount.active is not None
    assert discount.date_created is not None
    # expiry_date can be None, so we don't assert it's not None

@pytest.mark.django_db
def test_discount_str_representation():
    """
    Test the __str__ method of the Discount model.
    """
    discount = DiscountFactory(code="TESTCODE123")
    assert str(discount) == "TESTCODE123"

@pytest.mark.django_db
def test_discount_active_default():
    """
    Test that 'active' field defaults to True.
    """
    discount = DiscountFactory() # Not explicitly setting active
    assert discount.active is True

@pytest.mark.django_db
def test_discount_expiry_date_nullable():
    """
    Test that 'expiry_date' field can be null.
    """
    discount = DiscountFactory(expiry_date=None)
    assert discount.expiry_date is None

@pytest.mark.django_db
def test_discount_with_expiry_date():
    """
    Test that 'expiry_date' can be set.
    """
    future_date = timezone.now() + timedelta(days=30)
    discount = DiscountFactory(expiry_date=future_date)
    assert discount.expiry_date == future_date

@pytest.mark.django_db
def test_discount_ordering():
    """
    Test that discounts are ordered by date_created in descending order.
    """
    # Create discounts with different creation times
    old_discount = DiscountFactory(date_created=timezone.now() - timedelta(days=5))
    new_discount = DiscountFactory(date_created=timezone.now() - timedelta(days=1))
    mid_discount = DiscountFactory(date_created=timezone.now() - timedelta(days=3))

    # Retrieve all discounts and check their order
    discounts = Discount.objects.all()
    assert list(discounts) == [new_discount, mid_discount, old_discount]

@pytest.mark.django_db
def test_discount_code_uniqueness():
    """
    Test that discount codes are unique.
    """
    DiscountFactory(code="UNIQUECODE")
    with pytest.raises(Exception): # Expecting an IntegrityError or similar from DB
        DiscountFactory(code="UNIQUECODE")
