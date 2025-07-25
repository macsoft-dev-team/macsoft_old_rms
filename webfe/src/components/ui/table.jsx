 
export function Table({ children, ...props }) {
  return (
    <table className="min-w-full divide-y divide-gray-200" {...props}>
      {children}
    </table>
  );
}

export function TableHeader({ children, ...props }) {
  return (
    <thead className="bg-gray-50" {...props}>
      {children}
    </thead>
  );
}

export function TableRow({ children, ...props }) {
  return (
    <tr className="hover:bg-gray-100" {...props}>
      {children}
    </tr>
  );
}

export function TableHead({ children, ...props }) {
  return (
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" {...props}>
      {children}
    </th>
  );
}

export function TableBody({ children, ...props }) {
  return (
    <tbody className="bg-white divide-y divide-gray-200" {...props}>
      {children}
    </tbody>
  );
}

export function TableCell({ children, ...props }) {
  return (
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" {...props}>
      {children}
    </td>
  );
}
