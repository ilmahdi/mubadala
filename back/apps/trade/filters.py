"""
Django-filter FilterSet for TradeFact model with star schema.

This module defines the standard django-filter FilterSet for basic field filtering.
Uses Django's __ (double underscore) syntax to filter across dimension relationships.
For advanced composite filters (AND/OR logic, complex operators), see views.py
which applies Q objects directly to the queryset.
"""

from django_filters import rest_framework as filters
from .models import TradeFact


class TradeFactFilter(filters.FilterSet):
    """
    Standard django-filter FilterSet for TradeFact model with dimension lookups.

    Provides basic field filtering with common lookup expressions using Django's
    relationship traversal syntax (e.g., hs_product__hs_chapter_code).
    Advanced filters (OR joins, NOT operators) are handled separately
    in the view layer using Q objects.
    """

    class Meta:
        model = TradeFact
        fields = {
            # HS Product dimension filters
            "hs_product__hs_product_code": ["exact", "startswith", "icontains"],
            "hs_product__hs_product_label": ["icontains"],
            "hs_product__hs_chapter_label": ["icontains"],
            "hs_product__hs_chapter_code": ["startswith", "iexact"],
            # Usage Group dimension filters
            "usage_group__usage_group_code": ["startswith", "iexact"],
            # Remarkable Product dimension filters
            "remarkable_product__remarkable_product_code": ["startswith", "iexact"],
            # CTCI dimension filters
            "ctci__ctci_section_code": ["startswith", "iexact"],
            "ctci__ctci_division_code": ["startswith", "iexact"],
            "ctci__ctci_group_code": ["startswith", "iexact"],
            # Country dimension filters
            "country__country_code": ["iexact", "in"],
            "country__continent": ["iexact", "in"],
            # Flow dimension filters
            "flow__flow_code": ["exact", "in"],
            # Fact table metric filters
            "value_dhs": ["gte", "lte", "gt", "lt"],
            "weight_kg": ["gte", "lte", "gt", "lt"],
            # Time dimension filters
            "trade_date": ["exact", "gte", "lte"],
        }
