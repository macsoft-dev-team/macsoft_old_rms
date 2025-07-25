import React from 'react';

const DeviceMetricCard = ({
  title,
  value,
  unit,
  icon,
  color = 'gray',
  animation,
  children,
  className = '',
}) => {
  // Color classes for border and background
  const colorMap = {
    yellow: 'from-yellow-50 to-orange-50 border-yellow-400',
    blue: 'from-blue-50 to-indigo-50 border-blue-400',
    purple: 'from-purple-50 to-pink-50 border-purple-400',
    green: 'from-green-50 to-emerald-50 border-green-400',
    red: 'from-red-50 to-rose-50 border-red-400',
    cyan: 'from-cyan-50 to-blue-50 border-cyan-400',
    orange: 'from-orange-50 to-yellow-50 border-orange-400',
    indigo: 'from-indigo-50 to-purple-50 border-indigo-400',
    emerald: 'from-emerald-50 to-green-50 border-emerald-400',
    gray: 'from-gray-50 to-gray-100 border-gray-400',
    pink: 'from-pink-50 to-red-50 border-pink-400',
  };

  const bgBorder = colorMap[color] || colorMap.gray;

  return (
    <div
      className={`rounded-lg shadow-sm border bg-gradient-to-r ${bgBorder} p-4 flex flex-col justify-between ${className}`}
      style={animation ? { ...animation } : {}}
    >
      <div className="flex items-center space-x-3 mb-2">
        {icon && <div>{icon}</div>}
        <div>
          <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
          <div className="flex items-end space-x-1">
            <span className="text-2xl font-bold text-gray-800">{value ?? '--'}</span>
            {unit && <span className="text-sm text-gray-500">{unit}</span>}
          </div>
        </div>
      </div>
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
};

export default DeviceMetricCard;
