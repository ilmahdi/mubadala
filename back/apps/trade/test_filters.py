"""
Unit tests for the filter system.

Run with: python manage.py test apps.trade.test_filters
"""

from django.test import TestCase
from django.db.models import Q
from decimal import Decimal
from datetime import date
from apps.trade.filter_utils import FilterBuilder, build_filter_q, FilterOperatorMapper


class FilterOperatorMapperTestCase(TestCase):
    """Test FilterOperatorMapper class."""

    def test_get_lookup_for_text_operators(self):
        """Test lookup mappings for text operators."""
        self.assertEqual(FilterOperatorMapper.get_lookup("iLike"), "icontains")
        self.assertEqual(FilterOperatorMapper.get_lookup("eq"), "iexact")
        self.assertEqual(FilterOperatorMapper.get_lookup("isEmpty"), "isnull")

    def test_get_lookup_for_numeric_operators(self):
        """Test lookup mappings for numeric operators."""
        self.assertEqual(FilterOperatorMapper.get_lookup("lt"), "lt")
        self.assertEqual(FilterOperatorMapper.get_lookup("gte"), "gte")

    def test_is_negated(self):
        """Test negation detection."""
        self.assertTrue(FilterOperatorMapper.is_negated("ne"))
        self.assertTrue(FilterOperatorMapper.is_negated("notILike"))
        self.assertTrue(FilterOperatorMapper.is_negated("isNotEmpty"))
        self.assertFalse(FilterOperatorMapper.is_negated("eq"))
        self.assertFalse(FilterOperatorMapper.is_negated("isEmpty"))


class FilterBuilderTextTestCase(TestCase):
    """Test FilterBuilder for text filters."""

    def test_text_ilike_filter(self):
        """Test iLike (contains) operator."""
        builder = FilterBuilder("hs_product_label", "iLike", "wheat", "text")
        q = builder.build_q()
        self.assertIsNotNone(q)
        # Should generate: hs_product_label__icontains='wheat'

    def test_text_eq_filter(self):
        """Test eq (exact match) operator."""
        builder = FilterBuilder("country_name", "eq", "France", "text")
        q = builder.build_q()
        self.assertIsNotNone(q)
        # Should generate: country_name__iexact='France'

    def test_text_ne_filter(self):
        """Test ne (not equal) operator with negation."""
        builder = FilterBuilder("country_name", "ne", "France", "text")
        q = builder.build_q()
        self.assertIsNotNone(q)
        # Should generate: NOT country_name__iexact='France'

    def test_text_is_empty(self):
        """Test isEmpty operator."""
        builder = FilterBuilder("hs_product_label", "isEmpty", None, "text")
        q = builder.build_q()
        self.assertIsNotNone(q)
        # Should generate: (hs_product_label__isnull=True OR hs_product_label='')

    def test_text_is_not_empty(self):
        """Test isNotEmpty operator."""
        builder = FilterBuilder("hs_product_label", "isNotEmpty", None, "text")
        q = builder.build_q()
        self.assertIsNotNone(q)
        # Should generate: NOT (hs_product_label__isnull=True) AND NOT (hs_product_label='')


class FilterBuilderNumericTestCase(TestCase):
    """Test FilterBuilder for numeric filters."""

    def test_numeric_gte_filter(self):
        """Test gte operator for numbers."""
        builder = FilterBuilder("value_dhs", "gte", "10000", "range")
        q = builder.build_q()
        self.assertIsNotNone(q)
        # Should convert to Decimal and generate: value_dhs__gte=Decimal('10000')

    def test_numeric_lte_filter(self):
        """Test lte operator for numbers."""
        builder = FilterBuilder("weight_kg", "lte", 5000.5, "number")
        q = builder.build_q()
        self.assertIsNotNone(q)

    def test_numeric_between_filter(self):
        """Test isBetween operator for range."""
        builder = FilterBuilder("value_dhs", "isBetween", ["10000", "50000"], "range")
        q = builder.build_q()
        self.assertIsNotNone(q)
        # Should generate: (value_dhs__gte=10000 AND value_dhs__lte=50000)

    def test_numeric_invalid_value(self):
        """Test handling of invalid numeric values."""
        builder = FilterBuilder("value_dhs", "gte", "invalid", "number")
        q = builder.build_q()
        # Should return None for invalid numeric value
        self.assertIsNone(q)


class FilterBuilderMultiSelectTestCase(TestCase):
    """Test FilterBuilder for multiSelect filters."""

    def test_multiselect_in_array(self):
        """Test inArray operator for multiSelect."""
        builder = FilterBuilder(
            "continent", "inArray", ["EUROPE", "ASIE"], "multiSelect"
        )
        q = builder.build_q()
        self.assertIsNotNone(q)
        # Should generate: continent__in=['EUROPE', 'ASIE']

    def test_multiselect_not_in_array(self):
        """Test notInArray operator with negation."""
        builder = FilterBuilder("continent", "notInArray", ["AFRIQUE"], "multiSelect")
        q = builder.build_q()
        self.assertIsNotNone(q)
        # Should generate: NOT continent__in=['AFRIQUE']

    def test_multiselect_comma_separated_string(self):
        """Test multiSelect with comma-separated string."""
        builder = FilterBuilder("continent", "inArray", "EUROPE,ASIE", "multiSelect")
        q = builder.build_q()
        self.assertIsNotNone(q)
        # Should convert to list and generate: continent__in=['EUROPE', 'ASIE']


class FilterBuilderDateTestCase(TestCase):
    """Test FilterBuilder for date filters."""

    def test_date_gte_filter(self):
        """Test date gte operator."""
        # Timestamp for 2024-01-01
        builder = FilterBuilder("date", "gte", "1704067200000", "dateRange")
        q = builder.build_q()
        self.assertIsNotNone(q)
        # Should convert timestamp to date and generate: date__gte=date(2024,1,1)

    def test_date_between_filter(self):
        """Test date range with isBetween."""
        builder = FilterBuilder(
            "date",
            "isBetween",
            ["1704067200000", "1735689599000"],  # 2024 start and end
            "dateRange",
        )
        q = builder.build_q()
        self.assertIsNotNone(q)
        # Should generate: (date__gte=2024-01-01 AND date__lte=2024-12-31)

    def test_date_invalid_timestamp(self):
        """Test handling of invalid date values."""
        builder = FilterBuilder("date", "gte", "invalid", "date")
        q = builder.build_q()
        # Should return None for invalid date
        self.assertIsNone(q)


class BuildFilterQTestCase(TestCase):
    """Test build_filter_q function for combining filters."""

    def test_single_filter(self):
        """Test with a single filter."""
        filters = [
            {
                "id": "continent",
                "value": ["EUROPE"],
                "variant": "multiSelect",
                "operator": "inArray",
                "filterId": "f1",
            }
        ]
        q = build_filter_q(filters, "and")
        self.assertIsNotNone(q)

    def test_multiple_filters_and(self):
        """Test combining multiple filters with AND logic."""
        filters = [
            {
                "id": "continent",
                "value": ["EUROPE"],
                "variant": "multiSelect",
                "operator": "inArray",
                "filterId": "f1",
            },
            {
                "id": "value_dhs",
                "value": "10000",
                "variant": "range",
                "operator": "gte",
                "filterId": "f2",
            },
        ]
        q = build_filter_q(filters, "and")
        self.assertIsNotNone(q)
        # Should generate: (continent__in=['EUROPE'] AND value_dhs__gte=10000)

    def test_multiple_filters_or(self):
        """Test combining multiple filters with OR logic."""
        filters = [
            {
                "id": "continent",
                "value": ["EUROPE"],
                "variant": "multiSelect",
                "operator": "inArray",
                "filterId": "f1",
            },
            {
                "id": "continent",
                "value": ["ASIE"],
                "variant": "multiSelect",
                "operator": "inArray",
                "filterId": "f2",
            },
        ]
        q = build_filter_q(filters, "or")
        self.assertIsNotNone(q)
        # Should generate: (continent__in=['EUROPE'] OR continent__in=['ASIE'])

    def test_empty_filters_list(self):
        """Test with empty filters list."""
        q = build_filter_q([], "and")
        self.assertIsNone(q)

    def test_invalid_filter_skipped(self):
        """Test that invalid filters are skipped."""
        filters = [
            {
                "id": "continent",
                "value": ["EUROPE"],
                "variant": "multiSelect",
                "operator": "inArray",
                "filterId": "f1",
            },
            {
                # Missing operator - should be skipped
                "id": "value_dhs",
                "value": "10000",
                "variant": "range",
                "filterId": "f2",
            },
        ]
        q = build_filter_q(filters, "and")
        self.assertIsNotNone(q)
        # Should only have the first filter


class EdgeCasesTestCase(TestCase):
    """Test edge cases and error handling."""

    def test_none_value_for_regular_operator(self):
        """Test None value for non-empty operators."""
        builder = FilterBuilder("country_name", "eq", None, "text")
        q = builder.build_q()
        self.assertIsNone(q)

    def test_empty_string_value(self):
        """Test empty string value."""
        builder = FilterBuilder("country_name", "eq", "", "text")
        q = builder.build_q()
        self.assertIsNone(q)

    def test_empty_array_for_multiselect(self):
        """Test empty array for multiSelect."""
        builder = FilterBuilder("continent", "inArray", [], "multiSelect")
        q = builder.build_q()
        self.assertIsNone(q)

    def test_invalid_range_array(self):
        """Test invalid range array (not 2 elements)."""
        builder = FilterBuilder("value_dhs", "isBetween", ["10000"], "range")
        q = builder.build_q()
        # Should return None for invalid range
        self.assertIsNone(q)

    def test_boolean_filter(self):
        """Test boolean filter."""
        builder = FilterBuilder("is_active", "eq", "true", "boolean")
        q = builder.build_q()
        self.assertIsNotNone(q)
