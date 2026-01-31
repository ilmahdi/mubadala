import React from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownButtonProps {
  value: React.ReactNode | null;
  placeholder: string;
  onClick: () => void;
  disabled?: boolean;
}

export function DropdownButton({
  value,
  placeholder,
  onClick,
  disabled,
}: DropdownButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="focus:border-brand focus:ring-brand/20 relative w-full rounded-md border border-gray-200 bg-gray-50 py-1 pr-8 pl-2 text-left text-sm transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:text-gray-300"
    >
      <span className={value ? 'text-primary' : 'text-gray-400'}>
        {value ?? placeholder}
      </span>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
    </button>
  );
}
