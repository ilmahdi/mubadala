import { createParser } from 'nuqs/server';
import { z } from 'zod';

import { dataTableConfig } from '@/src/config/data-table';
import type {
  ExtendedColumnFilter,
  ExtendedColumnSort,
} from '@/src/types/data-table';

/**
 * Helper function to normalize column IDs to a Set
 */
function normalizeColumnIds(
  columnIds?: string[] | Set<string>,
): Set<string> | null {
  if (!columnIds) return null;
  return columnIds instanceof Set ? columnIds : new Set(columnIds);
}

/**
 * Helper function to validate parsed data against column IDs
 */
function isValidColumnId(id: string, validKeys: Set<string> | null): boolean {
  return !validKeys || validKeys.has(id);
}

// Schema definitions
const sortingItemSchema = z.object({
  id: z.string(),
  desc: z.boolean(),
});

const filterItemSchema = z.object({
  id: z.string(),
  value: z
    .union([z.string(), z.number(), z.array(z.union([z.string(), z.number()]))])
    .nullable(),
  variant: z.enum(dataTableConfig.filterVariants),
  operator: z.enum(dataTableConfig.operators),
  filterId: z.string(),
});

export type FilterItemSchema = z.infer<typeof filterItemSchema>;

export const getSortingStateParser = <TData>(
  columnIds?: string[] | Set<string>,
) => {
  const validKeys = normalizeColumnIds(columnIds);

  return createParser({
    parse: (value: string) => {
      try {
        const parsed = JSON.parse(value);
        const result = z.array(sortingItemSchema).safeParse(parsed);

        if (!result.success) return null;
        if (result.data.some((item) => !isValidColumnId(item.id, validKeys))) {
          return null;
        }

        return result.data as ExtendedColumnSort<TData>[];
      } catch {
        return null;
      }
    },
    serialize: (value: ExtendedColumnSort<TData>[]) => JSON.stringify(value),
    eq: (a: ExtendedColumnSort<TData>[], b: ExtendedColumnSort<TData>[]) =>
      a.length === b.length &&
      a.every(
        (item, index) =>
          item.id === b[index]?.id && item.desc === b[index]?.desc,
      ),
  });
};

export const getFiltersStateParser = <TData>(
  columnIds?: string[] | Set<string>,
) => {
  const validKeys = normalizeColumnIds(columnIds);

  return createParser({
    parse: (value: string) => {
      try {
        const parsed = JSON.parse(value);
        const result = z.array(filterItemSchema).safeParse(parsed);

        if (!result.success) return null;
        if (result.data.some((item) => !isValidColumnId(item.id, validKeys))) {
          return null;
        }

        return result.data as ExtendedColumnFilter<TData>[];
      } catch {
        return null;
      }
    },
    serialize: (value: ExtendedColumnFilter<TData>[]) => JSON.stringify(value),
    eq: (a: ExtendedColumnFilter<TData>[], b: ExtendedColumnFilter<TData>[]) =>
      a.length === b.length &&
      a.every(
        (filter, index) =>
          filter.id === b[index]?.id &&
          filter.value === b[index]?.value &&
          filter.variant === b[index]?.variant &&
          filter.operator === b[index]?.operator,
      ),
  });
};
