import factory
from factory.django import DjangoModelFactory
from partners.models import DiscountCode
from .partner_factory import PartnerFactory

class DiscountCodeFactory(DjangoModelFactory):
    class Meta:
        model = DiscountCode
        django_get_or_create = ('code',)

    partner = factory.SubFactory(PartnerFactory)
    code = factory.LazyAttribute(lambda o: DiscountCode.generate_code(o.partner.business_name))
    discount_amount = factory.Faker('pydecimal', left_digits=2, right_digits=2, min_value=5, max_value=20)
    is_active = True
