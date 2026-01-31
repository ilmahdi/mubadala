/**
 * Design Tokens - TypeScript Constants
 * Programmatic access to design tokens for use in JavaScript/TypeScript
 *
 * These values mirror the CSS custom properties in tokens.css
 * Use these when you need to access design values in JS logic (not styling)
 *
 * @example
 * import { colors, spacing, typography } from '@/src/config/design-tokens';
 *
 * const brandColor = colors.brand.primary;
 * const cardPadding = spacing[4];
 */

export const colors = {
  // Brand Colors
  brand: {
    primary: '#c1272d',
    primaryHover: '#a81f24',
    primaryLight: '#c65054',
    primaryLighter: '#f8d7d9',
    primaryAlpha10: 'rgba(193, 39, 45, 0.1)',
    primaryAlpha20: 'rgba(193, 39, 45, 0.2)',
  },

  // Gray Scale
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Semantic Colors
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
  },

  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },

  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },

  // Flow Type Colors (Trade-specific)
  flow: {
    import: {
      text: '#be123c',
      bg: '#fff1f2',
      border: '#ffe4e6',
    },
    export: {
      text: '#047857',
      bg: '#ecfdf5',
      border: '#d1fae5',
    },
    tempWithout: {
      text: '#b45309',
      bg: '#fffbeb',
      border: '#fef3c7',
    },
    tempWith: {
      text: '#c2410c',
      bg: '#fff7ed',
      border: '#ffedd5',
    },
    reexportWith: {
      text: '#6d28d9',
      bg: '#faf5ff',
      border: '#f3e8ff',
    },
    reexportWithout: {
      text: '#1d4ed8',
      bg: '#eff6ff',
      border: '#dbeafe',
    },
  },

  // Semantic Aliases
  background: 'oklch(100% 0.00011 271.152)',
  foreground: 'oklch(0.145 0 0)',
  surface: '#ffffff',
  surfaceSecondary: '#f9fafb',
  surfaceTertiary: '#f3f4f6',

  border: '#e5e7eb',
  borderLight: '#f3f4f6',
  borderStrong: '#d1d5db',

  text: {
    primary: '#111827',
    secondary: '#4b5563',
    tertiary: '#6b7280',
    muted: '#9ca3af',
    inverse: '#ffffff',
  },

  interactive: {
    primary: '#c1272d',
    primaryHover: '#a81f24',
    secondary: '#374151',
    secondaryHover: '#1f2937',
  },
} as const;

export const typography = {
  // Font Families
  fontFamily: {
    primary:
      "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    secondary: "'Hind', sans-serif",
    accent: "'Raleway', sans-serif",
    mono: "'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace",
  },

  // Font Sizes (in rem)
  fontSize: {
    '2xs': '0.625rem', // 10px
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
  },

  // Font Weights
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Line Heights
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

export const spacing = {
  0: '0',
  0.5: '0.125rem', // 2px
  1: '0.25rem', // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem', // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  7: '1.75rem', // 28px
  8: '2rem', // 32px
  9: '2.25rem', // 36px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  14: '3.5rem', // 56px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
} as const;

export const radius = {
  none: '0',
  sm: '0.125rem', // 2px
  base: '0.25rem', // 4px
  md: '0.375rem', // 6px
  lg: '0.5rem', // 8px
  xl: '0.75rem', // 12px
  '2xl': '1rem', // 16px
  '3xl': '1.5rem', // 24px
  full: '9999px',
} as const;

export const shadows = {
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  none: '0 0 0 0 transparent',
} as const;

export const transitions = {
  duration: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  timing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalBackdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
  notification: 80,
} as const;

export const sizing = {
  icon: {
    xs: '0.875rem', // 14px
    sm: '1rem', // 16px
    base: '1.25rem', // 20px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
  },
  input: {
    sm: '2rem', // 32px
    base: '2.5rem', // 40px
    lg: '3rem', // 48px
  },
  button: {
    sm: '2rem', // 32px
    base: '2.25rem', // 36px
    lg: '2.5rem', // 40px
  },
  table: {
    row: '3rem', // 48px
    header: '2.5rem', // 40px
  },
  header: '3.5rem', // 56px
  sidebar: '16rem', // 256px
} as const;

export const opacity = {
  disabled: 0.5,
  hover: 0.9,
  focus: 0.8,
} as const;

/**
 * Breakpoints for responsive design
 * Use these with CSS media queries or JS logic
 */
export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

/**
 * Type exports for TypeScript IntelliSense
 */
export type ColorToken = typeof colors;
export type TypographyToken = typeof typography;
export type SpacingToken = typeof spacing;
export type RadiusToken = typeof radius;
export type ShadowToken = typeof shadows;
export type TransitionToken = typeof transitions;
export type ZIndexToken = typeof zIndex;
export type SizingToken = typeof sizing;
export type OpacityToken = typeof opacity;
export type BreakpointToken = typeof breakpoints;

/**
 * Helper function to get CSS variable
 * @param token - CSS variable name without -- prefix
 * @returns CSS variable with fallback
 */
export function getCSSVar(token: string, fallback?: string): string {
  return fallback ? `var(--${token}, ${fallback})` : `var(--${token})`;
}

/**
 * Default export with all tokens
 */
export default {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  transitions,
  zIndex,
  sizing,
  opacity,
  breakpoints,
  getCSSVar,
} as const;
