"""
Trade API views.

This module provides the REST API endpoint for querying trade data with support for:
1. Standard django-filter filtering (via query params like ?continent__in=EUROPE,ASIA)
2. Advanced composite filters (via 'filters' JSON param for OR logic and complex operators)
"""

from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.generics import ListAPIView
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny
from .models import Trade
from .serializers import TradeSerializer
from .filters import TradeFilter
from .pagination import TradeCursorPagination
from .filter_utils import build_filter_q
from .filter_serializer import parse_filters_from_query_params
import logging

logger = logging.getLogger(__name__)


class TradeListView(ListAPIView):
    """
    List view for Trade data.

    Supports two filtering modes:
    1. Standard django-filter (preferred for simple AND filters):
       ?continent__iexact=EUROPE&value_dhs__gte=10000

    2. Advanced composite filters (for OR logic, NOT operators, complex conditions):
       ?filters=[{"id":"continent","operator":"inArray","value":["EUROPE"]}]&joinOperator=or
    """

    queryset = Trade.objects.all()
    serializer_class = TradeSerializer
    pagination_class = TradeCursorPagination
    filterset_class = TradeFilter
    permission_classes = [AllowAny]

    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]

    ordering_fields = [
        "hs_product_code",
        "hs_product_label",
        "country_name",
        "continent",
        "flow_label",
        "value_dhs",
        "weight_kg",
        "date",
    ]

    ordering = ["-date"]

    def get_queryset(self):
        queryset = super().get_queryset()

        # --- Step 2a: Standard filters from django-filter ---
        # Handled automatically by DjangoFilterBackend

        # --- Step 2b: Advanced 'filters' JSON param ---
        filters_param = self.request.query_params.get("filters")
        if filters_param:
            try:
                filter_data = parse_filters_from_query_params(self.request.query_params)
                filters_list = filter_data.get("filters", [])
                join_operator = filter_data.get("joinOperator", "and")
                if filters_list:
                    filter_q = build_filter_q(filters_list, join_operator)
                    if filter_q:
                        queryset = queryset.filter(filter_q)
            except ValidationError:
                raise
            except Exception as e:
                logger.error(f"Error processing filters: {e}", exc_info=True)

        return queryset
