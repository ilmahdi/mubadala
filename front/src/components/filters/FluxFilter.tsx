import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function FluxFilter() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('All Flows');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = ['All Flows', 'Import', 'Export'];

  const handleSelect = (option: string) => {
    setSelected(option);
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
      <label className="text-sm font-medium">Flow</label>
      <div className="relative mt-2" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-primary w-full rounded-md border border-gray-200 bg-gray-50 py-2 pr-8 pl-2 text-left text-sm focus:ring-1 focus:ring-gray-200 focus:outline-none"
        >
          {selected}
        </button>
        <ChevronDown className="text-primary pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2" />

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white p-1 shadow-xl">
            {options.map((option) => (
              <div
                key={option}
                onClick={() => handleSelect(option)}
                className="font-regular text-primary cursor-pointer px-2 py-2 text-sm first:rounded-t-xs last:rounded-b-xs hover:bg-gray-50"
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
