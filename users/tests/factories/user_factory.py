import factory
from factory.django import DjangoModelFactory
from users.models import User
from faker import Faker

fake = Faker()

class UserFactory(DjangoModelFactory):
    class Meta:
        model = User
        django_get_or_create = ('username',)
        skip_postgeneration_save = True

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
