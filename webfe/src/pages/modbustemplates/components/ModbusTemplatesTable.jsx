import { FileText, Edit, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import ModbusTemplateModal from './ModbusTemplateModal';

const ModbusTemplatesTable = ({
  templates,
  onView,
  onEdit,
  onDelete,
  isViewing,
  setIsViewing,
  viewTemplate
}) => {
  if (!templates || templates.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400">No templates available</p>
      </div>
    );
  }
  return(
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-800">
      <thead className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
        <tr>
          <th className="px-8 py-4 text-left text-xs font-bold text-blue-900 dark:text-blue-100 uppercase tracking-widest">#</th>
          <th className="px-8 py-4 text-left text-xs font-bold text-blue-900 dark:text-blue-100 uppercase tracking-widest">Template Name</th>
          <th className="px-8 py-4 text-left text-xs font-bold text-blue-900 dark:text-blue-100 uppercase tracking-widest">Drive Code</th>
          <th className="px-8 py-4 text-left text-xs font-bold text-blue-900 dark:text-blue-100 uppercase tracking-widest">Parameters</th>
          <th className="px-8 py-4 text-left text-xs font-bold text-blue-900 dark:text-blue-100 uppercase tracking-widest">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 dark:divide-blue-900">
        {templates.map((template, index) => (
          <tr key={template.id} className="group hover:bg-gray-50 dark:hover:bg-blue-950 transition-colors">
            <td className="px-8 py-4 whitespace-nowrap text-base text-gray-700 dark:text-blue-100">{index + 1}</td>
            <td className="px-8 py-4 whitespace-nowrap text-base text-gray-700 dark:text-blue-100 flex items-center gap-2">
              <FileText className="w-4 h-4 mr-1" />
              {template.name}
            </td>
            <td className="px-8 py-4 whitespace-nowrap text-base text-gray-700 dark:text-blue-100">{template.driveCode || `DRCODE-${index + 1}`}</td>
            <td className="px-8 py-4 whitespace-nowrap text-base text-gray-700 dark:text-blue-100">
              {Array.isArray(template.modbusMapping) ? template.modbusMapping.length : 0}
            </td>
            <td className="px-8 py-4 whitespace-nowrap text-base text-gray-700 dark:text-blue-100">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" title="View" onClick={() => onView(template)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </Button>
                {/* View Modal */}
                <ModbusTemplateModal
                  open={isViewing}
                  onOpenChange={setIsViewing}
                  mode="view"
                  template={viewTemplate}
                  setTemplate={() => { }}
                />
                <Button variant="outline" size="sm" className="dark:border-gray-400 dark:bg-gray-800 dark:text-gray-100" onClick={() => onEdit(template)} title="Edit">
                  <Edit size={14} />
                </Button>
                <Button variant="outline" size="sm" onClick={() => onDelete(template)} className="dark:border-gray-400 dark:bg-gray-800 dark:text-gray-100" title="Delete">
                  <Trash2 size={14} />
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);}

export default ModbusTemplatesTable;
