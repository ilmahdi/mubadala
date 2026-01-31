/**
 * Search status indicator component
 *
 * Shows character count when below minimum requirement.
 */

import { memo } from 'react';

interface SearchStatusIndicatorProps {
  currentLength: number;
  minChars: number;
}

export const SearchStatusIndicator = memo(function SearchStatusIndicator({
  currentLength,
  minChars,
}: SearchStatusIndicatorProps) {
  if (currentLength === 0 || currentLength >= minChars) {
    return null;
  }

  const remaining = minChars - currentLength;

  return (
    <span className="mr-2 text-xs text-gray-400" aria-live="polite">
      {remaining} more char{remaining !== 1 ? 's' : ''}
    </span>
  );
});
