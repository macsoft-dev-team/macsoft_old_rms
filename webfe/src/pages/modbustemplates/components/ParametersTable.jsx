const parseParameters = (str) => {
  if (!str) return [];
  if (typeof str !== 'string') {
    if (Array.isArray(str)) {
      return str.map(item => ({
        address: item.address || '',
        value: item.value || ''
      }));
    }
    return [];
  }
  const cleaned = str.trim().replace(/^\{/, '').replace(/;?\}$/, '');
  if (!cleaned) return [];
  return cleaned
    .split(',')
    .map(part => {
      const unquoted = part.replace(/^"|"$/g, '').trim();
      const colonIndex = unquoted.indexOf(':');
      if (colonIndex !== -1) {
        return {
          address: unquoted.substring(0, colonIndex),
          value: unquoted.substring(colonIndex + 1)
        };
      }
      return null;
    })
    .filter(Boolean);
};

const ParametersTable = ({ parameters = [] }) => {
  const items = parseParameters(parameters);

  if (!items || items.length === 0) {
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
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Address
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Value
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {items.map((param, index) => (
            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-mono">
                {param.address || '-'}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                {param.value || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParametersTable;

