from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.generics import ListAPIView
from .models import Trade
from .serializers import TradeSerializer
from .filters import TradeFilter
from .pagination import TradeCursorPagination
from django.db.models import F


class TradeListView(ListAPIView):
    queryset = Trade.objects.all()

    serializer_class = TradeSerializer
    pagination_class = TradeCursorPagination
    filterset_class = TradeFilter

    filter_backends = [
        DjangoFilterBackend,
        filters.OrderingFilter,
    ]

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
    ]

    ordering = ["-date"]
