"""
Advanced filter utilities using Django Q objects for star schema.

Supports logic not easily expressed via django-filter:
- OR joins
- Negation operators
- Empty / not empty checks
- Between ranges

Field Mapping:
Frontend uses flat field names (e.g., "continent", "hs_product_code") which are mapped
to dimension relationships (e.g., "country__continent", "hs_product__hs_product_code").
"""

from typing import Dict, List, Optional, Any
from django.db.models import Q
from decimal import Decimal, InvalidOperation
from datetime import datetime, date, timezone
import logging

logger = logging.getLogger(__name__)


# Map frontend field names to TradeFact dimension relationships
FIELD_MAPPING = {
    # HS Product dimension
    "hs_product_code": "hs_product__hs_product_code",
    "hs_product_label": "hs_product__hs_product_label",
    "hs_chapter_code": "hs_product__hs_chapter_code",
    "hs_chapter_label": "hs_product__hs_chapter_label",
    # Usage Group dimension
    "usage_group_code": "usage_group__usage_group_code",
    "usage_group_label": "usage_group__usage_group_label",
    # Remarkable Product dimension
    "remarkable_product_code": "remarkable_product__remarkable_product_code",
    "remarkable_product_label": "remarkable_product__remarkable_product_label",
    # CTCI dimension
    "ctci_section_code": "ctci__ctci_section_code",
    "ctci_section_label": "ctci__ctci_section_label",
    "ctci_division_code": "ctci__ctci_division_code",
    "ctci_division_label": "ctci__ctci_division_label",
    "ctci_group_code": "ctci__ctci_group_code",
    "ctci_group_label": "ctci__ctci_group_label",
    # Country dimension
    "country_code": "country__country_code",
    "country_name": "country__country_name",
    "continent": "country__continent",
    # Flow dimension
    "flow_code": "flow__flow_code",
    "flow_label": "flow__flow_label",
    # Time dimension (rename date -> trade_date)
    "date": "trade_date",
    # Metrics (no mapping needed, direct fields)
    "weight_kg": "weight_kg",
    "value_dhs": "value_dhs",
    "supplementary_unit": "supplementary_unit",
}


NUMERIC_VARIANTS = {"number", "range"}
DATE_VARIANTS = {"date", "dateRange"}

ARRAY_OPERATORS = {"inArray", "notInArray"}
NEGATED_OPERATORS = {"ne", "notILike", "notInArray", "isNotEmpty"}

LOOKUPS = {
    "eq": "iexact",
    "ne": "iexact",
    "lt": "lt",
    "lte": "lte",
    "gt": "gt",
    "gte": "gte",
    "inArray": "in",
    "notInArray": "in",
}

TRUE_STRINGS = {"true", "1", "yes"}


def build_filter_q(
    filters: List[Dict[str, Any]], join_operator: str = "and"
) -> Optional[Q]:
    """Build combined Q object from filter specs."""
    if not filters:
        return None

    q_list = [q for f in filters if (q := _build_single_filter_q(f)) is not None]

    if not q_list:
        return None

    result = q_list[0]
    for q in q_list[1:]:
        result = result | q if join_operator == "or" else result & q

    return result


def _build_single_filter_q(cfg: Dict[str, Any]) -> Optional[Q]:
    field = cfg.get("id")
    op = cfg.get("operator")
    value = cfg.get("value")
    variant = cfg.get("variant", "text")

    if not field or not op:
        return None

    # Map frontend field name to dimension relationship
    mapped_field = FIELD_MAPPING.get(field, field)

    logger.debug(
        "Building filter: %s -> %s %s %r (%s)", field, mapped_field, op, value, variant
    )

    # special operators
    if op == "isEmpty":
        if variant in DATE_VARIANTS | NUMERIC_VARIANTS | {"range"}:
            return Q(**{f"{mapped_field}__isnull": True})
        return Q(**{f"{mapped_field}__isnull": True}) | Q(**{mapped_field: ""})

    if op == "isNotEmpty":
        if variant in DATE_VARIANTS | NUMERIC_VARIANTS | {"range"}:
            return ~Q(**{f"{mapped_field}__isnull": True})
        return ~Q(**{f"{mapped_field}__isnull": True}) & ~Q(**{mapped_field: ""})

    if op == "isBetween":
        return _build_range_q(mapped_field, value, variant)

    lookup = _resolve_lookup(op, variant)
    if not lookup:
        logger.warning("Unknown operator: %s", op)
        return None

    prepared = _prepare_value(value, variant, op)
    if prepared is None:
        return None

    q = Q(**{f"{mapped_field}__{lookup}": prepared})
    return ~q if op in NEGATED_OPERATORS else q


def _resolve_lookup(operator: str, variant: str) -> Optional[str]:
    lookup = LOOKUPS.get(operator)
    if not lookup:
        return None

    if lookup == "iexact" and variant in NUMERIC_VARIANTS | DATE_VARIANTS:
        return "exact"

    return lookup


def _prepare_value(value: Any, variant: str, operator: str) -> Any:
    if value in (None, ""):
        return None

    if operator in ARRAY_OPERATORS:
        return _parse_array(value)

    if variant in DATE_VARIANTS:
        return _parse_date(value)

    if variant in NUMERIC_VARIANTS:
        return _parse_numeric(value)

    if variant == "boolean":
        return _parse_boolean(value)

    return str(value)


def _parse_array(value: Any) -> Optional[list]:
    if isinstance(value, list):
        cleaned = [v for v in value if v not in (None, "")]
        return cleaned or None

    if isinstance(value, str):
        cleaned = [v.strip() for v in value.split(",") if v.strip()]
        return cleaned or None

    return None


def _parse_date(value: Any) -> Optional[date]:
    if isinstance(value, date):
        return value
    if isinstance(value, datetime):
        return value.date()

    if not isinstance(value, str):
        return None

    try:
        if value.isdigit():  # timestamp ms
            return datetime.fromtimestamp(int(value) / 1000, tz=timezone.utc).date()

        cleaned = value.replace("Z", "+00:00").split("T")[0]
        return datetime.fromisoformat(cleaned).date()

    except Exception:
        logger.debug("Invalid date value: %r", value)
        return None


def _parse_numeric(value: Any) -> Optional[Decimal]:
    if isinstance(value, Decimal):
        return value

    try:
        return Decimal(str(value).replace(",", "").strip())
    except (InvalidOperation, ValueError, TypeError):
        logger.debug("Invalid numeric value: %r", value)
        return None


def _parse_boolean(value: Any) -> bool:
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        return value.lower() in TRUE_STRINGS
    return False


def _build_range_q(field: str, value: Any, variant: str) -> Optional[Q]:
    if not isinstance(value, list) or len(value) != 2:
        return None

    start = _prepare_value(value[0], variant, "range")
    end = _prepare_value(value[1], variant, "range")

    if start is None or end is None:
        return None

    if start > end:
        start, end = end, start

    return Q(**{f"{field}__gte": start}) & Q(**{f"{field}__lte": end})
