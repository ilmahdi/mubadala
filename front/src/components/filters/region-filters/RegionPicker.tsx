'use client';

import { useState, useRef, useEffect } from 'react';
import { Flag, Globe, X } from 'lucide-react';
import { filterStyles, badgeStyles } from '@/src/config/component-styles';

export default function RegionPicker({
  label,
  regions,
  placeholder,
  value = [],
  onChange,
}: {
  label: string;
  regions: string[];
  placeholder: string;
  value?: string[];
  onChange?: (selected: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>(value);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const removeCountry = (country: string) => {
    const newSelected = selected.filter((c) => c !== country);
    setSelected(newSelected);
    onChange?.(newSelected);
  };

  const addCountry = (country: string) => {
    if (!selected.includes(country)) {
      const newSelected = [...selected, country];
      setSelected(newSelected);
      onChange?.(newSelected);
      setSearchTerm('');
    }
  };

  const filteredCountries = regions.filter(
    (c) =>
      !selected.includes(c) &&
      c.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="bg-white">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className={filterStyles.sectionTitle}>{label}</label>

          {selected.length > 0 && (
            <button
              onClick={() => {
                const newSelected: string[] = [];
                setSelected(newSelected);
                onChange?.(newSelected);
              }}
              className={filterStyles.resetButton}
            >
              Clear All ({selected.length})
            </button>
          )}
        </div>

        {selected.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {selected.map((country) => (
              <span
                key={country}
                className={`${badgeStyles.default} ${badgeStyles.secondary} inline-flex items-center`}
              >
                {country}
                <button
                  type="button"
                  className="ml-1 flex h-4 w-4 items-center justify-center rounded-full transition-colors hover:bg-gray-200 focus:outline-none"
                  onClick={() => removeCountry(country)}
                  aria-label={`Remove ${country}`}
                >
                  <X className="h-3 w-3 cursor-pointer" />
                </button>
              </span>
            ))}
          </div>
        )}
        <div ref={wrapperRef} className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {label === 'Continents' ? (
              <Globe className="h-4 w-4 text-gray-400" />
            ) : (
              <Flag className="h-4 w-4 text-gray-400" />
            )}
          </span>

          <input
            className="focus:border-brand focus:ring-brand/20 w-full rounded-md border border-gray-200 bg-gray-50 py-2 pl-8 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:ring-2 focus:outline-none"
            placeholder={placeholder}
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
          />

          {showDropdown && filteredCountries.length > 0 && (
            <div
              className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-md"
              style={{ zIndex: 'var(--z-index-dropdown)' }}
            >
              {filteredCountries.map((country) => (
                <div
                  key={country}
                  className="cursor-pointer px-3 py-2 text-sm text-gray-900 transition-colors hover:bg-gray-100"
                  onClick={() => addCountry(country)}
                >
                  {country}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
