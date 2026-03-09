"""
Request serializers — validate the POST body sent to /api/trades/.

TradeListRequestSerializer is the top-level entry point.  It delegates
deep filter validation to FilterItemSerializer and sort validation to
SortItemSerializer, so the ORM never sees malformed input.
"""

from rest_framework import serializers

from ..consts import ORDERING_FIELDS, MAX_TRADE_STATS_OFFSET
from .filters import FilterItemSerializer


class SortItemSerializer(serializers.Serializer):
    """A single sort directive: field name + direction."""

    id = serializers.CharField(required=True)
    desc = serializers.BooleanField(default=False)

    def validate_id(self, value: str) -> str:
        if value not in ORDERING_FIELDS:
            raise serializers.ValidationError(
                f"'{value}' is not a sortable field. "
                f"Valid values: {ORDERING_FIELDS}"
            )
        return value


class TradeListRequestSerializer(serializers.Serializer):
    """
    Validates the complete POST body for /api/trades/.

    Schema
    ------
    {
        "page":         int   (≥ 1, default 1),
        "page_size":    int   (1–200, default 10),
        "joinOperator": "and" | "or"  (default "and"),
        "filters":      FilterItem[],
        "sort":         SortItem[]
    }
    """

    page = serializers.IntegerField(min_value=1, default=1)
    page_size = serializers.IntegerField(min_value=1, max_value=50, default=10)

    joinOperator = serializers.ChoiceField(
        choices=["and", "or"],
        default="and",
        required=False,
        help_text="How to combine multiple filters: 'and' | 'or'",
    )
    filters = serializers.ListField(
        child=FilterItemSerializer(),
        required=False,
        default=list,
        help_text="List of filter objects",
    )
    sort = serializers.ListField(
        child=SortItemSerializer(),
        required=False,
        default=list,
        help_text="List of sort directives",
    )

    def validate(self, data: dict) -> dict:
        offset = (data["page"] - 1) * data["page_size"]
        if offset > MAX_TRADE_STATS_OFFSET:
            raise serializers.ValidationError(
                {
                    "page": f"Requested offset {offset} exceeds the limit of {MAX_TRADE_STATS_OFFSET}."
                }
            )
        return data
