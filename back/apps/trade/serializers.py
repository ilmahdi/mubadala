"""
Serializers for Trade API.

TradeFactSerializer flattens dimension fields to maintain backwards compatibility
with the frontend, which expects a flat structure with 28 fields.
"""

from rest_framework import serializers
from .models import (
    Country,
    Flow,
    TradeFact,
    HsProduct,
    UsageGroup,
    RemarkableProduct,
    Ctci,
)


class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    """
    Base serializer that supports dynamic field selection via ?fields=id,name,value.

    Allows clients to request only needed fields to reduce payload size.
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        request = self.context.get("request")
        if not request:
            return

        fields_param = request.query_params.get("fields")
        if not fields_param:
            return

        allowed = set(fields_param.split(","))
        existing = set(self.fields.keys())

        for field_name in existing - allowed:
            self.fields.pop(field_name)


class TradeFactSerializer(DynamicFieldsModelSerializer):
    """
    Serializer for TradeFact model with flattened dimension fields.

    Exposes all 28 fields from the star schema as a flat structure to maintain
    API compatibility with the frontend. Uses SerializerMethodField to extract
    dimension attributes from related models.
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

    # Country fields
    country_code = serializers.CharField(source="country.country_code", read_only=True)
    country_name = serializers.CharField(source="country.country_name", read_only=True)
    continent = serializers.CharField(source="country.continent", read_only=True)

    # Flow fields
    flow_code = serializers.CharField(source="flow.flow_code", read_only=True)
    flow_label = serializers.CharField(source="flow.flow_label", read_only=True)

    # Rename trade_date to date for backwards compatibility
    date = serializers.DateField(source="trade_date", read_only=True)

    class Meta:
        model = TradeFact
        fields = [
            "id",
            # HS Product (4 fields)
            "hs_product_code",
            "hs_product_label",
            "hs_chapter_code",
            "hs_chapter_label",
            # Usage Group (2 fields)
            "usage_group_code",
            "usage_group_label",
            # Remarkable Product (2 fields)
            "remarkable_product_code",
            "remarkable_product_label",
            # CTCI (6 fields)
            "ctci_section_code",
            "ctci_section_label",
            "ctci_division_code",
            "ctci_division_label",
            "ctci_group_code",
            "ctci_group_label",
            # Country (3 fields)
            "country_code",
            "country_name",
            "continent",
            # Flow (2 fields)
            "flow_code",
            "flow_label",
            # Metrics (3 fields)
            "weight_kg",
            "value_dhs",
            "supplementary_unit",
            # Time (1 field)
            "date",
        ]


class CountrySerializer(serializers.ModelSerializer):
    """Serializer for Country dimension."""

    class Meta:
        model = Country
        fields = ["country_code", "country_name", "continent"]


class FlowSerializer(serializers.ModelSerializer):
    """Serializer for Flow dimension."""

    class Meta:
        model = Flow
        fields = ["flow_code", "flow_label"]
