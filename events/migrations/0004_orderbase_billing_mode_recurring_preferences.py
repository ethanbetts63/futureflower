from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0003_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='orderbase',
            name='billing_mode',
            field=models.CharField(
                blank=True,
                choices=[
                    ('one_time', 'One-time'),
                    ('recurring', 'Recurring'),
                    ('prepaid', 'Prepaid'),
                ],
                help_text='How this order is billed: one-time, recurring, or prepaid.',
                max_length=20,
                null=True,
            ),
        ),
        migrations.AddField(
            model_name='orderbase',
            name='recurring_preferences',
            field=models.TextField(
                blank=True,
                help_text='Optional instructions for recurring deliveries, such as variation or seasonal preferences.',
                null=True,
            ),
        ),
    ]
