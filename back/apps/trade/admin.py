"""
Django admin configuration for Trade models.
"""

from django.contrib import admin
from .models import (
    TradeFact,
    HsProduct,
    UsageGroup,
    RemarkableProduct,
    Ctci,
    Country,
    Flow,
    ProcessedFile,
)


@admin.register(TradeFact)
class TradeFactAdmin(admin.ModelAdmin):
    """Admin for TradeFact with optimized querysets."""

    list_display = (
        "id",
        "get_hs_product_code",
        "get_hs_product_label",
        "get_country_name",
        "trade_date",
        "weight_kg",
        "value_dhs",
    )
    list_filter = ("trade_date", "country__continent", "flow__flow_label")
    search_fields = (
        "hs_product__hs_product_code",
        "hs_product__hs_product_label",
        "country__country_name",
    )
    date_hierarchy = "trade_date"
    list_per_page = 50

    def get_queryset(self, request):
        """Optimize queryset with select_related."""
        qs = super().get_queryset(request)
        return qs.select_related(
            "hs_product",
            "usage_group",
            "remarkable_product",
            "ctci",
            "country",
            "flow",
        )

    @admin.display(
        description="HS Product Code", ordering="hs_product__hs_product_code"
    )
    def get_hs_product_code(self, obj):
        return obj.hs_product.hs_product_code if obj.hs_product else "-"

    @admin.display(
        description="HS Product Label", ordering="hs_product__hs_product_label"
    )
    def get_hs_product_label(self, obj):
        return obj.hs_product.hs_product_label if obj.hs_product else "-"

    @admin.display(description="Country", ordering="country__country_name")
    def get_country_name(self, obj):
        return obj.country.country_name if obj.country else "-"


@admin.register(HsProduct)
class HsProductAdmin(admin.ModelAdmin):
    """Admin for HS Product dimension."""

    list_display = (
        "hs_product_code",
        "hs_product_label",
        "hs_chapter_code",
        "hs_chapter_label",
    )
    search_fields = ("hs_product_code", "hs_product_label", "hs_chapter_label")
    list_filter = ("hs_chapter_code",)


@admin.register(UsageGroup)
class UsageGroupAdmin(admin.ModelAdmin):
    """Admin for Usage Group dimension."""

    list_display = ("usage_group_code", "usage_group_label")
    search_fields = ("usage_group_code", "usage_group_label")


@admin.register(RemarkableProduct)
class RemarkableProductAdmin(admin.ModelAdmin):
    """Admin for Remarkable Product dimension."""

    list_display = ("remarkable_product_code", "remarkable_product_label")
    search_fields = ("remarkable_product_code", "remarkable_product_label")


@admin.register(Ctci)
class CtciAdmin(admin.ModelAdmin):
    """Admin for CTCI dimension."""

    list_display = (
        "ctci_group_code",
        "ctci_group_label",
        "ctci_division_code",
        "ctci_section_code",
    )
    search_fields = (
        "ctci_group_code",
        "ctci_group_label",
        "ctci_division_label",
        "ctci_section_label",
    )
    list_filter = ("ctci_section_code", "ctci_division_code")


@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    """Admin for Country dimension."""

    list_display = ("country_code", "country_name", "continent")
    search_fields = ("country_code", "country_name")
    list_filter = ("continent",)


@admin.register(Flow)
class FlowAdmin(admin.ModelAdmin):
    """Admin for Flow dimension."""

    list_display = ("flow_code", "flow_label")
    search_fields = ("flow_code", "flow_label")


@admin.register(ProcessedFile)
class ProcessedFileAdmin(admin.ModelAdmin):
    """Admin for ETL tracking."""

    list_display = ("filename", "processed_at")
    ordering = ("-processed_at",)
