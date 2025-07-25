import React from "react";

const Input = React.forwardRef(({ className = "", ...props }, ref) => {
  const { label, id, ...restProps } = props;
  return (
    <>
      {label && (
        <label htmlFor={id} className="block mb-1 font-medium text-gray-700 dark:text-gray-100">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={`border rounded w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 transition-colors ${className}`}
        {...restProps}
      />
    </>
  );
});

export default Input;
