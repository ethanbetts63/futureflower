from django.contrib import admin
from .models import Event, OrderBase, UpfrontPlan, FlowerType

admin.site.register(Event)
admin.site.register(OrderBase)
admin.site.register(UpfrontPlan)
admin.site.register(FlowerType)

