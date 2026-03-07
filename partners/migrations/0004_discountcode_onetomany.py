import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('partners', '0003_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='discountcode',
            name='partner',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='discount_codes',
                to='partners.partner',
            ),
        ),
    ]
