import factory
from factory.django import DjangoModelFactory
from partners.models import Commission
from .partner_factory import PartnerFactory
from payments.tests.factories.payment_factory import PaymentFactory

class CommissionFactory(DjangoModelFactory):
    class Meta:
        model = Commission

    partner = factory.SubFactory(PartnerFactory)
    payment = factory.SubFactory(PaymentFactory)
    commission_type = 'referral'
    amount = factory.Faker('pydecimal', left_digits=2, right_digits=2, min_value=1, max_value=50)
    status = 'pending'
