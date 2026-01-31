import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useQueryState } from 'nuqs';
import { filterStyles } from '@/src/config/component-styles';

export default function FluxFilter() {
  const [isOpen, setIsOpen] = useState(false);
  const [flowLabel, setFlowLabel] = useQueryState('flow_label');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = ['All Flows', 'Import', 'Export'] as const;
  const selected: string =
    flowLabel === 'Import'
      ? 'Import'
      : flowLabel === 'Export'
        ? 'Export'
        : 'All Flows';

  const handleSelect = (option: string) => {
    if (option === 'All Flows') {
      setFlowLabel(null);
    } else {
      setFlowLabel(option);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="bg-white">
      <label className={filterStyles.sectionTitle}>Flow</label>
      <div className="relative mt-2" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="focus:border-brand focus:ring-brand/20 w-full rounded-md border border-gray-200 bg-gray-50 py-2 pr-8 pl-2 text-left text-sm text-gray-900 transition-colors focus:ring-2 focus:outline-none"
        >
          {selected}
        </button>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-gray-500" />

        {isOpen && (
          <div
            className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white p-1 shadow-md"
            style={{ zIndex: 'var(--z-index-dropdown)' }}
          >
            {options.map((option) => (
              <div
                key={option}
                onClick={() => handleSelect(option)}
                className="cursor-pointer rounded-sm px-2 py-2 text-sm text-gray-900 transition-colors first:rounded-t-sm last:rounded-b-sm hover:bg-gray-100"
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
