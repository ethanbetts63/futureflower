import pytest
from django.db import IntegrityError
from events.tests.factories.flower_type_factory import FlowerTypeFactory
from events.models import FlowerType


@pytest.mark.django_db
class TestFlowerTypeModel:

    def test_str_representation(self):
        ft = FlowerTypeFactory(name='Roses')
        assert str(ft) == 'Roses'

    def test_name_must_be_unique(self):
        FlowerTypeFactory(name='Tulips')
        with pytest.raises(IntegrityError):
            FlowerType.objects.create(name='Tulips')

    def test_tagline_can_be_set(self):
        ft = FlowerTypeFactory()
        ft.tagline = 'Fresh and beautiful'
        ft.save()
        ft.refresh_from_db()
        assert ft.tagline == 'Fresh and beautiful'

    def test_factory_get_or_create_by_name(self):
        ft1 = FlowerTypeFactory(name='Orchids')
        ft2 = FlowerTypeFactory(name='Orchids')
        assert ft1.pk == ft2.pk

    def test_name_max_length(self):
        ft = FlowerTypeFactory(name='A' * 100)
        ft.refresh_from_db()
        assert len(ft.name) == 100

    def test_flower_type_can_be_created(self):
        ft = FlowerTypeFactory(name='Daisies')
        assert ft.pk is not None
        assert ft.name == 'Daisies'
