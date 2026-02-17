from django.contrib.auth import get_user_model
from partners.models.partner import Partner
from partners.models.discount_code import DiscountCode

User = get_user_model()

ADMIN_USER = {
    'username': 'ethanbetts63@gmail.com',
    'email': 'ethanbetts63@gmail.com',
    'first_name': 'Ethan',
    'last_name': 'Betts',
    'is_superuser': True,
    'is_staff': True,
    'is_active': True,
}

ADMIN_PARTNER = {
    'partner_type': 'delivery',
    'status': 'active',
    'business_name': 'FutureFlower',
    'phone': '0423853830',
    'street_address': '78 Harold Street',
    'suburb': 'Dianella',
    'city': 'Dianella',
    'state': 'WA',
    'postcode': '6059',
    'country': 'Australia',
    'latitude': -32.201181266339276,
    'longitude': 115.78903198242189,
    'service_radius_km': 145,
}

ADMIN_DISCOUNT_CODE = {
    'code': 'owner',
    'discount_amount': 5.00,
    'is_active': True,
}


class AdminUserGenerator:
    def __init__(self, command, password):
        self.command = command
        self.password = password

    def run(self):
        # Create or update user
        user, created = User.objects.update_or_create(
            username=ADMIN_USER['username'],
            defaults=ADMIN_USER,
        )
        user.set_password(self.password)
        user.save()
        if created:
            self.command.stdout.write(f"Created admin user: {user.email}")
        else:
            self.command.stdout.write(f"Updated admin user: {user.email}")

        # Create or update partner
        partner, created = Partner.objects.update_or_create(
            user=user,
            defaults=ADMIN_PARTNER,
        )
        if created:
            self.command.stdout.write(f"Created partner: {partner.business_name}")
        else:
            self.command.stdout.write(f"Updated partner: {partner.business_name}")

        # Create or update discount code
        discount_code, created = DiscountCode.objects.update_or_create(
            partner=partner,
            defaults=ADMIN_DISCOUNT_CODE,
        )
        if created:
            self.command.stdout.write(f"Created discount code: {discount_code.code}")
        else:
            self.command.stdout.write(f"Updated discount code: {discount_code.code}")

        self.command.stdout.write(self.command.style.SUCCESS("Admin user setup complete."))
