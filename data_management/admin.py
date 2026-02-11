from django.contrib import admin
from .models import BlockedEmail, TermsAndConditions

admin.site.register(BlockedEmail)
admin.site.register(TermsAndConditions)
