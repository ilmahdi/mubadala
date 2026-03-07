"""Trade API views."""

import logging

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from rest_framework.generics import ListAPIView

from .models import Country, Flow, TradeFact
from .serializers import CountrySerializer, FlowSerializer, TradeFactSerializer
from .pagination import TradePagination
from .filter_utils import build_filter_q

logger = logging.getLogger(__name__)


class TradeListView(APIView):
    """POST endpoint for trade data with filtering, sorting, and pagination."""

    permission_classes = [IsAuthenticated]
    pagination_class = TradePagination

    # Map frontend field names to Django model fields
    ORDERING_FIELD_MAP = {
        "hs_product_code": "hs_product__hs_product_code",
        "country_code": "country__country_code",
        "continent": "country__continent",
        "flow_code": "flow__flow_code",
        "value_dhs": "value_dhs",
        "weight_kg": "weight_kg",
        "trade_date": "trade_date",
        "date": "trade_date",
    }

    def post(self, request):
        try:
            filters_list = request.data.get("filters", [])
            join_operator = request.data.get("joinOperator", "and")
            sort_list = request.data.get("sort", [])
        except Exception:
            raise ValidationError("Invalid request body format")

        queryset = TradeFact.objects.select_related(
            "hs_product",
            "usage_group",
            "remarkable_product",
            "ctci",
            "country",
            "flow",
        )

        # Apply filters
        if filters_list:
            filter_q = build_filter_q(filters_list, join_operator)
            if filter_q:
                queryset = queryset.filter(filter_q)

        # Apply ordering
        ordering = self.build_ordering(sort_list)
        if ordering:
            queryset = queryset.order_by(*ordering)
        else:
            queryset = queryset.order_by("-trade_date", "id")

        # Paginate
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, request, view=self)

        serializer = TradeFactSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    def build_ordering(self, sort_list):
        """Convert frontend sort format to Django ORM ordering."""
        ordering = []

        for sort_item in sort_list:
            field_id = sort_item.get("id")
            desc = sort_item.get("desc", False)

            model_field = self.ORDERING_FIELD_MAP.get(field_id)
            if not model_field:
                continue

            if desc:
                model_field = f"-{model_field}"

            ordering.append(model_field)

        return ordering


class CountryListAPIView(ListAPIView):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None


class FlowListAPIView(ListAPIView):
    queryset = Flow.objects.all()
    serializer_class = FlowSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None
