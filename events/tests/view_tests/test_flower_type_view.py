import pytest
from rest_framework.test import APIClient
from events.tests.factories.flower_type_factory import FlowerTypeFactory

@pytest.mark.django_db
class TestFlowerTypeViewSet:
    def setup_method(self):
        self.client = APIClient()
        self.url = '/api/events/flower-types/'

    def test_list_flower_types(self):
        FlowerTypeFactory(name="Rose")
        FlowerTypeFactory(name="Lily")
        
        response = self.client.get(self.url)
        assert response.status_code == 200
        assert len(response.data) == 2
        names = [item['name'] for item in response.data]
        assert "Rose" in names
        assert "Lily" in names
