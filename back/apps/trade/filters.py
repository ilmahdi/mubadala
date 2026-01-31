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
            "hs_product_code": ["startswith", "iexact"],
            "hs_product_label": ["icontains", "iexact"],
            "flow_label": ["iexact", "in"],
            "country_name": ["iexact", "in", "icontains"],
            "continent": ["iexact", "in"],
            "date": ["exact", "gte", "lte", "year", "month"],
            "value_dhs": ["exact", "gte", "lte", "gt", "lt"],
            "year": ["exact"],
            "month": ["exact"],
        }
