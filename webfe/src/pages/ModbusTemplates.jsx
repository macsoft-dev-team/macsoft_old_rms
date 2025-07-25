
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

  const dataTypes = ['bool', 'int16', 'uint16', 'int32', 'uint32', 'float32'];

  const handleCreateTemplate = () => {
    const template = {
      id: `tpl${Date.now()}`,
      ...newTemplate
    };
    setTemplates(prev => [...prev, template]);
    setNewTemplate({ name: '', driveCode: '', modbusMapping: [] });
    setIsCreating(false);
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
    setTemplates(prev => prev.filter(t => t.id !== id));
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
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Template Name
                  </label>
                  <Input
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter template name..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
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
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">Modbus Mapping</h3>
                <div className="grid grid-cols-4 gap-3">
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
                    className="border rounded px-2 py-1"
                  >
                    {dataTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Select>
                  <Button onClick={handleAddMapping} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Mapping Table */}
              {newTemplate.modbusMapping.length > 0 && (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Parameter</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Data Type</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {newTemplate.modbusMapping.map((mapping, index) => (
                        <TableRow key={index}>
                          <TableCell>{mapping.parameter}</TableCell>
                          <TableCell>{mapping.address}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{mapping.dataType}</Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRemoveMapping(index)}
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
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTemplate} disabled={!newTemplate.name || !newTemplate.driveCode}>
                  <Save className="w-4 h-4 mr-2" />
                  Create Template
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
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between w-full">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="w-5 h-5" />
                      <span>{template.name}</span>
                    </CardTitle>
                    <Badge variant="outline" className="mt-2">
                      DRCODE-{index+1}
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteTemplate(template.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  {(template.modbusMapping?.length ?? 0)} parameters configured
                </p>
                <div className="space-y-2">
                  {(template.modbusMapping?.slice(0, 5) ?? []).map((mapping, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="font-medium">{mapping.parameter}</span>
                      <span className="text-gray-600">{mapping.address}</span>
                    </div>
                  ))}
                  {(template.modbusMapping?.length ?? 0) > 5 && (
                    <p className="text-xs text-gray-500 text-center">
                      +{template.modbusMapping.length - 5} more parameters
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ModbusTemplates;
