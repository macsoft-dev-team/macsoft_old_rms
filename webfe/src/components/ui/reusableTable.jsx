import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Button } from './button';

const ReusableTable = ({ columns, data, headerColor, headerTextColor, size, onRowClick, onEdit, onDelete, onView, loading, SNo, currentPage, pageSize ,bordered}) => {
    // Helper to get Tailwind class for alignment
    const getAlignClass = (align) => {
        if (align === 'right' || align === 'end') return 'text-right';
        if (align === 'center') return 'text-center';
        return 'text-left';
    };

    // Helper to get Tailwind class for text wrapping
    const getWrapClass = (textWrap, truncate) => {
        if (truncate) return 'truncate';
        if (textWrap === 'nowrap') return 'whitespace-nowrap';
        if (textWrap === 'wrap') return 'whitespace-normal';
        return '';
    };

    const showActions = onEdit || onDelete || onView;
    return (
        <div className="reusable-table-wrapper overflow-x-auto">
            <table className={`min-w-full border border-gray-300 dark:border-gray-700 rounded-lg ${size === 'sm' ? 'text-base' : 'text-lg'} bg-white dark:bg-gray-900`}>
                <thead>
                    <tr>
                        {SNo && (
                            <th
                                style={{ minWidth: 50 }}
                                className={`text-center uppercase font-semibold p-3 ${headerColor} ${headerTextColor} ${bordered ? 'border border-gray-300 dark:border-gray-700' : ''}`}
                            >
                                SNo
                            </th>
                        )}
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                style={{
                                    ...(col.width ? { width: col.width, minWidth: 50 } : { minWidth: 50 }),
                                 }}
                                className={`${getAlignClass(col.align)} ${getWrapClass(col.textWrap, col.truncate)} uppercase font-semibold p-3 ${headerColor} ${headerTextColor} ${bordered ? 'border border-gray-300 dark:border-gray-700' : ''}`}
                            >
                                {col.label}
                            </th>
                        ))}
                        {showActions && (
                            <th
                                 className={`text-center uppercase font-semibold p-3 ${headerColor} ${headerTextColor} ${bordered ? 'border border-gray-300 dark:border-gray-700' : ''}`}
                            >
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, i) => (
                        <tr
                            key={i}
                            onClick={() => onRowClick && onRowClick(row)}
                            className={`${onRowClick ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-blue-950' : ''} dark:bg-gray-900`}
                        >
                            {SNo && (
                                <td className={`text-center p-3 dark:text-blue-100 ${bordered ? 'border border-gray-300 dark:border-gray-700' : ''}`}>{((currentPage - 1) * pageSize) + i + 1}</td>
                            )}
                            {columns.map((col) => (
                                <td
                                    key={col.key}
                                    style={col.width ? { width: col.width, minWidth: 50 } : { minWidth: 50 }}
                                    className={`${getAlignClass(col.align)} ${getWrapClass(col.textWrap, col.truncate)} p-3 dark:text-gray-200 ${bordered ? 'border border-gray-300 dark:border-gray-700' : ''}`}
                                >
                                    {col.dataType === 'date'
                                        ? (row[col.key] ? new Date(row[col.key]).toLocaleString() : "")
                                        : row[col.key] ? row[col.key] : <div className='text-center'>--</div>
                                    }
                                </td>
                            ))}
                            {showActions && (
                                <td className={`text-center p-3 dark:text-blue-100 ${bordered ? 'border border-gray-300 dark:border-gray-700' : ''}`}>
                                    <div className="flex items-center justify-center gap-2">
                                        {onView && <Button className="bg-gray-500 hover:bg-gray-300 text-gray-700 dark:bg-blue-900 dark:hover:bg-blue-800 dark:text-blue-100" onClick={e => { e.stopPropagation(); onView(row); }}><Eye size={16} /></Button>}
                                        {onEdit && <Button className="bg-green-500 hover:bg-green-300 text-green-700 dark:bg-blue-900 dark:hover:bg-blue-800 dark:text-blue-100" onClick={e => { e.stopPropagation(); onEdit(row); }}><Pencil size={16} /></Button>}
                                        {onDelete && <Button className="bg-red-500 hover:bg-red-300 text-red-700 dark:bg-blue-900 dark:hover:bg-blue-800 dark:text-blue-100" onClick={e => { e.stopPropagation(); onDelete(row); }}><Trash2 size={16} /></Button>}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
                {data.length === 0 && !loading && (
                    <tbody>
                        <tr>
                            <td colSpan={columns.length + (showActions ? 1 : 0) + (SNo ? 1 : 0)} className={`text-center text-gray-400 dark:text-blue-200 py-6 dark:bg-gray-900 ${bordered ? 'border border-gray-300 dark:border-gray-700' : ''}`}>
                                No data available
                            </td>
                        </tr>
                    </tbody>
                )}
                {data.length === 0 && loading && (
                    <tbody>
                        <tr>
                            <td colSpan={columns.length + (showActions ? 1 : 0) + (SNo ? 1 : 0)} className={`text-center py-6 dark:bg-gray-900 ${bordered ? 'border border-gray-300 dark:border-gray-700' : ''}`}>
                                <div className="flex h-12 items-center justify-center text-blue-500 dark:text-blue-300">Loading <span className="ml-2 animate-spin border-2 border-blue-500 border-t-transparent rounded-full w-4 h-4 inline-block"></span></div>
                            </td>
                        </tr>
                    </tbody>
                )}
            </table>
        </div>
    );
};

export default ReusableTable;
