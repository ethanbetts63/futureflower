import factory
from factory.django import DjangoModelFactory
from partners.models import Partner
from users.tests.factories.user_factory import UserFactory

class PartnerFactory(DjangoModelFactory):
    class Meta:
        model = Partner

    user = factory.SubFactory(UserFactory)
    partner_type = 'non_delivery'
    status = 'active'
    business_name = factory.Faker('company')
    phone = factory.Faker('phone_number')
