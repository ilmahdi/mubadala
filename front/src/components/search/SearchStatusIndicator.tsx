/**
 * Search status indicator component
 *
 * Shows character count when below minimum requirement.
 */

import { memo } from 'react';
import { textStyles } from '@/src/config/component-styles';

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
    <span className={`${textStyles.muted} mr-2 text-xs`} aria-live="polite">
      {remaining} more char{remaining !== 1 ? 's' : ''}
    </span>
  );
});
