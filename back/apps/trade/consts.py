"""
Trade app constants: field mappings, operator sets, etc.

"""

from .models import (
    HsProduct,
    UsageGroup,
    RemarkableProduct,
    Ctci,
    Country,
    Flow,
)

MAX_TRADE_STATS_OFFSET = 50_000

ORDERING_FIELDS = [
    "hs_product_code",
    "country_code",
    "continent",
    "flow_code",
    "value_dhs",
    "weight_kg",
    "trade_date",
    "date",
]

NUMERIC_VARIANTS = {"number", "range"}
DATE_VARIANTS = {"date", "dateRange"}
ARRAY_OPERATORS = {"inArray", "notInArray"}
NEGATED_OPERATORS = {"ne", "notILike", "notInArray", "isNotEmpty"}

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

TRUE_STRINGS = {"true", "1", "yes"}

# ---------------------------------------------------------------------------
# Maps frontend field names to TradeFact ORM relationships.
# ---------------------------------------------------------------------------
FIELD_MAPPING = {
    "hs_product_code": "hs_product__hs_product_code",
    "hs_product_label": "hs_product__hs_product_label",
    "hs_chapter_code": "hs_product__hs_chapter_code",
    "hs_chapter_label": "hs_product__hs_chapter_label",
    "usage_group_code": "usage_group__usage_group_code",
    "usage_group_label": "usage_group__usage_group_label",
    "remarkable_product_code": "remarkable_product__remarkable_product_code",
    "remarkable_product_label": "remarkable_product__remarkable_product_label",
    "ctci_section_code": "ctci__ctci_section_code",
    "ctci_section_label": "ctci__ctci_section_label",
    "ctci_division_code": "ctci__ctci_division_code",
    "ctci_division_label": "ctci__ctci_division_label",
    "ctci_group_code": "ctci__ctci_group_code",
    "ctci_group_label": "ctci__ctci_group_label",
    "country_code": "country__country_code",
    "country_name": "country__country_name",
    "continent": "country__continent",
    "flow_code": "flow__flow_code",
    "flow_label": "flow__flow_label",
    "date": "trade_date",
    "trade_date": "trade_date",
    "weight_kg": "weight_kg",
    "value_dhs": "value_dhs",
    "supplementary_unit": "supplementary_unit",
}


# ---------------------------------------------------------------------------
# Dimension fields that must be filtered via a subquery on the dimension table
# rather than a JOIN on the big fact table.
#
# Keys   — frontend field name
# model  — Django model for the dimension table
# filter_field  — column to apply the user's filter value against
# return_field  — PK column returned by the subquery (= the FK on trade_fact)
# fact_field    — FK attribute name on TradeFact
#
# When filter_field == return_field the field IS the PK; isEmpty/isNotEmpty
# can check the FK column on trade_fact directly without touching the
# dimension table at all.
# ---------------------------------------------------------------------------
FOREIGN_KEY_SUBQUERY_MAP = {
    "hs_product_code": {
        "model": HsProduct,
        "filter_field": "hs_product_code",
        "return_field": "hs_product_code",
        "fact_field": "hs_product",
    },
    "hs_product_label": {
        "model": HsProduct,
        "filter_field": "hs_product_label",
        "return_field": "hs_product_code",
        "fact_field": "hs_product",
    },
    "hs_chapter_code": {
        "model": HsProduct,
        "filter_field": "hs_chapter_code",
        "return_field": "hs_product_code",
        "fact_field": "hs_product",
    },
    "hs_chapter_label": {
        "model": HsProduct,
        "filter_field": "hs_chapter_label",
        "return_field": "hs_product_code",
        "fact_field": "hs_product",
    },
    "usage_group_code": {
        "model": UsageGroup,
        "filter_field": "usage_group_code",
        "return_field": "usage_group_code",
        "fact_field": "usage_group",
    },
    "usage_group_label": {
        "model": UsageGroup,
        "filter_field": "usage_group_label",
        "return_field": "usage_group_code",
        "fact_field": "usage_group",
    },
    "remarkable_product_code": {
        "model": RemarkableProduct,
        "filter_field": "remarkable_product_code",
        "return_field": "remarkable_product_code",
        "fact_field": "remarkable_product",
    },
    "remarkable_product_label": {
        "model": RemarkableProduct,
        "filter_field": "remarkable_product_label",
        "return_field": "remarkable_product_code",
        "fact_field": "remarkable_product",
    },
    "ctci_group_code": {
        "model": Ctci,
        "filter_field": "ctci_group_code",
        "return_field": "ctci_group_code",
        "fact_field": "ctci",
    },
    "ctci_group_label": {
        "model": Ctci,
        "filter_field": "ctci_group_label",
        "return_field": "ctci_group_code",
        "fact_field": "ctci",
    },
    "ctci_division_code": {
        "model": Ctci,
        "filter_field": "ctci_division_code",
        "return_field": "ctci_group_code",
        "fact_field": "ctci",
    },
    "ctci_division_label": {
        "model": Ctci,
        "filter_field": "ctci_division_label",
        "return_field": "ctci_group_code",
        "fact_field": "ctci",
    },
    "ctci_section_code": {
        "model": Ctci,
        "filter_field": "ctci_section_code",
        "return_field": "ctci_group_code",
        "fact_field": "ctci",
    },
    "ctci_section_label": {
        "model": Ctci,
        "filter_field": "ctci_section_label",
        "return_field": "ctci_group_code",
        "fact_field": "ctci",
    },
    "country_code": {
        "model": Country,
        "filter_field": "country_code",
        "return_field": "country_code",
        "fact_field": "country",
    },
    "country_name": {
        "model": Country,
        "filter_field": "country_name",
        "return_field": "country_code",
        "fact_field": "country",
    },
    "continent": {
        "model": Country,
        "filter_field": "continent",
        "return_field": "country_code",
        "fact_field": "country",
    },
    "flow_code": {
        "model": Flow,
        "filter_field": "flow_code",
        "return_field": "flow_code",
        "fact_field": "flow",
    },
    "flow_label": {
        "model": Flow,
        "filter_field": "flow_label",
        "return_field": "flow_code",
        "fact_field": "flow",
    },
}
