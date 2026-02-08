"""
Django-filter FilterSet for Trade model.

This module defines the standard django-filter FilterSet for basic field filtering.
For advanced composite filters (AND/OR logic, complex operators), see views.py
which applies Q objects directly to the queryset.
"""

from django_filters import rest_framework as filters
from django_filters import CharFilter, NumberFilter, DateFilter, ChoiceFilter
from django.db.models import Q
from .models import Trade


class TradeFilter(filters.FilterSet):
    """
    Standard django-filter FilterSet for Trade model.

    Provides basic field filtering with common lookup expressions.
    Advanced filters (OR joins, NOT operators) are handled separately
    in the view layer using Q objects.
    """

    # Standard field filters using django-filter's declarative syntax
    # These handle simple query params like: ?continent=EUROPE&value_dhs__gte=10000
    class Meta:
        model = Trade
        fields = {
            "hs_product_code": ["exact"],
            "date": ["exact", "gte", "lte"],
            "country_code": ["iexact", "in"],
            "continent": ["iexact", "in"],
            "flow_code": ["exact", "in"],
            "hs_chapter_code": ["startswith", "iexact"],
            "remarkable_product_code": ["startswith", "iexact"],
            "usage_group_code": ["startswith", "iexact"],
            "ctci_section_code": ["startswith", "iexact"],
            "ctci_division_code": ["startswith", "iexact"],
            "ctci_group_code": ["startswith", "iexact"],
            "value_dhs": ["gte", "lte", "gt", "lt"],
            "weight_kg": ["gte", "lte", "gt", "lt"],
        }
