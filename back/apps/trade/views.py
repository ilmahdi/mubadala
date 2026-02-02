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
        "supplementary_unit",
        "date",
        "year",
        "month",
    ]

    ordering = ["-date"]

    def get_queryset(self):
        """
        Apply filters to queryset.

        Standard django-filter params are applied automatically by DjangoFilterBackend.
        Advanced 'filters' JSON parameter requires manual Q object construction.
        """
        queryset = super().get_queryset()

        # Check for advanced composite filters
        filters_param = self.request.query_params.get("filters")
        if not filters_param:
            return queryset

        try:
            # Parse and validate filter JSON
            filter_data = parse_filters_from_query_params(self.request.query_params)
            filters_list = filter_data.get("filters", [])
            join_operator = filter_data.get("joinOperator", "and")

            # Build and apply Q object
            if filters_list:
                filter_q = build_filter_q(filters_list, join_operator)
                if filter_q:
                    queryset = queryset.filter(filter_q)

        except ValidationError:
            # Re-raise validation errors for proper 400 response
            raise
        except Exception as e:
            # Log unexpected errors but don't fail the request
            logger.error(f"Error processing filters: {e}", exc_info=True)

        return queryset
