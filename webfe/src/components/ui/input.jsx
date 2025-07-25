import React from "react";

const Input = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`border rounded w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 transition-colors ${className}`}
      {...props}
    />
  );
});

export default Input;
