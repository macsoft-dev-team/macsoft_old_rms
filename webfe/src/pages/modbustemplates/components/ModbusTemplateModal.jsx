import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import Input from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Save, Plus, Trash2 } from 'lucide-react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      driveCode: '',
      parameters: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'parameters'
  });

  const formatParameters = (items) => {
    if (!Array.isArray(items)) return '{}';
    const pairs = items
      .filter((item) => item && item.address && item.value)
      .map((item) => `"${item.address}:${item.value}"`);
    return `{${pairs.join(',')};}`;
  };

  const parseParameters = (str) => {
    if (!str) return [];
    if (typeof str !== 'string') {
      if (Array.isArray(str)) {
        return str.map((item) => ({
          address: item.address || '',
          value: item.value || '',
        }));
      }
      return [];
    }
    const cleaned = str.trim().replace(/^\{/, '').replace(/;?\}$/, '');
    if (!cleaned) return [];
    return cleaned
      .split(',')
      .map((part) => {
        const unquoted = part.replace(/^"|"$/g, '').trim();
        const colonIndex = unquoted.indexOf(':');
        if (colonIndex !== -1) {
          return {
            address: unquoted.substring(0, colonIndex),
            value: unquoted.substring(colonIndex + 1),
          };
        }
        return null;
      })
      .filter(Boolean);
  };

  useEffect(() => {
    if (open && !isSubmitting) {
      if (template && (isEdit || isView)) {
        const parsedParams = parseParameters(template.parameters);
        const templateData = {
          name: template.name || '',
          driveCode: template.driveCode || '',
          parameters: parsedParams
        };

        reset(templateData);
      } else if (isCreate) {
        const emptyTemplate = {
          name: '',
          driveCode: '',
          parameters: [{ address: '', value: '' }]
        };
        reset(emptyTemplate);
      }
    }

    if (!open) {
      setIsSubmitting(false);
    }
  }, [template, open, reset, isCreate, isEdit, isView, isSubmitting]);

  const onSubmit = (data) => {
    const formattedParams = formatParameters(data.parameters || []);
    const submitData = {
      ...data,
      id: template?.id,
      parameters: formattedParams
    };

    setIsSubmitting(true);
    if (onSave) {
      onSave(submitData)
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
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Modbus Mapping</h3>
                {(isEdit || isCreate) && (
                  <Button
                    type="button"
                    variant="outline"
                    size="small"
                    onClick={() => append({ address: '', value: '' })}
                    className="flex items-center gap-1 text-xs dark:bg-gray-800 dark:text-gray-100"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Register
                  </Button>
                )}
              </div>

              {(isEdit || isCreate) ? (
                <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/2">
                          Name
                        </th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/2">
                          Address
                        </th>
                        <th className="px-4 py-2.5 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {fields.map((item, index) => (
                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          <td className="px-4 py-2">
                            <Controller
                              name={`parameters.${index}.address`}
                              control={control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  placeholder="Enter register name..."
                                  className="w-full dark:bg-gray-800 dark:text-white"
                                />
                              )}
                            />
                          </td>
                          <td className="px-4 py-2">
                            <Controller
                              name={`parameters.${index}.value`}
                              control={control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  placeholder="Enter register address..."
                                  className="w-full dark:bg-gray-800 dark:text-white"
                                />
                              )}
                            />
                          </td>
                          <td className="px-4 py-2 text-center">
                            <Button
                              type="button"
                              variant="ghost"
                              size="small"
                              onClick={() => remove(index)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {fields.length === 0 && (
                        <tr>
                          <td colSpan={3} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                            No parameter mapping added. Click "Add Register" to start.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <ParametersTable parameters={template.parameters} />
              )}
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

