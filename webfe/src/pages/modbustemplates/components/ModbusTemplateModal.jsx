import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import Input from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Save } from 'lucide-react';

const ModbusTemplateModal = ({
  open,
  onOpenChange,
  mode, // 'view' | 'edit' | 'create'
  template,
  setTemplate,
  onSave,
  disableSave
}) => {
  const isEdit = mode === 'edit';
  const isCreate = mode === 'create';
  const isView = mode === 'view';
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            <span className="block pb-3 mb-4 border-b border-gray-200 dark:border-gray-700">
              {isCreate
                ? 'Create Modbus Template'
                : isEdit
                ? 'Edit Modbus Template'
                : 'View Modbus Template'}
            </span>
          </DialogTitle>
        </DialogHeader>
        {template && (
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">Template Name</label>
                {(isEdit || isCreate) ? (
                  <Input
                    value={template.name}
                    onChange={e => setTemplate(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter template name..."
                  />
                ) : (
                  <div className="text-base text-gray-900 dark:text-gray-100 font-semibold">{template.name}</div>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">Drive Code</label>
                {(isEdit || isCreate) ? (
                  <Input
                    value={template.driveCode}
                    onChange={e => setTemplate(prev => ({ ...prev, driveCode: e.target.value }))}
                    placeholder="Enter drive code..."
                  />
                ) : (
                  <div className="text-base text-gray-900 dark:text-gray-100 font-semibold">{template.driveCode || '-'}</div>
                )}
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Modbus Mapping (JSON)</h3>
              <textarea
                className="w-full min-h-[120px] rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 text-sm font-mono text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={JSON.stringify(template.modbusMapping, null, 2)}
                onChange={(isEdit || isCreate)
                  ? (e => {
                      try {
                        const val = JSON.parse(e.target.value);
                        setTemplate(prev => ({ ...prev, modbusMapping: Array.isArray(val) ? val : [] }));
                      } catch {
                        // ignore parse error
                      }
                    })
                  : undefined}
                readOnly={isView}
                placeholder='[{ "parameter": "", "address": "", "dataType": "uint16" }]'
              />
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {(isEdit || isCreate) ? 'Edit' : 'View'} as JSON array. Example: <code>[&#123; "parameter": "Speed", "address": "40001", "dataType": "uint16" &#125;]</code>
              </div>
            </div>
            {(isEdit || isCreate) && (
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => onOpenChange(false)} className="dark:border-gray-400 dark:bg-gray-800 dark:text-gray-100">
                  Cancel
                </Button>
                <Button onClick={onSave} disabled={disableSave} className="dark:border-gray-400 dark:bg-gray-800 dark:text-gray-100">
                  <Save className="w-4 h-4 mr-2" />
                  {isCreate ? 'Create Template' : 'Save Changes'}
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ModbusTemplateModal;
