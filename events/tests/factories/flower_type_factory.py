import factory
from factory.django import DjangoModelFactory
from events.models import FlowerType

class FlowerTypeFactory(DjangoModelFactory):
    class Meta:
        model = FlowerType
        django_get_or_create = ('name',)

    name = factory.Faker('word')
