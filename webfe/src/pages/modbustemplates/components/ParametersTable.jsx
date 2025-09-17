const ParametersTable = ({ parameters = [] }) => {
  if (!parameters || parameters.length === 0) {
    return (
      <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          No parameters defined
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Parameters (JSON)
        </h3>
      </div>
      <div className="p-4 bg-white dark:bg-gray-900">
        <pre className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap overflow-x-auto">
          {JSON.stringify(parameters, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default ParametersTable;
