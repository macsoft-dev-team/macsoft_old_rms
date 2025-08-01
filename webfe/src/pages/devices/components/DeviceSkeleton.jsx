const DeviceSkeleton = () => (
  <div className="animate-pulse border border-gray-200 shadow-sm bg-gray-200 dark:bg-gray-700 rounded-lg h-40 w-full flex flex-col gap-4 p-4">
    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-2"></div>
    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mb-2"></div>
    <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
  </div>
);

export default DeviceSkeleton;
