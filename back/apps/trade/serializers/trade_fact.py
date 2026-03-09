"""
Serializers for Trade API.
"""

from rest_framework import serializers
from ..models import (
    TradeFact,
)


class TradeFactSerializer(serializers.ModelSerializer):
    """
    Serializer for TradeFact model with flattened dimension fields.
    """

    # HS Product fields
    hs_product_code = serializers.CharField(
        source="hs_product.hs_product_code", read_only=True
    )
    hs_product_label = serializers.CharField(
        source="hs_product.hs_product_label", read_only=True
    )
    hs_chapter_code = serializers.CharField(
        source="hs_product.hs_chapter_code", read_only=True
    )
    hs_chapter_label = serializers.CharField(
        source="hs_product.hs_chapter_label", read_only=True
    )

    # Usage Group fields
    usage_group_code = serializers.CharField(
        source="usage_group.usage_group_code", read_only=True
    )
    usage_group_label = serializers.CharField(
        source="usage_group.usage_group_label", read_only=True
    )

    # Remarkable Product fields
    remarkable_product_code = serializers.CharField(
        source="remarkable_product.remarkable_product_code", read_only=True
    )
    remarkable_product_label = serializers.CharField(
        source="remarkable_product.remarkable_product_label", read_only=True
    )

    # CTCI fields
    ctci_section_code = serializers.CharField(
        source="ctci.ctci_section_code", read_only=True
    )
    ctci_section_label = serializers.CharField(
        source="ctci.ctci_section_label", read_only=True
    )
    ctci_division_code = serializers.CharField(
        source="ctci.ctci_division_code", read_only=True
    )
    ctci_division_label = serializers.CharField(
        source="ctci.ctci_division_label", read_only=True
    )
    ctci_group_code = serializers.CharField(
        source="ctci.ctci_group_code", read_only=True
    )
    ctci_group_label = serializers.CharField(
        source="ctci.ctci_group_label", read_only=True
    )

    country_code = serializers.CharField(source="country.country_code", read_only=True)
    country_name = serializers.CharField(source="country.country_name", read_only=True)
    continent = serializers.CharField(source="country.continent", read_only=True)

    flow_code = serializers.CharField(source="flow.flow_code", read_only=True)
    flow_label = serializers.CharField(source="flow.flow_label", read_only=True)

    date = serializers.DateField(source="trade_date", read_only=True)

    class Meta:
        model = TradeFact
        fields = [
            "id",
            "hs_product_code",
            "hs_product_label",
            "hs_chapter_code",
            "hs_chapter_label",
            "usage_group_code",
            "usage_group_label",
            "remarkable_product_code",
            "remarkable_product_label",
            "ctci_section_code",
            "ctci_section_label",
            "ctci_division_code",
            "ctci_division_label",
            "ctci_group_code",
            "ctci_group_label",
            "country_code",
            "country_name",
            "continent",
            "flow_code",
            "flow_label",
            "weight_kg",
            "value_dhs",
            "supplementary_unit",
            "date",
        ]
