import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select...',
  className = '',
  disabled = false,
  id,
  name,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      setOpen((prev) => !prev);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const selectedOption = options.find(
    (option) => (option.value ?? option) === value
  );

  return (
    <div
      ref={containerRef}
      id={id}
      name={name}
      tabIndex={disabled ? -1 : 0}
      className={`relative w-full z-20 select-none whitespace-nowrap ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      aria-disabled={disabled}
      aria-label={placeholder}
      onClick={() => !disabled && setOpen((prev) => !prev)}
      onKeyDown={handleKeyDown}
      {...props}
    >
      <div
        className={`flex items-center justify-between w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded transition-all duration-150  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400 whitespace-nowrap`}
        tabIndex={-1}
      >
        <span className={`${!selectedOption ? 'text-gray-400 dark:text-gray-500' : ''} whitespace-nowrap`}>
          {selectedOption ? (selectedOption.label ?? selectedOption) : placeholder}
        </span>
        <ChevronDown size={20} className="ml-2 text-gray-400 dark:text-gray-500" />
      </div>
      {open && !disabled && (
        <div className="absolute left-0 mt-1 w-full rounded shadow-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 z-20 max-h-60 overflow-auto whitespace-nowrap">
          {options.length === 0 && (
            <div className="px-4 py-2 text-gray-400 dark:text-gray-500 whitespace-nowrap">No options</div>
          )}
          {options.map((option,i) => {
            const val = option.value ?? option;
            const label = option.label ?? option;
            const isSelected = value === val;
            return (
              <div
                key={i}
                className={`px-4 py-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 whitespace-nowrap ${
                  isSelected ? 'bg-blue-50 dark:bg-blue-800 font-semibold text-blue-700 dark:text-blue-200' : 'text-gray-700 dark:text-gray-100'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onChange) {
                    onChange({ target: { value: val, name } });
                  }
                  setOpen(false);
                }}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    if (onChange) {
                      onChange({ target: { value: val, name } });
                    }
                    setOpen(false);
                  }
                }}
              >
                {label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Select;
