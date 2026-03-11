"""Trade API views."""

import logging

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from rest_framework.generics import ListAPIView

from .models import Country, Flow, TradeFact
from .serializers import (
    CountrySerializer,
    FlowSerializer,
    TradeFactSerializer,
    TradeListRequestSerializer,
)
from .pagination import TradePagination
from .filter_utils import build_filter_q
from .consts import FIELD_MAPPING
from .throttles import TradeBurstThrottle, TradeSustainedThrottle

logger = logging.getLogger(__name__)


def _build_ordering(sort_list: list) -> list[str]:
    """Convert validated sort directives to Django ORM ordering strings."""
    ordering = []
    for item in sort_list:
        orm_field = FIELD_MAPPING.get(item["id"])
        if not orm_field:
            continue
        ordering.append(f"-{orm_field}" if item.get("desc") else orm_field)
    return ordering


class TradeListView(APIView):
    """POST endpoint for trade data with filtering, sorting, and pagination."""

    permission_classes = [IsAuthenticated]
    pagination_class = TradePagination
    throttle_classes = [TradeBurstThrottle, TradeSustainedThrottle]

    def post(self, request):
        req_serializer = TradeListRequestSerializer(data=request.data)
        req_serializer.is_valid(raise_exception=True)
        params = req_serializer.validated_data

        filters_list = params["filters"]
        join_operator = params["joinOperator"]
        sort_list = params["sort"]

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
        ordering = _build_ordering(sort_list)
        queryset = (
            queryset.order_by(*ordering)
            if ordering
            else queryset.order_by("-trade_date", "id")
        )

        # Paginate
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, request, view=self)

        serializer = TradeFactSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)


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
