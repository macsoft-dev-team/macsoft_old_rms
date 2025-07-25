import  { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Plus, Edit, Trash2, FileText, Save } from 'lucide-react';
import { Button } from '../components/ui/button';
import  Input  from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import Select from '../components/ui/select';
import { mockTemplates } from '../data/mockData';
import TitleHead from '../components/TitleHead';
import { useToast } from '../components/ui/toast';
import { Dialog as ConfirmDialog, DialogContent as ConfirmDialogContent, DialogHeader as ConfirmDialogHeader, DialogTitle as ConfirmDialogTitle } from '../components/ui/dialog';

const ModbusTemplates = () => {
  const [templates, setTemplates] = useState(mockTemplates);
  const [isCreating, setIsCreating] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    driveCode: '',
    modbusMapping: []
  });
  const [newMapping, setNewMapping] = useState({
    parameter: '',
    address: '',
    dataType: 'uint16'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    id: '',
    name: '',
    driveCode: '',
    modbusMapping: []
  });
  const [editMapping, setEditMapping] = useState({
    parameter: '',
    address: '',
    dataType: 'uint16'
  });

  const { addToast } = useToast();

  // State for confirm dialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);

  const dataTypes = ['bool', 'int16', 'uint16', 'int32', 'uint32', 'float32'];

  const handleCreateTemplate = () => {
    const template = {
      id: `tpl${Date.now()}`,
      ...newTemplate
    };
    setTemplates(prev => [...prev, template]);
    setNewTemplate({ name: '', driveCode: '', modbusMapping: [] });
    setIsCreating(false);
    addToast({
      title: "Template Created",
      description: `Template "${template.name}" has been created.`,
      variant: "success"
    });
  };

  const handleAddMapping = () => {
    if (!newMapping.parameter || !newMapping.address) return;
    
    setNewTemplate(prev => ({
      ...prev,
      modbusMapping: [...prev.modbusMapping, { ...newMapping }]
    }));
    
    setNewMapping({ parameter: '', address: '', dataType: 'uint16' });
  };

  const handleRemoveMapping = (index) => {
    setNewTemplate(prev => ({
      ...prev,
      modbusMapping: prev.modbusMapping.filter((_, i) => i !== index)
    }));
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
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (templateToDelete) {
      handleDeleteTemplate(templateToDelete.id);
    }
    setConfirmOpen(false);
  };

  const handleOpenEdit = (template) => {
    setEditForm({ ...template });
    setEditMapping({ parameter: '', address: '', dataType: 'uint16' });
    setIsEditing(true);
  };

  const handleEditMappingAdd = () => {
    if (!editMapping.parameter || !editMapping.address) return;
    setEditForm(prev => ({
      ...prev,
      modbusMapping: [...prev.modbusMapping, { ...editMapping }]
    }));
    setEditMapping({ parameter: '', address: '', dataType: 'uint16' });
  };

  const handleEditMappingRemove = (index) => {
    setEditForm(prev => ({
      ...prev,
      modbusMapping: prev.modbusMapping.filter((_, i) => i !== index)
    }));
  };

  const handleSaveEdit = () => {
    setTemplates(prev =>
      prev.map(t => (t.id === editForm.id ? { ...editForm } : t))
    );
    setIsEditing(false);
    addToast({
      title: "Template Updated",
      description: `Template "${editForm.name}" has been updated.`,
      variant: "info"
    });
  };

  return (
    <div className="space-y-6">
      <TitleHead 
        title="Modbus Templates"
        description="Manage your Modbus templates and configurations."
        >
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setNewTemplate({ name: '', driveCode: '', modbusMapping: [] });
                setNewMapping({ parameter: '', address: '', dataType: 'uint16' });
              }}
              className="dark:border-gray-400 dark:bg-gray-800 dark:text-gray-100"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Create Modbus Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">
                    Template Name
                  </label>
                  <Input
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter template name..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">
                    Drive Code
                  </label>
                  <Input
                    value={newTemplate.driveCode}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, driveCode: e.target.value }))}
                    placeholder="Enter drive code..."
                  />
                </div>
              </div>

              {/* Add Mapping */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Modbus Mapping</h3>
                <div className="flex gap-3">
                  <Input
                    placeholder="Parameter name"
                    value={newMapping.parameter}
                    onChange={(e) => setNewMapping(prev => ({ ...prev, parameter: e.target.value }))}
                  />
                  <Input
                    placeholder="Address"
                    type="number"
                    value={newMapping.address}
                    onChange={(e) => setNewMapping(prev => ({ ...prev, address: e.target.value }))}
                  />
                  <Select
                    value={newMapping.dataType}
                    onChange={e => setNewMapping(prev => ({ ...prev, dataType: e.target.value }))}
                   >
                    {dataTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Select>
                  <Button onClick={handleAddMapping} variant="outline" className="dark:border-gray-400 dark:bg-gray-800 dark:text-gray-100">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Mapping Table */}
              {newTemplate.modbusMapping.length > 0 && (
                <div className="border rounded-lg dark:border-gray-700">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="dark:text-gray-200">Parameter</TableHead>
                        <TableHead className="dark:text-gray-200">Address</TableHead>
                        <TableHead className="dark:text-gray-200">Data Type</TableHead>
                        <TableHead className="dark:text-gray-200">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {newTemplate.modbusMapping.map((mapping, index) => (
                        <TableRow key={index}>
                          <TableCell className="dark:text-gray-100">{mapping.parameter}</TableCell>
                          <TableCell className="dark:text-gray-100">{mapping.address}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="dark:border-gray-700 dark:text-gray-100">{mapping.dataType}</Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRemoveMapping(index)}
                              className="dark:border-gray-400 dark:bg-gray-800 dark:text-gray-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreating(false)} className="dark:border-gray-400 dark:bg-gray-800 dark:text-gray-100">
                  Cancel
                </Button>
                <Button onClick={handleCreateTemplate} disabled={!newTemplate.name || !newTemplate.driveCode} className="dark:border-gray-400 dark:bg-gray-800 dark:text-gray-100">
                  <Save className="w-4 h-4 mr-2" />
                  Create Template
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Edit Modbus Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">
                    Template Name
                  </label>
                  <Input
                    value={editForm.name}
                    onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter template name..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">
                    Drive Code
                  </label>
                  <Input
                    value={editForm.driveCode}
                    onChange={e => setEditForm(prev => ({ ...prev, driveCode: e.target.value }))}
                    placeholder="Enter drive code..."
                  />
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Modbus Mapping</h3>
                <div className="flex gap-3">
                  <Input
                    placeholder="Parameter name"
                    value={editMapping.parameter}
                    onChange={e => setEditMapping(prev => ({ ...prev, parameter: e.target.value }))}
                  />
                  <Input
                    placeholder="Address"
                    type="number"
                    value={editMapping.address}
                    onChange={e => setEditMapping(prev => ({ ...prev, address: e.target.value }))}
                  />
                  <Select
                     value={editMapping.dataType}
                    onChange={e => setEditMapping(prev => ({ ...prev, dataType: e.target.value }))}
                   >
                    {dataTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Select>
                  <Button  onClick={handleEditMappingAdd} variant="outline" className="!w-max dark:border-gray-400 dark:bg-gray-800 dark:text-gray-100">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {Array.isArray(editForm.modbusMapping) && editForm.modbusMapping.length > 0 && (
                <div className="border rounded-lg dark:border-gray-700">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="dark:text-gray-200">Parameter</TableHead>
                        <TableHead className="dark:text-gray-200">Address</TableHead>
                        <TableHead className="dark:text-gray-200">Data Type</TableHead>
                        <TableHead className="dark:text-gray-200">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.isArray(editForm.modbusMapping) ? editForm.modbusMapping.map((mapping, index) => (
                        <TableRow key={index}>
                          <TableCell className="dark:text-gray-100">{mapping.parameter}</TableCell>
                          <TableCell className="dark:text-gray-100">{mapping.address}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="dark:border-gray-700 dark:text-gray-100">{mapping.dataType}</Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditMappingRemove(index)}
                              className="dark:border-gray-400 dark:bg-gray-800 dark:text-gray-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )) : null}
                    </TableBody>
                  </Table>
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditing(false)} className="dark:border-gray-400 dark:bg-gray-800 dark:text-gray-100">
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit} disabled={!editForm.name || !editForm.driveCode} className="dark:border-gray-400 dark:bg-gray-800 dark:text-gray-100">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </TitleHead>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {templates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="dark:bg-gray-900 dark:border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between w-full">
                  <div>
                    <CardTitle className="flex items-center space-x-2 dark:text-gray-100">
                      <FileText className="w-5 h-5" />
                      <span>{template.name}</span>
                    </CardTitle>
                    <Badge variant="outline" className="mt-2 dark:border-gray-700 dark:text-gray-100">
                      DRCODE-{index+1}
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="dark:border-gray-400 dark:bg-gray-800 dark:text-gray-100"
                      onClick={() => handleOpenEdit(template)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openConfirmDelete(template)}
                      className="dark:border-gray-400 dark:bg-gray-800 dark:text-gray-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {(Array.isArray(template.modbusMapping) ? template.modbusMapping.length : 0)} parameters configured
                </p>
                <div className="space-y-2">
                  {(Array.isArray(template.modbusMapping) ? template.modbusMapping.slice(0, 5) : []).map((mapping, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="font-medium dark:text-gray-100">{mapping.parameter}</span>
                      <span className="text-gray-600 dark:text-gray-300">{mapping.address}</span>
                    </div>
                  ))}
                  {(Array.isArray(template.modbusMapping) && template.modbusMapping.length > 5) && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      +{template.modbusMapping.length - 5} more parameters
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <ConfirmDialogContent>
          <ConfirmDialogHeader>
            <ConfirmDialogTitle>Delete Template</ConfirmDialogTitle>
          </ConfirmDialogHeader>
          <div className="py-4">
            <p className="text-sm">
              Are you sure you want to delete template <span className="font-semibold">{templateToDelete?.name}</span>?
            </p>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setConfirmOpen(false)} className="dark:border-gray-400 dark:bg-gray-800 dark:text-gray-100">
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} className="dark:border-red-700 dark:bg-red-700 dark:text-white">
              Delete
            </Button>
          </div>
        </ConfirmDialogContent>
      </ConfirmDialog>
    </div>
  );
};

export default ModbusTemplates;
