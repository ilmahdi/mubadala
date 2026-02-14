/**
 * Filter type definitions for the trade data table.
 *
 * Maps to Django backend filter system with type-safe operator/variant combinations.
 *
 * @see /back/apps/trade/filter_utils.py
 */

/**
 * Filter operators supported by the backend.
 * Maps to Django ORM lookups (iLike → __icontains, eq → __iexact, etc.).
 */
export type BackendFilterOperator =
  | 'iLike' // Contains (text search)
  | 'notILike' // Does not contain
  | 'eq' // Equals
  | 'ne' // Not equals
  | 'inArray' // In array (multiSelect)
  | 'notInArray' // Not in array
  | 'isEmpty' // Field is null or empty string
  | 'isNotEmpty' // Field is not null and not empty
  | 'lt' // Less than
  | 'lte' // Less than or equal
  | 'gt' // Greater than
  | 'gte' // Greater than or equal
  | 'isBetween' // Range query (min/max)
  | 'isRelativeToToday'; // Date relative to today (not yet implemented)

/**
 * Filter variants that determine available operators and value processing.
 */
export type FilterVariant =
  | 'text' // String values
  | 'number' // Numeric values (converted to Decimal)
  | 'range' // Numeric range
  | 'date' // Single date
  | 'dateRange' // Date range
  | 'boolean' // Boolean values
  | 'select' // Single select from options
  | 'multiSelect'; // Multiple select from options

/**
 * Join operator: 'and' (all match) or 'or' (any match).
 */
export type JoinOperator = 'and' | 'or';

/**
 * Backend API filter parameters sent in request body.
 */
export interface BackendFilterParams {
  filters?: object; // JSON stringified array of filter items
  joinOperator?: JoinOperator;
}

/**
 * Filter item structure expected by Django backend.
 */
export interface BackendFilterItem {
  id: string; // Field name (must match Django model field)
  value: string | string[]; // Filter value(s) - strings for serialization
  variant: FilterVariant; // Determines value processing
  operator: BackendFilterOperator; // Filter operation
  filterId: string; // Unique identifier for this filter instance
}

export interface FilterSpecification {
  filters: BackendFilterItem[];
  joinOperator: JoinOperator;
}

// Operator sets by variant for validation
const VALID_OPERATORS: Record<FilterVariant, readonly BackendFilterOperator[]> =
  {
    text: ['iLike', 'notILike', 'eq', 'ne', 'isEmpty', 'isNotEmpty'],
    number: [
      'eq',
      'ne',
      'lt',
      'lte',
      'gt',
      'gte',
      'isBetween',
      'isEmpty',
      'isNotEmpty',
    ],
    range: [
      'eq',
      'ne',
      'lt',
      'lte',
      'gt',
      'gte',
      'isBetween',
      'isEmpty',
      'isNotEmpty',
    ],
    date: [
      'eq',
      'ne',
      'lt',
      'lte',
      'gt',
      'gte',
      'isBetween',
      'isRelativeToToday',
      'isEmpty',
      'isNotEmpty',
    ],
    dateRange: [
      'eq',
      'ne',
      'lt',
      'lte',
      'gt',
      'gte',
      'isBetween',
      'isRelativeToToday',
      'isEmpty',
      'isNotEmpty',
    ],
    boolean: ['eq', 'ne'],
    select: ['eq', 'ne', 'isEmpty', 'isNotEmpty'],
    multiSelect: ['inArray', 'notInArray', 'isEmpty', 'isNotEmpty'],
  } as const;

/** Type guard for valid filter operator. */
export function isValidFilterOperator(
  operator: string,
): operator is BackendFilterOperator {
  const validOperators: BackendFilterOperator[] = [
    'iLike',
    'notILike',
    'eq',
    'ne',
    'inArray',
    'notInArray',
    'isEmpty',
    'isNotEmpty',
    'lt',
    'lte',
    'gt',
    'gte',
    'isBetween',
    'isRelativeToToday',
  ];
  return validOperators.includes(operator as BackendFilterOperator);
}

/** Type guard for valid filter variant. */
export function isValidFilterVariant(
  variant: string,
): variant is FilterVariant {
  const validVariants: FilterVariant[] = [
    'text',
    'number',
    'range',
    'date',
    'dateRange',
    'boolean',
    'select',
    'multiSelect',
  ];
  return validVariants.includes(variant as FilterVariant);
}

/** Type guard for valid join operator. */
export function isValidJoinOperator(
  operator: string,
): operator is JoinOperator {
  return operator === 'and' || operator === 'or';
}

/** Validate operator compatibility with variant. */
export function isOperatorValidForVariant(
  variant: FilterVariant,
  operator: BackendFilterOperator,
): boolean {
  const validOps = VALID_OPERATORS[variant];
  return validOps.includes(operator);
}

/** Get valid operators for a given variant. */
export function getValidOperatorsForVariant(
  variant: FilterVariant,
): readonly BackendFilterOperator[] {
  return VALID_OPERATORS[variant];
}
