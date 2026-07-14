# Generated manually for the guest checkout capability.
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ('events', '0007_alter_orderbase_frequency'),
    ]

    operations = [
        migrations.CreateModel(
            name='CheckoutSession',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('token_hash', models.CharField(editable=False, max_length=64, unique=True)),
                ('customer_email', models.EmailField(blank=True, max_length=254)),
                ('expires_at', models.DateTimeField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('order', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='checkout_session', to='events.orderbase')),
            ],
        ),
    ]
