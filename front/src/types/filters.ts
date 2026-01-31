/**
 * Filter type definitions for the trade data table.
 *
 * These types map to the Django backend filter system and ensure type safety
 * when building filter query parameters. The backend expects filters as JSON
 * with specific operator/variant combinations.
 *
 * @see /back/apps/trade/filter_utils.py - Backend filter implementation
 * @see /back/apps/trade/filter_serializer.py - Backend validation
 */

/**
 * Filter operators supported by the backend.
 *
 * Maps directly to Django ORM lookups:
 * - iLike → __icontains (case-insensitive contains)
 * - eq → __iexact (case-insensitive exact match)
 * - inArray → __in (SQL IN clause)
 * - gte/lte → __gte/__lte (comparison operators)
 * - etc.
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
 * Filter variants that determine how values are processed.
 *
 * The variant affects:
 * 1. Available operators
 * 2. Value validation
 * 3. Backend conversion logic
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
 * Join operator for combining multiple filters.
 *
 * - 'and': All filters must match (default)
 * - 'or': At least one filter must match
 */
export type JoinOperator = 'and' | 'or';

/**
 * Backend API filter parameters.
 *
 * Sent as query string parameters:
 * - filters: JSON array of BackendFilterItem
 * - joinOperator: 'and' or 'or'
 *
 * Example: ?filters=[{"id":"continent","operator":"inArray",...}]&joinOperator=and
 */
export interface BackendFilterParams {
  filters?: string; // JSON stringified array of filter items
  joinOperator?: JoinOperator;
}

/**
 * Filter item as expected by the Django backend.
 *
 * This matches the structure defined in filter_serializer.py (FilterItemSerializer)
 */
export interface BackendFilterItem {
  id: string; // Field name (must match Django model field)
  value: string | string[]; // Filter value(s) - strings for serialization
  variant: FilterVariant; // Determines value processing
  operator: BackendFilterOperator; // Filter operation
  filterId: string; // Unique identifier for this filter instance
}

/**
 * Complete filter specification sent to backend.
 */
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

/**
 * Type guard to check if a value is a valid filter operator
 */
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

/**
 * Type guard to check if a value is a valid filter variant
 */
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

/**
 * Type guard to check if a value is a valid join operator
 */
export function isValidJoinOperator(
  operator: string,
): operator is JoinOperator {
  return operator === 'and' || operator === 'or';
}

/**
 * Validate operator compatibility with variant.
 *
 * @param variant - The filter variant
 * @param operator - The filter operator
 * @returns True if the operator is valid for the given variant
 *
 * @example
 * isOperatorValidForVariant('multiSelect', 'inArray') // true
 * isOperatorValidForVariant('text', 'inArray') // false
 */
export function isOperatorValidForVariant(
  variant: FilterVariant,
  operator: BackendFilterOperator,
): boolean {
  const validOps = VALID_OPERATORS[variant];
  return validOps.includes(operator);
}

/**
 * Get valid operators for a given variant.
 *
 * @param variant - The filter variant
 * @returns Array of valid operators for the variant
 */
export function getValidOperatorsForVariant(
  variant: FilterVariant,
): readonly BackendFilterOperator[] {
  return VALID_OPERATORS[variant];
}
