import factory
from factory.django import DjangoModelFactory
from users.models import User
from faker import Faker
from data_management.tests.factories.terms_and_conditions_factory import TermsAndConditionsFactory

fake = Faker()

class UserFactory(DjangoModelFactory):
    class Meta:
        model = User
        django_get_or_create = ('username',)

    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    username = factory.Faker('user_name')
    email = factory.Faker('email')
    
    @factory.post_generation
    def password(self, create, extracted, **kwargs):
        """
        Handles password setting. If a password is provided to the factory,
        it's used. Otherwise, a default password 'password' is set.
        """
        password = extracted if extracted else 'password'
        self.set_password(password)

    is_active = True
    country_code = factory.Faker('country_code')
    phone = factory.LazyFunction(lambda: fake.numerify(text='##########'))
    backup_email = factory.Faker('email')
    facebook_handle = factory.Faker('user_name')
    instagram_handle = factory.Faker('user_name')
    snapchat_handle = factory.Faker('user_name')
    x_handle = factory.Faker('user_name')
    agreed_to_terms = factory.SubFactory(TermsAndConditionsFactory)
