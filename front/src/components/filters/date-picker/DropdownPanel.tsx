import React from 'react';

export function DropdownPanel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="absolute mt-1 w-full rounded-md border border-gray-300 bg-white p-2 shadow-xl"
      style={{ zIndex: 'var(--z-index-dropdown)' }}
    >
      {children}
    </div>
  );
}
