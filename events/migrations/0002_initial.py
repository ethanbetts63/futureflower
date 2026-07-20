
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("events", "0001_initial"),
        ("partners", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="order",
            name="discount_code",
            field=models.ForeignKey(
                blank=True,
                help_text="The discount code applied to this order.",
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="partners.discountcode",
            ),
        ),
    ]
