from django.contrib import admin
from .models import Event, OrderBase, FlowerType

admin.site.register(Event)
admin.site.register(OrderBase)
admin.site.register(FlowerType)

