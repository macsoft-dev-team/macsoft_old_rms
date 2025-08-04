import { useState } from 'react';
import { motion } from 'motion/react';
 import { Plus} from 'lucide-react';
import { Button } from '../../components/ui/button';
 import {  Dialog,  DialogTrigger} from '../../components/ui/dialog'; 
import { mockTemplates } from '../../data/mockData';
import TitleHead from '../../components/TitleHead';
import { useToast } from '../../components/ui/toast';
import ModbusTemplateModal from './components/ModbusTemplateModal';
import ConfirmDeleteDialog from './components/ConfirmDeleteDialog';
import ModbusTemplatesTable from './components/ModbusTemplatesTable';

const ModbusTemplates = () => {
  const [templates, setTemplates] = useState(mockTemplates);
  const [mode, setMode] = useState(null); // null | 'create' | 'edit' | 'view' | 'confirmDelete'
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    driveCode: '',
    modbusMapping: []
  });
 
  const [editForm, setEditForm] = useState({
    id: '',
    name: '',
    driveCode: '',
    modbusMapping: []
  });
  const [viewTemplate, setViewTemplate] = useState(null);

  const { addToast } = useToast();

  const [templateToDelete, setTemplateToDelete] = useState(null);

 
  const handleCreateTemplate = () => {
    const template = {
      id: `tpl${Date.now()}`,
      ...newTemplate
    };
    setTemplates(prev => [...prev, template]);
    setNewTemplate({ name: '', driveCode: '', modbusMapping: [] });
    setMode(null);
    addToast({
      title: "Template Created",
      description: `Template "${template.name}" has been created.`,
      variant: "success"
    });
  };
 
 
  const handleDeleteTemplate = (id) => {
    const deleted = templates.find(t => t.id === id);
    setTemplates(prev => prev.filter(t => t.id !== id));
    addToast({
      title: "Template Deleted",
      description: `Template "${deleted?.name || id}" has been deleted.`,
      variant: "destructive"
    });
    setTemplateToDelete(null);
  };

  const openConfirmDelete = (template) => {
    setTemplateToDelete(template);
    setMode('confirmDelete');
  };

  const confirmDelete = () => {
    if (templateToDelete) {
      handleDeleteTemplate(templateToDelete.id);
    }
    setMode(null);
  };

  const handleOpenEdit = (template) => {
    setEditForm({ ...template });
    setMode('edit');
  };
 
  const handleSaveEdit = () => {
    setTemplates(prev =>
      prev.map(t => (t.id === editForm.id ? { ...editForm } : t))
    );
    setMode(null);
    addToast({
      title: "Template Updated",
      description: `Template "${editForm.name}" has been updated.`,
      variant: "info"
    });
  };

  const handleOpenView = (template) => {
    setViewTemplate(template);
    setMode('view');
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
        <Dialog open={mode === 'create'} onOpenChange={open => setMode(open ? 'create' : null)}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setNewTemplate({ name: '', driveCode: '', modbusMapping: [] });
              }}
              className="dark:border-gray-400 dark:bg-gray-800 dark:text-gray-100"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </DialogTrigger>
          <ModbusTemplateModal
            open={mode === 'create'}
            onOpenChange={open => setMode(open ? 'create' : null)}
            mode="create"
            template={newTemplate}
            setTemplate={setNewTemplate}
            onSave={handleCreateTemplate}
            disableSave={!newTemplate.name || !newTemplate.driveCode}
          />
        </Dialog>

        <ModbusTemplateModal
          open={mode === 'edit'}
          onOpenChange={open => setMode(open ? 'edit' : null)}
          mode="edit"
          template={editForm}
          setTemplate={setEditForm}
          onSave={handleSaveEdit}
          disableSave={!editForm.name || !editForm.driveCode}
        />
      </TitleHead>

      <ModbusTemplatesTable
        templates={templates}
        onView={handleOpenView}
        onEdit={handleOpenEdit}
        onDelete={openConfirmDelete}
        isViewing={mode === 'view'}
        setIsViewing={v => setMode(v ? 'view' : null)}
        viewTemplate={viewTemplate}
      />

      <ConfirmDeleteDialog
        open={mode === 'confirmDelete'}
        onOpenChange={open => setMode(open ? 'confirmDelete' : null)}
        templateToDelete={templateToDelete}
        onConfirm={confirmDelete}
      />
    </motion.div>
  );
};

export default ModbusTemplates;
