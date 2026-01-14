'use client';

import { useState, useRef, useEffect } from 'react';
import { Flag, Globe, X } from 'lucide-react';

export default function RegionPicker({
  label,
  regions,
  placeholder,
}: {
  label: string;
  regions: string[];
  placeholder: string;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

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
    setSelected(selected.filter((c) => c !== country));
  };

  const addCountry = (country: string) => {
    if (!selected.includes(country)) {
      setSelected([...selected, country]);
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
          <label className="text-sm font-medium">{label}</label>

          {selected.length > 0 && (
            <button
              onClick={() => setSelected([])}
              className="text-brand text-xs hover:underline"
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
                className="inline-flex items-center rounded-full border-[0.4px] border-gray-300 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-600"
              >
                {country}
                <button
                  type="button"
                  className="ml-1 flex h-4 w-4 items-center justify-center rounded-full hover:bg-gray-100 focus:outline-none"
                  onClick={() => removeCountry(country)}
                >
                  <X className="h-3 w-3 cursor-pointer text-gray-600" />
                </button>
              </span>
            ))}
          </div>
        )}
        <div ref={wrapperRef} className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {label === 'Continents' ? (
              <Globe className="h-4 w-4 text-gray-500" />
            ) : (
              <Flag className="h-4 w-4 text-gray-500" />
            )}
          </span>

          <input
            className="w-full rounded-md border border-gray-200 bg-white py-2 pl-8 text-sm focus:ring-1 focus:ring-gray-200 focus:outline-none"
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
            <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
              {filteredCountries.map((country) => (
                <div
                  key={country}
                  className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-50"
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
