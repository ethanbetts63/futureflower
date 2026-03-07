from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('partners', '0004_discountcode_onetomany'),
    ]

    operations = [
        migrations.AlterField(
            model_name='discountcode',
            name='code',
            field=models.CharField(max_length=30, unique=True),
        ),
    ]
