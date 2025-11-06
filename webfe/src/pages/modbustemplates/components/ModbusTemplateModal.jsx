import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import Input from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Save } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';
import ParametersTable from './ParametersTable';

const ModbusTemplateModal = ({
  open,
  onOpenChange,
  mode,
  template,
  setTemplate,
  onSave,
  disableSave
}) => {
  const isEdit = mode === 'edit';
  const isCreate = mode === 'create';
  const isView = mode === 'view';

  const [jsonText, setJsonText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      driveCode: '',
      parameters: []
    }
  });

  useEffect(() => {
    if (open && !isSubmitting) {
      if (template && (isEdit || isView)) {
        const templateData = {
          name: template.name || '',
          driveCode: template.driveCode || '',
          parameters: template.parameters || []
        };

        reset(templateData);
        setJsonText(JSON.stringify(templateData.parameters, null, 2));
      } else if (isCreate) {
        const emptyTemplate = {
           name: '',
          driveCode: '',
          parameters: []
        };
        reset(emptyTemplate);
        setJsonText('[]');
      }
    }

    if (!open) {
      setIsSubmitting(false);
    }
  }, [template, open, reset, isCreate, isEdit, isView, isSubmitting]);

  const onSubmit = (data) => {
    data.id =undefined;  
    setIsSubmitting(true);
    if (onSave) {
      onSave(data)
        .then(() => {
          setIsSubmitting(false);
        })
        .catch(() => {
          setIsSubmitting(false);
        });
    }
  };
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">Template Name</label>
                {(isEdit || isCreate) ? (
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Input
                          {...field}
                          placeholder="Enter template name..."
                        />
                      </div>
                    )}
                  />
                ) : (
                  <div className="text-base text-gray-900 dark:text-gray-100 font-semibold">{template.name}</div>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">Drive Code</label>
                {(isEdit || isCreate) ? (
                  <Controller
                    name="driveCode"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Input
                          {...field}
                          placeholder="Enter drive code..."
                        />
                      </div>
                    )}
                  />
                ) : (
                  <div className="text-base text-gray-900 dark:text-gray-100 font-semibold">{template.driveCode || '-'}</div>
                )}
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Modbus Mapping (JSON)</h3>
              {(isEdit || isCreate) ? (
                <div>
                  <textarea
                    className="w-full min-h-80 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 text-sm font-mono text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={jsonText}
                    onChange={(e) => {
                      const textValue = e.target.value;
                      setJsonText(textValue);

                      // Try to parse and update form field
                      try {
                        const val = JSON.parse(textValue);
                        if (Array.isArray(val)) {
                          setValue('parameters', val);
                        }
                      } catch {
                        // On parse error, just keep the text but don't update form field
                      }
                    }}
                    placeholder='[{ "parameter": "", "address": "", "dataType": "uint16" }]'
                  />
                </div>
              ) : (
                <ParametersTable parameters={template.parameters} />
              )}
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {(isEdit || isCreate) ? 'Edit as JSON array. Example:' : 'Modbus mapping parameters.'} {(isEdit || isCreate) && <code>[&#123; "parameter": "Speed", "address": "40001", "dataType": "uint16" &#125;]</code>}
              </div>
            </div>
            {(isEdit || isCreate) && (
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="dark:border-gray-400 dark:bg-gray-800 dark:text-gray-100">
                  Cancel
                </Button>
                <Button type="submit" disabled={disableSave} className="dark:border-gray-400 dark:bg-gray-800 dark:text-gray-100">
                  <Save className="w-4 h-4 mr-2" />
                  {isCreate ? 'Create Template' : 'Save Changes'}
                </Button>
              </div>
            )}
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ModbusTemplateModal;
