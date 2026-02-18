from django.contrib import admin
from .models import BlockedEmail, TermsAndConditions, Notification


admin.site.register(BlockedEmail)
admin.site.register(TermsAndConditions)


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['recipient_type', 'channel', 'status', 'scheduled_for', 'related_event']
    list_filter = ['status', 'channel', 'recipient_type']
