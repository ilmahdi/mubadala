import React from 'react';

export function DropdownPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white p-2 shadow-xl">
      {children}
    </div>
  );
}
