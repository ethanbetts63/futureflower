import pytest
from events.serializers.preferences_serializers import FlowerTypeSerializer
from events.tests.factories.flower_type_factory import FlowerTypeFactory


@pytest.mark.django_db
class TestFlowerTypeSerializer:

    def test_includes_all_fields(self):
        ft = FlowerTypeFactory()
        data = FlowerTypeSerializer(ft).data
        assert 'id' in data
        assert 'name' in data
        assert 'tagline' in data

    def test_serializes_name_correctly(self):
        ft = FlowerTypeFactory(name='Sunflowers')
        data = FlowerTypeSerializer(ft).data
        assert data['name'] == 'Sunflowers'

    def test_serializes_tagline(self):
        ft = FlowerTypeFactory()
        ft.tagline = 'Bright and cheerful'
        ft.save()
        data = FlowerTypeSerializer(ft).data
        assert data['tagline'] == 'Bright and cheerful'

    def test_id_matches_instance(self):
        ft = FlowerTypeFactory()
        data = FlowerTypeSerializer(ft).data
        assert data['id'] == ft.pk

    def test_serializes_many(self):
        FlowerTypeFactory(name='Roses')
        FlowerTypeFactory(name='Tulips')
        from events.models import FlowerType
        all_types = FlowerType.objects.all()
        data = FlowerTypeSerializer(all_types, many=True).data
        assert len(data) >= 2
