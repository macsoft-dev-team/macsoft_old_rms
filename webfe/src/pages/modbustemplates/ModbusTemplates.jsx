import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Dialog, DialogTrigger } from '../../components/ui/dialog';
import TitleHead from '../../components/TitleHead';
import ModbusTemplateModal from './components/ModbusTemplateModal';
import ConfirmDeleteDialog from './components/ConfirmDeleteDialog';
import useTemplate from '../../hooks/useTemplate';
import { useEffect } from 'react';
import ReusableTable from '../../components/ui/reusableTable';

const ModbusTemplates = () => {
  const {
    templates,
    template,
    mode,
    filter,
    currentPage,
    totalPages,
    onPageChange,
    setMode,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    setTemplate,
    getTemplates,
    loading,
    error
  } = useTemplate();

  const handleModeChange = (newMode, templateData = null) => {
    if (newMode === null) {
      setMode(null);
    } else {
      setMode(newMode, true);
    }
    if (templateData !== undefined) {
      setTemplate(templateData);
    }
  };
  const handleDeleteTemplate = (id) => {
    deleteTemplate(id)
      .then(() => {
        handleModeChange(null, null);
      })
  };

  const confirmDelete = () => {
    if (template) {
      handleDeleteTemplate(template.id);
    }
    handleModeChange(null);
  };

  const handleOpenEdit = (editTemplate) => {
    handleModeChange('edit', { ...editTemplate });
  };

  const handleOpenView = (viewTemplate) => {
    handleModeChange('view', { ...viewTemplate });
  };

  const handleOpenDelete = (deleteTemplate) => {
    handleModeChange('confirmDelete', { ...deleteTemplate });
  };

  const handleSave = (data) => {
    if (data.id) {
      return updateTemplate(data)
        .then(() => {
          handleModeChange(null);
        })
        .catch(() => {
          throw new Error();
        });
    } else {
      return createTemplate(data)
        .then(() => {
          handleModeChange(null);
        })
        .catch(() => {
          throw new Error();
        });
    }
  };

  useEffect(() => {
    getTemplates({ skip: currentPage, take: 10, filter: filter });
  }, [currentPage, filter]);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <TitleHead
        title="Modbus Templates"
        description="Manage your Modbus templates and configurations."
      >
        <Dialog open={mode?.create || false} onOpenChange={open => handleModeChange(open ? 'create' : null)}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                handleModeChange('create', { name: '', driveCode: '', parameters: [] });
              }}
              className="dark:border-gray-400 dark:bg-gray-800 dark:text-gray-100"
              disabled={loading}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </DialogTrigger>
          <ModbusTemplateModal
            open={mode?.create || false}
            onOpenChange={open => handleModeChange(open ? 'create' : null)}
            mode="create"
            template={template || { name: '', driveCode: '', parameters: [] }}
            onSave={handleSave}
            disableSave={false}
          />
        </Dialog>

        <ModbusTemplateModal
          open={mode?.edit || false}
          onOpenChange={open => handleModeChange(open ? 'edit' : null)}
          mode="edit"
          template={template || { name: '', driveCode: '', parameters: [] }}
          onSave={handleSave}
          disableSave={false}
        />

        <ModbusTemplateModal
          open={mode?.view || false}
          onOpenChange={open => handleModeChange(open ? 'view' : null)}
          mode="view"
          template={template || { name: '', driveCode: '', parameters: [] }}
          onSave={handleSave}
          disableSave={true}
        />
      </TitleHead>

      <ReusableTable
        data={templates}
        headerColor="bg-gray-100 dark:bg-blue-900 "
        headerTextColor="text-gray-700 dark:text-gray-200"
        columns={[
          { key: 'name', label: 'Name', align: 'left' },
          { key: 'driveCode', label: 'Drive Code', align: 'left' },
        ]}
        loading={loading}
        error={error}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onRowClick={handleOpenView}
        onEdit={handleOpenEdit}
        onView={handleOpenView}
        onDelete={handleOpenDelete}
        emptyMessage="No templates found. Create a new template to get started."
      />

      <ConfirmDeleteDialog
        open={mode?.confirmDelete || false}
        onOpenChange={open => handleModeChange(open ? 'confirmDelete' : null)}
        templateToDelete={template}
        onConfirm={confirmDelete}
      />
    </motion.div>
  );
};

export default ModbusTemplates;
