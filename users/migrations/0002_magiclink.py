from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [('events', '0008_checkoutsession'), ('users', '0001_initial')]

    operations = [
        migrations.CreateModel(
            name='MagicLink',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('token_hash', models.CharField(editable=False, max_length=64, unique=True)),
                ('expires_at', models.DateTimeField()),
                ('used_at', models.DateTimeField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('order', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='magic_links', to='events.orderbase')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='magic_links', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
