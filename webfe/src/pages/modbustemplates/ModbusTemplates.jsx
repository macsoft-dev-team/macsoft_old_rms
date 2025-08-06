import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Dialog, DialogTrigger } from '../../components/ui/dialog';
import TitleHead from '../../components/TitleHead';
import ModbusTemplateModal from './components/ModbusTemplateModal';
import ConfirmDeleteDialog from './components/ConfirmDeleteDialog';
import ModbusTemplatesTable from './components/ModbusTemplatesTable';
import useTemplate from '../../hooks/useTemplate';

const ModbusTemplates = () => {
  const {
    templates,
    template,
    mode,
    setMode,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    setTemplate,
    loading,
    error
  } = useTemplate();

  const handleModeChange = (newMode, templateData = null) => {
    setMode(newMode);
    if (templateData !== undefined) {
      setTemplate(templateData);
    }
  };



  const handleDeleteTemplate = (id) => {
    deleteTemplate(id)
      .then(() => {
         handleModeChange(null, null);
      })
      .catch(() => {
        // Keep confirmation dialog open on error
      });
  };

  const openConfirmDelete = (templateToDelete) => {
    handleModeChange('confirmDelete', templateToDelete);
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
    handleModeChange('view', viewTemplate);
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
      </TitleHead>

      <ModbusTemplatesTable
        templates={templates}
        onView={handleOpenView}
        onEdit={handleOpenEdit}
        onDelete={openConfirmDelete}
        isViewing={mode?.view || false}
        setIsViewing={v => handleModeChange(v ? 'view' : null)}
        viewTemplate={template}
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
