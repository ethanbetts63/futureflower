from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("events", "0004_remove_hash_recipient_street_address"),
    ]

    operations = [
        migrations.AddField(
            model_name="event",
            name="commission_amount",
            field=models.DecimalField(
                blank=True,
                decimal_places=2,
                help_text="Snapshotted commission amount for this delivery, set at creation.",
                max_digits=10,
                null=True,
            ),
        ),
    ]
