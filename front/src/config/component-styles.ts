/**
 * Component Style Utilities
 * Pre-built style combinations using design tokens for common component patterns
 *
 * These utilities ensure consistency across components and reduce duplication
 * Use these instead of hardcoding Tailwind classes
 *
 * @example
 * import { cardStyles, buttonStyles, textStyles } from '@/src/config/component-styles';
 *
 * <div className={cardStyles.default}>
 *   <h2 className={textStyles.heading.h2}>Title</h2>
 *   <p className={textStyles.body.default}>Content</p>
 * </div>
 */

/**
 * Card Component Styles
 */
export const cardStyles = {
  default: 'rounded-md border border-gray-200 bg-white p-4 shadow-sm',
  compact: 'rounded-md border border-gray-100 bg-white p-3',
  elevated: 'rounded-lg border border-gray-200 bg-white p-6 shadow-md',
  interactive:
    'rounded-md border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-gray-300',
  flat: 'rounded-md',
} as const;

/**
 * Text/Typography Styles
 */
export const textStyles = {
  // Headings
  heading: {
    h1: 'text-4xl font-bold text-gray-900 leading-tight',
    h2: 'text-3xl font-semibold text-gray-900 leading-tight',
    h3: 'text-2xl font-semibold text-gray-900 leading-snug',
    h4: 'text-xl font-semibold text-gray-900 leading-snug',
    h5: 'text-lg font-medium text-gray-900 leading-normal',
    h6: 'text-base font-medium text-gray-900 leading-normal',
  },

  // Body text
  body: {
    large: 'text-lg text-gray-700 leading-relaxed',
    default: 'text-base text-gray-700 leading-normal',
    small: 'text-sm text-gray-600 leading-normal',
    xs: 'text-xs text-gray-500 leading-normal',
  },

  // Specialized text
  label: 'text-sm font-medium text-gray-900 leading-normal',
  caption: 'text-xs text-gray-500 leading-snug',
  muted: 'text-xs text-gray-500',
  code: 'font-mono text-xs text-gray-700 whitespace-nowrap',
  link: 'text-brand underline-offset-4 hover:underline transition-colors',
  error: 'text-sm text-error-600',
  success: 'text-sm text-success-600',
  warning: 'text-sm text-warning-600',
} as const;

/**
 * Badge/Tag Styles
 */
export const badgeStyles = {
  default:
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',

  // Variants
  primary: 'bg-brand/10 text-brand border border-brand/20',
  secondary: 'bg-gray-100 text-gray-700 border border-gray-200',
  success: 'bg-success-50 text-success-700 border border-success-100',
  error: 'bg-error-50 text-error-700 border border-error-100',
  warning: 'bg-warning-50 text-warning-700 border border-warning-100',
  info: 'bg-info-50 text-info-700 border border-info-100',

  // Sizes
  sm: 'px-2 py-0.5 text-2xs',
  md: 'px-2.5 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm',
} as const;

/**
 * Flow Type Badge Styles (Trade-specific)
 */
export const flowBadgeStyles = {
  base: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border lowercase',

  import: 'text-rose-700 bg-rose-50 border-rose-100/50',
  export: 'text-emerald-700 bg-emerald-50 border-emerald-100/50',
  tempWithout: 'text-amber-700 bg-amber-50 border-amber-100/50',
  tempWith: 'text-orange-700 bg-orange-50 border-orange-100/50',
  reexportWith: 'text-purple-700 bg-purple-50 border-purple-100/50',
  reexportWithout: 'text-blue-700 bg-blue-50 border-blue-100/50',
  default: 'text-gray-700 bg-gray-50 border-gray-200',
} as const;

/**
 * Input/Form Field Styles
 */
export const inputStyles = {
  base: 'flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20 focus-visible:border-brand disabled:cursor-not-allowed disabled:opacity-50',

  error:
    'border-error-500 focus-visible:ring-error-500/20 focus-visible:border-error-500',
  success:
    'border-success-500 focus-visible:ring-success-500/20 focus-visible:border-success-500',

  sm: 'h-8 text-xs px-2.5',
  default: 'h-9 text-sm px-3',
  lg: 'h-10 text-base px-4',
} as const;

/**
 * Button Container Styles (use with Button component variants)
 */
export const buttonContainerStyles = {
  group: 'flex items-center gap-2',
  toolbar: 'flex items-center gap-1',
  stack: 'flex flex-col gap-2',
} as const;

/**
 * Layout Container Styles
 */
export const containerStyles = {
  page: 'min-h-screen bg-background',
  section: 'w-full px-6 py-8',
  content: 'mx-auto max-w-7xl',
  sidebar:
    'w-64 min-w-min flex-col gap-1 space-y-4 rounded-md border border-gray-100 bg-white p-4',

  // Flex layouts
  flexRow: 'flex flex-row items-center gap-4',
  flexCol: 'flex flex-col gap-4',
  flexBetween: 'flex items-center justify-between',
  flexCenter: 'flex items-center justify-center',

  // Grid layouts
  grid2: 'grid grid-cols-2 gap-4',
  grid3: 'grid grid-cols-3 gap-4',
  grid4: 'grid grid-cols-4 gap-4',
  gridAuto: 'grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4',
} as const;

/**
 * Table Styles
 */
export const tableStyles = {
  wrapper: 'relative w-full overflow-auto rounded-md border border-gray-200',
  table: 'w-full caption-bottom text-sm',
  header: 'text-xs border-b border-gray-200 bg-gray-50 text-gray-600',
  headerRow: 'border-b border-gray-200 transition-colors hover:bg-gray-50/50',
  headerCell:
    'h-10 px-4 text-left align-middle font-medium text-gray-600 [&:has([role=checkbox])]:pr-0',
  body: '[&_tr:last-child]:border-0',
  row: 'border-b border-gray-100 transition-colors hover:bg-gray-50 data-[state=selected]:bg-gray-50',
  cell: 'p-4 align-middle [&:has([role=checkbox])]:pr-0',

  // Cell content types
  cellNumeric: 'text-xs text-right tabular-nums font-medium text-gray-900',
  cellText: 'text-sm text-gray-700',
  cellMuted: 'text-xs text-gray-500',
  cellCode: 'font-mono text-xs text-gray-700 whitespace-nowrap',
} as const;

/**
 * Modal/Dialog Styles
 */
export const dialogStyles = {
  overlay:
    'fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
  content:
    'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-200 bg-white p-6 shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg',
  header: 'flex flex-col space-y-1.5 text-center sm:text-left',
  title: 'text-lg font-semibold leading-none tracking-tight',
  description: 'text-sm text-gray-500',
  footer: 'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
} as const;

/**
 * Dropdown/Popover Styles
 */
export const dropdownStyles = {
  trigger:
    'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20 disabled:pointer-events-none disabled:opacity-50',
  content:
    'z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-300 bg-white/95 p-1 shadow-md backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
  item: 'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
  separator: 'h-px bg-gray-200 my-1',
  label: 'px-2 py-1.5 text-xs font-semibold text-gray-600',
} as const;

/**
 * Loading/Skeleton Styles
 */
export const skeletonStyles = {
  base: 'animate-pulse rounded-md bg-gray-200',
  text: 'h-4 w-full animate-pulse rounded bg-gray-200',
  circle: 'rounded-full animate-pulse bg-gray-200',
  button: 'h-9 w-24 animate-pulse rounded-md bg-gray-200',
  card: 'h-32 w-full animate-pulse rounded-md bg-gray-200',
} as const;

/**
 * Status Indicator Styles
 */
export const statusStyles = {
  dot: 'inline-block h-2 w-2 rounded-full',

  success: 'bg-success-500',
  error: 'bg-error-500',
  warning: 'bg-warning-500',
  info: 'bg-info-500',
  neutral: 'bg-gray-400',
} as const;

/**
 * Divider/Separator Styles
 */
export const separatorStyles = {
  horizontal: 'h-px w-full bg-gray-200',
  vertical: 'w-px h-full bg-gray-200',
  withText:
    'flex items-center text-xs text-gray-500 before:flex-1 before:border-t before:border-gray-200 before:mr-3 after:flex-1 after:border-t after:border-gray-200 after:ml-3',
} as const;

/**
 * Filter Panel Styles (Trade-specific)
 */
export const filterStyles = {
  container:
    'flex max-h-fit w-64 min-w-min flex-col gap-1 space-y-4 rounded-md border border-gray-100 bg-white p-4',
  header: 'flex items-center justify-between',
  title: 'text-sm font-medium text-gray-600 uppercase tracking-wide',
  resetButton:
    'text-brand cursor-pointer text-xs hover:underline transition-colors',
  section: 'space-y-2',
  sectionTitle: 'text-xs font-medium text-gray-700',
} as const;

/**
 * Search Bar Styles
 */
export const searchStyles = {
  container:
    'flex items-center flex-wrap rounded-md border border-gray-200 bg-white px-2 py-1 transition-colors focus-within:border-gray-200 focus-within:ring-2 focus-within:ring-gray-100',
  input: 'flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400',
  icon: 'text-gray-400 h-4 w-4',
} as const;

/**
 * Pagination Styles
 */
export const paginationStyles = {
  container:
    'flex flex-col gap-4 px-1 py-1 sm:flex-row sm:items-center sm:justify-between',
  text: 'text-xs font-medium text-gray-600',
  textBold: 'font-semibold text-gray-900',
  button:
    'inline-flex h-7 w-7 items-center justify-center rounded border border-gray-300 outline-0 transition-colors hover:border-gray-400 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20 focus-visible:border-brand',
  buttonGroup: 'flex items-center gap-1',
  controls: 'flex flex-wrap items-center gap-3',
  pageInfo: 'text-xs font-medium whitespace-nowrap text-gray-600',
} as const;

/**
 * Header Styles
 */
export const headerStyles = {
  container: 'sticky top-0 border border-gray-100 bg-white shadow-xs',
  inner: 'flex h-14 items-center justify-between px-6',
  logo: 'flex items-center gap-2',
  logoIcon: 'flex h-10 w-10 items-center justify-center text-brand',
  logoText: 'text-lg font-semibold tracking-tight text-gray-900',
  actions: 'flex items-center gap-3',
} as const;

/**
 * Avatar Styles
 */
export const avatarStyles = {
  base: 'flex items-center justify-center rounded-full font-medium text-white transition-colors',
  sm: 'h-6 w-6 text-xs',
  md: 'h-7 w-7 text-sm',
  lg: 'h-10 w-10 text-base',
  interactive:
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20 focus-visible:border-brand',
  brand: 'bg-brand hover:bg-brand-hover',
} as const;

/**
 * Scrollbar Styles
 */
export const scrollbarStyles = {
  default:
    '[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400',
  thin: '[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full',
} as const;

/**
 * Animation Classes
 */
export const animationStyles = {
  fadeIn: 'animate-in fade-in-0 duration-200',
  fadeOut: 'animate-out fade-out-0 duration-200',
  slideInFromTop: 'animate-in slide-in-from-top-2 duration-200',
  slideInFromBottom: 'animate-in slide-in-from-bottom-2 duration-200',
  slideInFromLeft: 'animate-in slide-in-from-left-2 duration-200',
  slideInFromRight: 'animate-in slide-in-from-right-2 duration-200',
  zoomIn: 'animate-in zoom-in-95 duration-200',
  zoomOut: 'animate-out zoom-out-95 duration-200',
} as const;

/**
 * Utility to combine multiple style classes
 */
export function combineStyles(
  ...styles: (string | undefined | false)[]
): string {
  return styles.filter(Boolean).join(' ');
}

/**
 * Default export with all style utilities
 */
export default {
  card: cardStyles,
  text: textStyles,
  badge: badgeStyles,
  flowBadge: flowBadgeStyles,
  input: inputStyles,
  buttonContainer: buttonContainerStyles,
  container: containerStyles,
  table: tableStyles,
  dialog: dialogStyles,
  dropdown: dropdownStyles,
  skeleton: skeletonStyles,
  status: statusStyles,
  separator: separatorStyles,
  filter: filterStyles,
  search: searchStyles,
  pagination: paginationStyles,
  header: headerStyles,
  avatar: avatarStyles,
  scrollbar: scrollbarStyles,
  animation: animationStyles,
  combineStyles,
} as const;
