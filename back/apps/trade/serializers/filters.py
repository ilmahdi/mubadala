"""
FilterItemSerializer — validates a single filter object sent in /api/trades/.

This is the deepest layer of input validation.  It is used as the child
serializer of the `filters` list inside TradeListRequestSerializer, so
bad filter input is rejected before it ever reaches filter_utils.py or the ORM.

Validation layers
-----------------
1. Field-level  – validate_id() rejects unknown field names immediately.
2. Object-level – validate() cross-checks operator vs. variant compatibility
                  and ensures `value` is present/well-formed for the operator.
3. Coercion     – to_internal_value() normalises array values for array ops.
"""

from rest_framework import serializers
from typing import Any, Dict

from ..consts import FIELD_MAPPING, NUMERIC_VARIANTS, DATE_VARIANTS


VALID_FILTER_FIELDS: frozenset = frozenset(FIELD_MAPPING.keys())

# ---------------------------------------------------------------------------
# Operator → valid variant families
# ---------------------------------------------------------------------------
_OPERATOR_VARIANTS: dict[str, frozenset] = {
    # Text search only
    "iLike": frozenset({"text", "select", "multiSelect"}),
    "notILike": frozenset({"text", "select", "multiSelect"}),
    # Array membership – must be a select/multiSelect variant
    "inArray": frozenset({"select", "multiSelect"}),
    "notInArray": frozenset({"select", "multiSelect"}),
    # Ordered comparisons – numeric or date
    "lt": NUMERIC_VARIANTS | DATE_VARIANTS,
    "lte": NUMERIC_VARIANTS | DATE_VARIANTS,
    "gt": NUMERIC_VARIANTS | DATE_VARIANTS,
    "gte": NUMERIC_VARIANTS | DATE_VARIANTS,
    # Range – numeric or date
    "isBetween": NUMERIC_VARIANTS | DATE_VARIANTS,
    # Relative date – date variants only
    "isRelativeToToday": DATE_VARIANTS,
}


class FilterItemSerializer(serializers.Serializer):
    """Serializer for a single filter item sent in the filters array."""

    id = serializers.CharField(
        required=True,
        help_text="Flat field name to filter on (must be a known trade field)",
    )
    value = serializers.JSONField(
        required=False,
        allow_null=True,
        help_text="Filter value — string, number, array, or null",
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
        help_text="UI variant that drives coercion logic",
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
        required=True,
        help_text="Unique identifier for this filter instance (used by the frontend)",
    )

    # ------------------------------------------------------------------
    # Field-level validators
    # ------------------------------------------------------------------

    def validate_id(self, value: str) -> str:
        """Reject unknown field names so they never reach the ORM."""
        if value not in VALID_FILTER_FIELDS:
            raise serializers.ValidationError(
                f"'{value}' is not a filterable field. "
                f"Valid fields: {sorted(VALID_FILTER_FIELDS)}"
            )
        return value

    # ------------------------------------------------------------------
    # Object-level validation
    # ------------------------------------------------------------------

    def validate(self, attrs: Dict[str, Any]) -> Dict[str, Any]:
        operator = attrs.get("operator")
        value = attrs.get("value")
        variant = attrs.get("variant")

        # isEmpty / isNotEmpty never need a value
        if operator in {"isEmpty", "isNotEmpty"}:
            attrs["value"] = None
            return attrs

        # Operator/variant compatibility check
        allowed_variants = _OPERATOR_VARIANTS.get(operator)
        if allowed_variants and variant not in allowed_variants:
            raise serializers.ValidationError(
                {
                    "operator": (
                        f"Operator '{operator}' is not valid for variant '{variant}'. "
                        f"Allowed variants: {sorted(allowed_variants)}"
                    )
                }
            )

        # Value must be present for all remaining operators
        if value is None or value == "":
            raise serializers.ValidationError(
                {"value": f"A value is required for operator '{operator}'"}
            )

        # isBetween needs exactly two items
        if operator == "isBetween":
            if not isinstance(value, list) or len(value) != 2:
                raise serializers.ValidationError(
                    {"value": "'isBetween' requires an array of exactly two values"}
                )

        return attrs

    # ------------------------------------------------------------------
    # Coercion
    # ------------------------------------------------------------------

    def to_internal_value(self, data: Any) -> Dict[str, Any]:
        """Normalise array values for array-based operators."""
        internal = super().to_internal_value(data)

        value = internal.get("value")
        operator = internal.get("operator")

        if operator in {"inArray", "notInArray"} and value is not None:
            if not isinstance(value, list):
                # Accept comma-separated string as fallback
                if isinstance(value, str):
                    internal["value"] = [
                        v.strip() for v in value.split(",") if v.strip()
                    ]
                else:
                    internal["value"] = [str(value)]

        return internal
