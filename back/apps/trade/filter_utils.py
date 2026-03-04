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
from django.db.models import Q, Subquery
from decimal import Decimal, InvalidOperation
from datetime import datetime, date, timezone
import logging

from .field_config import (
    FIELD_MAPPING,
    FOREIGN_KEY_SUBQUERY_MAP,
    LOOKUPS,
    NEGATED_OPERATORS,
    ARRAY_OPERATORS,
    DATE_VARIANTS,
    NUMERIC_VARIANTS,
    TRUE_STRINGS,
)

logger = logging.getLogger(__name__)


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

    if op in {"isEmpty", "isNotEmpty"}:
        if field in FOREIGN_KEY_SUBQUERY_MAP:
            config = FOREIGN_KEY_SUBQUERY_MAP[field]
            fact_field = config["fact_field"]
            filter_field = config["filter_field"]
            return_field = config["return_field"]
            model = config["model"]

            if filter_field == return_field:
                null_q = Q(**{f"{fact_field}__isnull": True})
            else:
                # Non-PK dimension field.
                #
                # We evaluate the dimension query eagerly (the table has at most
                # a few hundred rows), then pass a plain Python list to Django.
                # This gives PostgreSQL a literal IN (...) expression which it
                # can combine with the trade_date index via a bitmap scan, and
                # avoids the correlated-subquery / OR plan that forces a full
                # sequential scan on the 16M-row fact table.
                #
                # Also include FK-null rows because those trade_fact records have
                # no linked dimension row, so every dimension column is NULL.
                matching_pks = list(
                    model.objects.filter(
                        Q(**{f"{filter_field}__isnull": True}) | Q(**{filter_field: ""})
                    )
                    .order_by()
                    .values_list(return_field, flat=True)
                )
                fk_null = Q(**{f"{fact_field}__isnull": True})
                dim_empty = Q(**{f"{fact_field}__in": matching_pks})
                null_q = fk_null | dim_empty

            return null_q if op == "isEmpty" else ~null_q

        if variant in DATE_VARIANTS | NUMERIC_VARIANTS | {"range"}:
            null_q = Q(**{f"{mapped_field}__isnull": True})
            return null_q if op == "isEmpty" else ~null_q

        # text / select / multiSelect (direct fact-table fields)
        null_q = Q(**{f"{mapped_field}__isnull": True}) | Q(**{mapped_field: ""})
        return null_q if op == "isEmpty" else ~null_q

    # special operators
    if field in FOREIGN_KEY_SUBQUERY_MAP and variant == "text":
        config = FOREIGN_KEY_SUBQUERY_MAP[field]

        model = config["model"]
        filter_field = config["filter_field"]
        return_field = config["return_field"]
        fact_field = config["fact_field"]

        lookup = _resolve_lookup(op, variant)
        prepared = _prepare_value(value, variant, op)

        matching = (
            model.objects.filter(**{f"{filter_field}__{lookup}": prepared})
            .order_by()
            .values(return_field)
        )

        q = Q(**{f"{fact_field}__in": Subquery(matching)})

        return ~q if op in NEGATED_OPERATORS else q

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
