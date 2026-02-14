/**
 * Filter builder utilities for converting frontend filters to backend API format.
 *
 * Conversion Flow:
 * 1. Frontend filter state (ExtendedColumnFilter[])
 * 2. Convert each filter to BackendFilterItem
 * 3. Validate and filter out invalid/empty filters
 * 4. Serialize for API request
 *
 * @see /back/apps/trade/filter_utils.py
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

/** Convert filter value to backend format (string or string[]). */
function convertValue(
  value: unknown,
  operator: BackendFilterOperator,
  variant: FilterVariant,
): string | string[] | null {
  if (operator === 'isEmpty' || operator === 'isNotEmpty') {
    return '';
  }

  if (value === null || value === undefined) {
    return null;
  }

  if (operator === 'isBetween') {
    if (!Array.isArray(value)) {
      return null;
    }

    const validValues = value
      .filter((v) => v !== null && v !== undefined && v !== '')
      .map((v) => {
        if (variant === 'range' || variant === 'number') {
          return String(v).replace(/,/g, '').trim();
        }
        return String(v);
      })
      .slice(0, 2);

    if (validValues.length !== 2) {
      return null;
    }

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
      const parts = value
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);

      return parts.length > 0 ? parts : null;
    }

    return null;
  }

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

  if (variant === 'number' || variant === 'range') {
    const stringValue = String(value).replace(/,/g, '').trim();

    if (stringValue === '' || isNaN(parseFloat(stringValue))) {
      return null;
    }

    return stringValue;
  }

  const stringValue = String(value);
  return stringValue.trim() !== '' ? stringValue : null;
}

/** Convert frontend filter to backend filter item. */
function convertFilterItem<TData>(
  filter: ExtendedColumnFilter<TData>,
): BackendFilterItem | null {
  const { id, value, variant, operator, filterId } = filter;

  if (!isOperatorValidForVariant(variant, operator)) {
    console.warn(
      `Invalid operator "${operator}" for variant "${variant}" on field "${String(id)}"`,
    );
    return null;
  }

  const convertedValue = convertValue(value, operator, variant);

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
 * Main entry point for converting filters to backend API format.
 */
export function buildBackendFilters<TData>(
  filters: ExtendedColumnFilter<TData>[],
  joinOperator: JoinOperator = 'and',
): BackendFilterParams {
  if (!filters || filters.length === 0) {
    return {};
  }

  const backendFilters = filters
    .map(convertFilterItem)
    .filter((filter): filter is BackendFilterItem => filter !== null);

  if (backendFilters.length === 0) {
    return {};
  }

  return {
    filters: backendFilters,
    joinOperator,
  };
}

/** Check if there are any active filters. */
export function hasActiveFilters<TData>(
  filters: ExtendedColumnFilter<TData>[] | null | undefined,
): boolean {
  return Boolean(filters && filters.length > 0);
}

/** Get human-readable description of a filter. */
export function getFilterDescription<TData>(
  filter: ExtendedColumnFilter<TData>,
  fieldLabel?: string,
): string {
  const field = fieldLabel || String(filter.id);
  const { operator, value } = filter;

  if (operator === 'isEmpty') {
    return `${field} is empty`;
  }

  if (operator === 'isNotEmpty') {
    return `${field} is not empty`;
  }

  if (operator === 'isBetween' && Array.isArray(value) && value.length === 2) {
    return `${field} is between ${value[0]} and ${value[1]}`;
  }

  if (operator === 'inArray' && Array.isArray(value)) {
    return `${field} is one of: ${value.join(', ')}`;
  }

  if (operator === 'notInArray' && Array.isArray(value)) {
    return `${field} is none of: ${value.join(', ')}`;
  }

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

/** Count the number of active filters. */
export function countActiveFilters<TData>(
  filters: ExtendedColumnFilter<TData>[] | null | undefined,
): number {
  if (!filters) return 0;

  const converted = filters
    .map(convertFilterItem)
    .filter((f): f is BackendFilterItem => f !== null);

  return converted.length;
}
