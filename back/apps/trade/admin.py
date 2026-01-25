from django.contrib import admin
from .models import Trade, ProcessedFile


@admin.register(Trade)
class TradeAdmin(admin.ModelAdmin):
    list_display = (
        "hs_product_code",
        "hs_product_label",
        "country_name",
        "year",
        "month",
        "weight_kg",
        "value_dhs",
    )
    list_filter = ("year", "month", "continent", "country_name")
    search_fields = ("hs_product_code", "hs_product_label", "country_name")


@admin.register(ProcessedFile)
class ProcessedFileAdmin(admin.ModelAdmin):
    list_display = ("filename", "processed_at")
