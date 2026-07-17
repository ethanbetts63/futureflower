from django.db import migrations, models


def copy_draft_message_to_card_message(apps, schema_editor):
    """
    draft_card_messages only ever held a single entry under key '0'; lift it onto
    the new scalar field so in-flight drafts keep their message.
    """
    OrderBase = apps.get_model('events', 'OrderBase')
    for order in OrderBase.objects.exclude(draft_card_messages={}).iterator():
        message = (order.draft_card_messages or {}).get('0', '')
        if message:
            order.card_message = message
            order.save(update_fields=['card_message'])


def restore_draft_card_messages(apps, schema_editor):
    OrderBase = apps.get_model('events', 'OrderBase')
    for order in OrderBase.objects.exclude(card_message=None).iterator():
        if order.card_message:
            order.draft_card_messages = {'0': order.card_message}
            order.save(update_fields=['draft_card_messages'])


class Migration(migrations.Migration):

    dependencies = [
        ("events", "0009_remove_orderbase_preferred_flower_types_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="orderbase",
            name="card_message",
            field=models.TextField(
                blank=True,
                null=True,
                help_text=(
                    "Card message for a one-off delivery, staged before payment and copied "
                    "onto the Event when it is created. Subscriptions are delivered without "
                    "a card message, so this is ignored when billing_mode is 'recurring'."
                ),
            ),
        ),
        migrations.RunPython(
            copy_draft_message_to_card_message,
            restore_draft_card_messages,
        ),
        migrations.RemoveField(
            model_name="orderbase",
            name="draft_card_messages",
        ),
        migrations.RemoveField(
            model_name="orderbase",
            name="subscription_message",
        ),
    ]
