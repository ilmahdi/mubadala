from django_filters import rest_framework as filters
from .models import Trade


class TradeFilter(filters.FilterSet):

    class Meta:
        model = Trade
        fields = {
            "hs_product_code": ["startswith"],
            "hs_product_label": ["icontains"],
            "flow_label": ["iexact"],
            "country_name": ["iexact"],
            "continent": ["iexact"],
            "date": ["exact", "gte", "lte"],
            "value_dhs": ["gte", "lte"],
            "weight_kg": ["gte", "lte"],
        }
