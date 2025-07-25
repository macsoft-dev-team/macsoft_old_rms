import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Server, Save, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
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
import { mockServerTemplates } from '../data/mockData';
import TitleHead from '../components/TitleHead';

const ServerTemplates = () => {
  const [templates, setTemplates] = useState(mockServerTemplates);
  const [isCreating, setIsCreating] = useState(false);
  const [showPasswords, setShowPasswords] = useState({});
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    mqttBroker: '',
    port: 1883,
    username: '',
    password: '',
    topics: {
      dataPublish: '',
      commandSubscribe: '',
      commandPublish: ''
    }
  });

  const handleCreateTemplate = () => {
    const template = {
      id: `srv${Date.now()}`,
      ...newTemplate
    };
    setTemplates(prev => [...prev, template]);
    setNewTemplate({
      name: '',
      mqttBroker: '',
      port: 1883,
      username: '',
      password: '',
      topics: {
        dataPublish: '',
        commandSubscribe: '',
        commandPublish: ''
      }
    });
    setIsCreating(false);
  };

  const handleDeleteTemplate = (id) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  const togglePasswordVisibility = (templateId) => {
    setShowPasswords(prev => ({
      ...prev,
      [templateId]: !prev[templateId]
    }));
  };

  return (
    <div className="space-y-6">
      <TitleHead title="Server Templates" description="Configure MQTT server connection templates">
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Server Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
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
                    MQTT Broker
                  </label>
                  <Input
                    value={newTemplate.mqttBroker}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, mqttBroker: e.target.value }))}
                    placeholder="mqtt.example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Port
                  </label>
                  <Input
                    type="number"
                    value={newTemplate.port}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, port: parseInt(e.target.value) }))}
                    placeholder="1883"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Username
                  </label>
                  <Input
                    value={newTemplate.username}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Enter username..."
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Password
                </label>
                <Input
                  type="password"
                  value={newTemplate.password}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password..."
                />
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">MQTT Topics</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Data Publish Topic
                    </label>
                    <Input
                      value={newTemplate.topics.dataPublish}
                      onChange={(e) => setNewTemplate(prev => ({
                        ...prev,
                        topics: { ...prev.topics, dataPublish: e.target.value }
                      }))}
                      placeholder="data/pub"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Command Subscribe Topic
                    </label>
                    <Input
                      value={newTemplate.topics.commandSubscribe}
                      onChange={(e) => setNewTemplate(prev => ({
                        ...prev,
                        topics: { ...prev.topics, commandSubscribe: e.target.value }
                      }))}
                      placeholder="cmd/sub"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Command Publish Topic
                    </label>
                    <Input
                      value={newTemplate.topics.commandPublish}
                      onChange={(e) => setNewTemplate(prev => ({
                        ...prev,
                        topics: { ...prev.topics, commandPublish: e.target.value }
                      }))}
                      placeholder="cmd/pub"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateTemplate}
                  disabled={!newTemplate.name || !newTemplate.mqttBroker}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Create Template
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </TitleHead> 
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {templates.map((template, index) => {
          const topics = template.topics || {};
          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between w-full">
                    <CardTitle className="flex items-center space-x-2">
                      <Server className="w-5 h-5" />
                      <span>{template.name}</span>
                    </CardTitle>
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
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Broker:</span>
                      <span className="text-sm text-gray-900">{template.mqttBroker}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Port:</span>
                      <Badge variant="outline">{template.port}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Username:</span>
                      <span className="text-sm text-gray-900">{template.username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Password:</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-900">
                          {showPasswords[template.id] 
                            ? template.password 
                            : '••••••••'
                          }
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePasswordVisibility(template.id)}
                        >
                          {showPasswords[template.id] ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Topics</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Data:</span>
                        <code className="bg-gray-100 px-1 rounded">{topics.dataPublish || ''}</code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cmd Sub:</span>
                        <code className="bg-gray-100 px-1 rounded">{topics.commandSubscribe || ''}</code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cmd Pub:</span>
                        <code className="bg-gray-100 px-1 rounded">{topics.commandPublish || ''}</code>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ServerTemplates;
