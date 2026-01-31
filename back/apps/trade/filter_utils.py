"""
Filter utilities for advanced filtering with Q objects.

This module handles complex filter operations that django-filter cannot express
through query parameters alone, such as:
- OR join logic
- NOT operators (negation)
- Complex isEmpty/isNotEmpty conditions

For simple AND filters with standard operators, django-filter in filters.py is sufficient.
"""

from typing import Dict, List, Optional, Any
from django.db.models import Q
from decimal import Decimal, InvalidOperation
from datetime import datetime, date, timezone
import logging

logger = logging.getLogger(__name__)

# Constants
NUMERIC_VARIANTS = frozenset(["number", "range"])
DATE_VARIANTS = frozenset(["date", "dateRange"])
ARRAY_OPERATORS = frozenset(["inArray", "notInArray"])
NEGATED_OPERATORS = frozenset(["notILike", "ne", "notInArray", "isNotEmpty"])

# Operator to Django ORM lookup mapping
LOOKUPS = {
    "iLike": "icontains",
    "notILike": "icontains",
    "eq": "iexact",
    "ne": "iexact",
    "lt": "lt",
    "lte": "lte",
    "gt": "gt",
    "gte": "gte",
    "inArray": "in",
    "notInArray": "in",
}


def _get_lookup_for_variant(operator: str, variant: str) -> Optional[str]:
    """
    Get the appropriate Django lookup for an operator based on variant.

    For numeric/date fields, use 'exact' instead of 'iexact' to avoid
    UPPER() function calls that don't work on non-text fields.

    Args:
        operator: Filter operator (eq, ne, lt, etc.)
        variant: Field variant (text, number, range, date, etc.)

    Returns:
        Django ORM lookup type or None if operator is unknown
    """
    base_lookup = LOOKUPS.get(operator)
    if base_lookup is None:
        return None

    # Use case-sensitive exact match for numeric and date fields
    if variant in NUMERIC_VARIANTS or variant in DATE_VARIANTS:
        if base_lookup == "iexact":
            return "exact"

    return base_lookup


def _prepare_value(value: Any, variant: str, operator: str) -> Any:
    """
    Prepare filter value based on type and variant.

    Args:
        value: Raw filter value from frontend
        variant: Field variant (text, number, range, date, etc.)
        operator: Filter operator

    Returns:
        Prepared value for Django ORM query, or None if invalid
    """
    if value is None or value == "":
        return None

    # Handle array operators
    if operator in ARRAY_OPERATORS:
        if isinstance(value, list):
            return [v for v in value if v is not None and v != ""] or None
        if isinstance(value, str):
            return [v.strip() for v in value.split(",") if v.strip()] or None

    # Handle date/dateRange variants
    if variant in DATE_VARIANTS:
        return _parse_date_value(value)

    # Handle numeric variants
    if variant in NUMERIC_VARIANTS:
        return _parse_numeric_value(value)

    # Handle boolean
    if variant == "boolean":
        return _parse_boolean_value(value)

    # Default: convert to string
    return str(value)


def _parse_date_value(value: Any) -> Optional[date]:
    """Parse date value from various formats."""
    logger.info(
        f"[DATE PARSE] Received value: {value!r} (type: {type(value).__name__})"
    )

    if isinstance(value, date):
        logger.info(f"[DATE PARSE] Already a date object: {value}")
        return value
    if isinstance(value, datetime):
        result = value.date()
        logger.info(f"[DATE PARSE] Converted datetime to date: {result}")
        return result

    if not isinstance(value, str):
        logger.warning(f"[DATE PARSE] Value is not a string: {type(value).__name__}")
        return None

    try:
        # Handle Unix timestamp in milliseconds
        if value.isdigit():
            timestamp_ms = int(value)
            dt = datetime.fromtimestamp(timestamp_ms / 1000, tz=timezone.utc)
            result = dt.date()
            logger.info(
                f"[DATE PARSE] Parsed Unix timestamp {timestamp_ms}ms to: {result}"
            )
            return result

        # Handle ISO format string (e.g., "2024-01-15T00:00:00.000Z" or "2024-01-15")
        # Remove timezone indicator and parse
        cleaned = value.replace("Z", "+00:00").split("T")[0]
        dt = datetime.fromisoformat(cleaned)
        result = dt.date()
        logger.info(f"[DATE PARSE] Parsed ISO string '{value}' to: {result}")
        return result
    except (ValueError, OSError, AttributeError) as e:
        logger.error(f"[DATE PARSE] FAILED to parse '{value}': {e}")
        return None


def _parse_numeric_value(value: Any) -> Optional[Decimal]:
    """Parse numeric value, handling various formats."""
    if isinstance(value, Decimal):
        return value

    try:
        if isinstance(value, str):
            value = value.strip()
            if not value:
                return None
        # Convert to Decimal, removing commas
        return Decimal(str(value).replace(",", ""))
    except (ValueError, TypeError, InvalidOperation):
        logger.warning(f"Failed to convert '{value}' to Decimal")
        return None


def _parse_boolean_value(value: Any) -> bool:
    """Parse boolean value from various formats."""
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        return value.lower() in ("true", "1", "yes")
    return False


def build_filter_q(
    filters: List[Dict[str, Any]], join_operator: str = "and"
) -> Optional[Q]:
    """
    Build Q object from filter specifications.

    This handles complex filter operations that django-filter cannot express:
    - OR join logic
    - NOT operators (negation)
    - Complex isEmpty/isNotEmpty conditions
    - Range queries (isBetween)

    Args:
        filters: List of filter dictionaries with {id, operator, value, variant}
        join_operator: How to combine filters ('and' or 'or')

    Returns:
        Combined Q object or None if no valid filters
    """
    if not filters:
        return None

    q_objects = [_build_single_filter_q(f) for f in filters]
    q_objects = [q for q in q_objects if q is not None]

    if not q_objects:
        return None

    # Combine Q objects with specified join operator
    result = q_objects[0]
    for q in q_objects[1:]:
        result = result | q if join_operator == "or" else result & q

    return result


def _build_single_filter_q(filter_config: Dict[str, Any]) -> Optional[Q]:
    """Build Q object for a single filter configuration."""
    field = filter_config.get("id")
    op = filter_config.get("operator")
    value = filter_config.get("value")
    variant = filter_config.get("variant", "text")

    logger.info(
        f"[FILTER] Building filter - field: {field}, op: {op}, value: {value!r}, variant: {variant}"
    )

    if not field or not op:
        logger.warning(f"[FILTER] Missing field or operator")
        return None

    # Handle special operators
    if op == "isEmpty":
        q = Q(**{f"{field}__isnull": True}) | Q(**{field: ""})
        logger.info(f"[FILTER] isEmpty query: {q}")
        return q

    if op == "isNotEmpty":
        q = ~Q(**{f"{field}__isnull": True}) & ~Q(**{field: ""})
        logger.info(f"[FILTER] isNotEmpty query: {q}")
        return q

    if op == "isBetween":
        return _build_range_q(field, value, variant)

    # Handle standard operators
    lookup = _get_lookup_for_variant(op, variant)
    if not lookup:
        logger.warning(f"Unknown operator: {op}")
        return None

    prepared = _prepare_value(value, variant, op)
    logger.info(
        f"[FILTER] Prepared value: {prepared!r} (type: {type(prepared).__name__ if prepared is not None else 'None'})"
    )

    if prepared is None:
        logger.warning(f"[FILTER] Prepared value is None, skipping filter")
        return None

    q = Q(**{f"{field}__{lookup}": prepared})
    result = ~q if op in NEGATED_OPERATORS else q
    logger.info(f"[FILTER] Final Q object: {result}")
    return result


def _build_range_q(field: str, value: Any, variant: str) -> Optional[Q]:
    """Build Q object for range (isBetween) filter."""
    if not isinstance(value, list) or len(value) != 2:
        logger.warning(f"isBetween requires exactly 2 values, got: {value}")
        return None

    start = _prepare_value(value[0], variant, "isBetween")
    end = _prepare_value(value[1], variant, "isBetween")

    if start is None or end is None:
        logger.warning(f"Invalid range values: start={value[0]}, end={value[1]}")
        return None

    # Ensure proper order
    if start > end:
        logger.debug(f"Swapping reversed range: {start} > {end}")
        start, end = end, start

    return Q(**{f"{field}__gte": start}) & Q(**{f"{field}__lte": end})
