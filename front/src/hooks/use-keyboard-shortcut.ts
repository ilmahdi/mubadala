/**
 * Custom hook for keyboard shortcuts
 */

import { useEffect } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  callback: (event: KeyboardEvent) => void;
  preventDefault?: boolean;
}

/**
 * Hook to register keyboard shortcuts
 *
 * @param shortcuts - Array of keyboard shortcut configurations
 *
 * @example
 * useKeyboardShortcut([
 *   { key: 'k', ctrl: true, callback: () => focusSearch() },
 *   { key: 'Escape', callback: () => clearSearch() }
 * ]);
 */
export function useKeyboardShortcut(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      shortcuts.forEach(
        ({ key, ctrl, meta, shift, alt, callback, preventDefault = true }) => {
          const ctrlMatch = ctrl === undefined || event.ctrlKey === ctrl;
          const metaMatch = meta === undefined || event.metaKey === meta;
          const shiftMatch = shift === undefined || event.shiftKey === shift;
          const altMatch = alt === undefined || event.altKey === alt;
          const keyMatch = event.key.toLowerCase() === key.toLowerCase();

          if (keyMatch && ctrlMatch && metaMatch && shiftMatch && altMatch) {
            if (preventDefault) {
              event.preventDefault();
            }
            callback(event);
          }
        },
      );
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}
