/**
 * Filter builder utilities for converting frontend filters to backend API format.
 *
 * This module provides type-safe conversion of ExtendedColumnFilter objects
 * to the format expected by the Django backend API.
 *
 * Conversion Flow:
 * 1. Frontend filter state (ExtendedColumnFilter[])
 * 2. Convert each filter to BackendFilterItem
 * 3. Validate and filter out invalid/empty filters
 * 4. Serialize to JSON for API request
 *
 * @see /back/apps/trade/filter_utils.py - Backend filter processing
 * @see /back/apps/trade/filter_serializer.py - Backend validation
 */

import type { ExtendedColumnFilter } from '@/src/types/data-table';
import type {
  BackendFilterItem,
  BackendFilterParams,
  JoinOperator,
  BackendFilterOperator,
  FilterVariant,
} from '@/src/types/filters';
import { isOperatorValidForVariant } from '@/src/types/filters';

/**
 * Convert filter value to string or string array for backend.
 *
 * @param value - The filter value from frontend state
 * @param operator - The filter operator
 * @param variant - The filter variant
 * @returns Converted value as string or string[], or null if invalid
 */
function convertValue(
  value: unknown,
  operator: BackendFilterOperator,
  variant: FilterVariant,
): string | string[] | null {
  // isEmpty/isNotEmpty operators don't need values
  if (operator === 'isEmpty' || operator === 'isNotEmpty') {
    return '';
  }

  // Null/undefined values are invalid (except for isEmpty/isNotEmpty)
  if (value === null || value === undefined) {
    return null;
  }

  // Handle isBetween - expects array of exactly 2 values
  if (operator === 'isBetween') {
    if (!Array.isArray(value)) {
      return null;
    }

    const validValues = value
      .filter((v) => v !== null && v !== undefined && v !== '')
      .map((v) => {
        // For numeric ranges, ensure we preserve numeric format
        if (variant === 'range' || variant === 'number') {
          // Remove any commas and whitespace for numbers
          return String(v).replace(/,/g, '').trim();
        }
        return String(v);
      })
      .slice(0, 2); // Take first 2

    // Must have exactly 2 values for range
    if (validValues.length !== 2) {
      return null;
    }

    // For numeric ranges, validate that values are actually numbers
    if (variant === 'range' || variant === 'number') {
      if (validValues.some((v) => isNaN(parseFloat(v)))) {
        console.warn(
          `Invalid numeric values for range filter: ${validValues.join(', ')}`,
        );
        return null;
      }
    }

    return validValues;
  }

  // Handle multiSelect and array operators
  if (
    variant === 'multiSelect' ||
    operator === 'inArray' ||
    operator === 'notInArray'
  ) {
    if (Array.isArray(value)) {
      const filtered = value
        .filter((v) => v !== null && v !== undefined && v !== '')
        .map(String);

      return filtered.length > 0 ? filtered : null;
    }

    if (typeof value === 'string' && value.trim()) {
      // Handle comma-separated strings
      const parts = value
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);

      return parts.length > 0 ? parts : null;
    }

    return null;
  }

  // Handle date/dateRange - can be arrays or single values
  if (variant === 'date' || variant === 'dateRange') {
    if (Array.isArray(value)) {
      const filtered = value
        .filter((v) => v !== null && v !== undefined && v !== '')
        .map(String);

      return filtered.length > 0 ? filtered : null;
    }

    if (value !== '' && value !== null && value !== undefined) {
      return String(value);
    }

    return null;
  }

  // Handle number/range variants - clean and validate numeric values
  if (variant === 'number' || variant === 'range') {
    const stringValue = String(value).replace(/,/g, '').trim();

    // Validate it's a valid number
    if (stringValue === '' || isNaN(parseFloat(stringValue))) {
      return null;
    }

    return stringValue;
  }

  // Default: convert to string
  const stringValue = String(value);
  return stringValue.trim() !== '' ? stringValue : null;
}

/**
 * Convert a single ExtendedColumnFilter to BackendFilterItem.
 *
 * @param filter - Frontend filter object
 * @returns Backend filter item or null if invalid
 */
function convertFilterItem<TData>(
  filter: ExtendedColumnFilter<TData>,
): BackendFilterItem | null {
  const { id, value, variant, operator, filterId } = filter;

  // Validate operator/variant compatibility
  if (!isOperatorValidForVariant(variant, operator)) {
    console.warn(
      `Invalid operator "${operator}" for variant "${variant}" on field "${String(id)}"`,
    );
    return null;
  }

  // Convert value
  const convertedValue = convertValue(value, operator, variant);

  // Skip filters with no valid value (except isEmpty/isNotEmpty)
  if (
    convertedValue === null &&
    operator !== 'isEmpty' &&
    operator !== 'isNotEmpty'
  ) {
    return null;
  }

  return {
    id: String(id),
    value: convertedValue || '',
    variant,
    operator,
    filterId,
  };
}

/**
 * Build backend filter parameters from frontend filter state.
 *
 * This is the main entry point for converting frontend filters to
 * backend API format. It handles validation, conversion, and serialization.
 *
 * @param filters - Array of filters from frontend state
 * @param joinOperator - How to combine filters ('and' or 'or'), defaults to 'and'
 * @returns Backend filter parameters ready for API request
 *
 * @example
 * const filters = [
 *   { id: 'continent', operator: 'inArray', value: ['EUROPE'], variant: 'multiSelect', filterId: 'f1' }
 * ];
 * const params = buildBackendFilters(filters, 'and');
 * // Returns: { filters: '[{"id":"continent",...}]', joinOperator: 'and' }
 */
export function buildBackendFilters<TData>(
  filters: ExtendedColumnFilter<TData>[],
  joinOperator: JoinOperator = 'and',
): BackendFilterParams {
  // Return empty object if no filters
  if (!filters || filters.length === 0) {
    return {};
  }

  // Convert and validate all filters
  const backendFilters = filters
    .map(convertFilterItem)
    .filter((filter): filter is BackendFilterItem => filter !== null);

  // If no valid filters remain after conversion, return empty
  if (backendFilters.length === 0) {
    return {};
  }

  // Serialize filters to JSON
  // Backend expects filters as JSON string in query params
  return {
    filters: JSON.stringify(backendFilters),
    joinOperator,
  };
}

/**
 * Check if there are any active filters.
 *
 * @param filters - Array of filters
 * @returns True if filters exist and have at least one item
 */
export function hasActiveFilters<TData>(
  filters: ExtendedColumnFilter<TData>[] | null | undefined,
): boolean {
  return Boolean(filters && filters.length > 0);
}

/**
 * Get a human-readable description of a filter.
 *
 * @param filter - The filter to describe
 * @param fieldLabel - Optional custom label for the field (defaults to id)
 * @returns Human-readable filter description
 *
 * @example
 * getFilterDescription(filter, 'Continent')
 * // Returns: "Continent is one of: EUROPE, ASIA"
 */
export function getFilterDescription<TData>(
  filter: ExtendedColumnFilter<TData>,
  fieldLabel?: string,
): string {
  const field = fieldLabel || String(filter.id);
  const { operator, value } = filter;

  // Special operators without values
  if (operator === 'isEmpty') {
    return `${field} is empty`;
  }

  if (operator === 'isNotEmpty') {
    return `${field} is not empty`;
  }

  // Range operators
  if (operator === 'isBetween' && Array.isArray(value) && value.length === 2) {
    return `${field} is between ${value[0]} and ${value[1]}`;
  }

  // Array operators
  if (operator === 'inArray' && Array.isArray(value)) {
    return `${field} is one of: ${value.join(', ')}`;
  }

  if (operator === 'notInArray' && Array.isArray(value)) {
    return `${field} is none of: ${value.join(', ')}`;
  }

  // Standard operators
  const operatorLabels: Record<BackendFilterOperator, string> = {
    iLike: 'contains',
    notILike: 'does not contain',
    eq: 'equals',
    ne: 'does not equal',
    lt: 'is less than',
    lte: 'is less than or equal to',
    gt: 'is greater than',
    gte: 'is greater than or equal to',
    isEmpty: 'is empty',
    isNotEmpty: 'is not empty',
    isBetween: 'is between',
    inArray: 'is one of',
    notInArray: 'is none of',
    isRelativeToToday: 'is relative to today',
  };

  const operatorLabel = operatorLabels[operator] || operator;
  return `${field} ${operatorLabel} ${value}`;
}

/**
 * Count the number of active filters.
 *
 * @param filters - Array of filters
 * @returns Number of valid filters
 */
export function countActiveFilters<TData>(
  filters: ExtendedColumnFilter<TData>[] | null | undefined,
): number {
  if (!filters) return 0;

  const converted = filters
    .map(convertFilterItem)
    .filter((f): f is BackendFilterItem => f !== null);

  return converted.length;
}
