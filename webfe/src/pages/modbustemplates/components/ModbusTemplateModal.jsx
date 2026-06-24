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

  const [plainText, setPlainText] = useState('');
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

  const getPlainText = (parameters) => {
    if (!Array.isArray(parameters)) return '';
    return parameters
      .map((p) => {
        const parameter = p.parameter || '';
        const address = p.address || '';
        const dataType = p.dataType || 'uint16';
        return `${parameter},${address},${dataType}`;
      })
      .join('\n');
  };

  const parsePlainTextInput = (input) => {
    if (!input) return [];
    return input
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line)
      .map((line) => {
        const parts = line.split(',').map((s) => s.trim());
        if (parts.length >= 2) {
          return {
            parameter: parts[0],
            address: parts[1],
            dataType: parts[2] || 'uint16',
          };
        }
        if (parts.length === 1 && parts[0]) {
          return {
            parameter: parts[0],
            address: '',
            dataType: 'uint16',
          };
        }
        return null;
      })
      .filter(Boolean);
  };

  useEffect(() => {
    if (open && !isSubmitting) {
      if (template && (isEdit || isView)) {
        const templateData = {
          name: template.name || '',
          driveCode: template.driveCode || '',
          parameters: template.parameters || []
        };

        reset(templateData);
        setPlainText(getPlainText(templateData.parameters));
      } else if (isCreate) {
        const emptyTemplate = {
           name: '',
          driveCode: '',
          parameters: []
        };
        reset(emptyTemplate);
        setPlainText('');
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
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Modbus Mapping</h3>
              {(isEdit || isCreate) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block">
                      Enter/Paste parameters (parameter,address,dataType)
                    </label>
                    <textarea
                      className="w-full min-h-80 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 text-sm font-mono text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={plainText}
                      onChange={(e) => {
                        const textValue = e.target.value;
                        setPlainText(textValue);
                        const parsed = parsePlainTextInput(textValue);
                        setValue('parameters', parsed);
                      }}
                      placeholder={"Speed,40001,uint16\nVoltage,40002,float"}
                    />
                  </div>
                  <div className="max-h-80 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md p-1">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block sticky top-0 bg-white dark:bg-gray-900 py-1">
                      Table View (Preview)
                    </label>
                    <ParametersTable parameters={parsePlainTextInput(plainText)} />
                  </div>
                </div>
              ) : (
                <ParametersTable parameters={template.parameters} />
              )}
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {(isEdit || isCreate) ? 'Format: parameter,address,dataType (e.g., Speed,40001,uint16). One per line.' : 'Modbus mapping parameters.'}
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
