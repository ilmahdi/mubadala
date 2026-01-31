"""
Filter serializer for validating and processing filter query parameters.

This module provides serialization and validation for the advanced filter
parameters sent from the frontend data table component.
"""

from rest_framework import serializers
from typing import Any, Dict, List


class FilterItemSerializer(serializers.Serializer):
    """Serializer for a single filter item."""

    id = serializers.CharField(required=True, help_text="Field name to filter on")
    # Value can be string, list, or null - we'll handle it in to_internal_value
    value = serializers.JSONField(
        required=False,
        allow_null=True,
        help_text="Filter value (can be string, array, or null)",
    )
    variant = serializers.ChoiceField(
        choices=[
            "text",
            "number",
            "range",
            "date",
            "dateRange",
            "boolean",
            "select",
            "multiSelect",
        ],
        required=True,
        help_text="Type of filter",
    )
    operator = serializers.ChoiceField(
        choices=[
            "iLike",
            "notILike",
            "eq",
            "ne",
            "inArray",
            "notInArray",
            "isEmpty",
            "isNotEmpty",
            "lt",
            "lte",
            "gt",
            "gte",
            "isBetween",
            "isRelativeToToday",
        ],
        required=True,
        help_text="Filter operator",
    )
    filterId = serializers.CharField(
        required=True, help_text="Unique identifier for this filter"
    )

    def validate(self, attrs: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate filter item.

        Ensures that operators like 'isBetween' have appropriate values.
        """
        operator = attrs.get("operator")
        value = attrs.get("value")
        variant = attrs.get("variant")

        # For isEmpty and isNotEmpty, value is not required
        if operator in ["isEmpty", "isNotEmpty"]:
            attrs["value"] = None
            return attrs

        # For isBetween, we expect an array-like value
        if operator == "isBetween":
            if not value:
                raise serializers.ValidationError(
                    {"value": "Value is required for 'isBetween' operator"}
                )

        return attrs

    def to_internal_value(self, data: Any) -> Dict[str, Any]:
        """
        Convert incoming data to internal representation.

        Handles conversion of array values for multiSelect filters.
        """
        internal = super().to_internal_value(data)

        # Get the value - it's already parsed by JSONField
        value = internal.get("value")
        operator = internal.get("operator")
        variant = internal.get("variant")

        # Ensure value is in the correct format based on operator/variant
        if operator in ["inArray", "notInArray"] and value:
            # Ensure it's a list
            if not isinstance(value, list):
                if isinstance(value, str):
                    internal["value"] = [
                        v.strip() for v in value.split(",") if v.strip()
                    ]
                else:
                    internal["value"] = [str(value)]

        if operator == "isBetween" and value:
            # Ensure it's a list of exactly 2 items
            if not isinstance(value, list):
                raise serializers.ValidationError(
                    {"value": "isBetween operator requires an array of two values"}
                )
            if len(value) != 2:
                raise serializers.ValidationError(
                    {"value": "isBetween operator requires exactly two values"}
                )

        return internal


class FilterQuerySerializer(serializers.Serializer):
    """Serializer for the complete filter query parameters."""

    filters = serializers.ListField(
        child=FilterItemSerializer(),
        required=False,
        default=list,
        help_text="List of filter specifications",
    )
    joinOperator = serializers.ChoiceField(
        choices=["and", "or"],
        default="and",
        required=False,
        help_text="How to combine multiple filters",
    )

    def validate_filters(self, value: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Validate filters list."""
        if not isinstance(value, list):
            raise serializers.ValidationError("Filters must be a list")

        return value


def parse_filters_from_query_params(query_params: Dict[str, Any]) -> Dict[str, Any]:
    """
    Parse and validate filter parameters from request query params.

    Args:
        query_params: Request query parameters dict

    Returns:
        Dict with 'filters' list and 'joinOperator' string

    Raises:
        serializers.ValidationError: If validation fails
    """
    import json

    filters_json = query_params.get("filters", "[]")
    join_operator = query_params.get("joinOperator", "and")

    # Parse filters JSON
    try:
        filters = json.loads(filters_json) if isinstance(filters_json, str) else []
    except json.JSONDecodeError:
        raise serializers.ValidationError({"filters": "Invalid JSON format"})

    # Validate using serializer
    serializer = FilterQuerySerializer(
        data={"filters": filters, "joinOperator": join_operator}
    )
    serializer.is_valid(raise_exception=True)

    return serializer.validated_data
