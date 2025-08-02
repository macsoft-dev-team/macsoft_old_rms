 
const DeviceMetricCard = ({
  title,
  value,
  unit,
  icon,
  animation,
  children,
  className = '',
}) => {
 
  return (
    <div
      className={`relative overflow-hidden rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 flex flex-col gap-3 transition-transform hover:scale-[1.025] hover:shadow-xl ${className}`}
      style={animation ? { ...animation } : {}}
    >
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full opacity-30 pointer-events-none z-0" />

      <div className="flex items-center gap-4 z-10">
        {icon && (
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 shadow-inner text-3xl">
            {icon}
          </div>
        )}
        <div className="flex flex-col justify-center">
          <h4 className="text-base font-semibold text-gray-700 dark:text-gray-200 tracking-wide mb-1">{title}</h4>
          <div className="flex items-end gap-1">
            <span className="text-3xl font-extrabold text-gray-900 dark:text-white leading-none drop-shadow-sm">{value ?? '--'}</span>
            {unit && <span className="text-base text-gray-500 dark:text-gray-400 font-medium mb-0.5">{unit}</span>}
          </div>
        </div>
      </div>

      {children && <div className="mt-3 z-10">{children}</div>}
    </div>
  );
};

export default DeviceMetricCard;
