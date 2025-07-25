
import React from 'react';

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
  return (
    <div className={`relative w-full`}>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        aria-label={placeholder}
        className={`w-full appearance-none bg-white border border-gray-300 px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-150  ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
        {...props}
      >
        <option value="" disabled hidden>{placeholder}</option>
        {options.map((option) => {
          const val = option.value ?? option;
          const label = option.label ?? option;
          return (
            <option key={val} value={val}>
              {label}
            </option>
          );
        })}
      </select>
      {/* Custom dropdown arrow */}
      <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
          <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  );
};

export default Select;
