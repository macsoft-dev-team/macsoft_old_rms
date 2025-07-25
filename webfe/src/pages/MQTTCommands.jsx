
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageSquare, Clock, CheckCircle, XCircle, Loader } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import  Input  from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import Select from '../components/ui/select';
import { mockDevices, mockCommands } from '../data/mockData';
import TitleHead from '../components/TitleHead';

const MQTTCommands = () => {
  const [selectedDevice, setSelectedDevice] = useState('');
  const [commandType, setCommandType] = useState('');
  const [commandValue, setCommandValue] = useState('');
  const [messages, setMessages] = useState(mockCommands);

  const commandTypes = [
    { value: 'START_PUMP', label: 'Start Pump' },
    { value: 'STOP_PUMP', label: 'Stop Pump' },
    { value: 'SET_FREQ', label: 'Set Frequency' },
    { value: 'RESET_FAULT', label: 'Reset Fault' },
    { value: 'CUSTOM', label: 'Custom Command' }
  ];

  const handleSendCommand = () => {
    if (!selectedDevice || !commandType) return;

    const newCommand = {
      id: `cmd${Date.now()}`,
      deviceId: selectedDevice,
      command: commandType === 'CUSTOM' ? commandValue : commandType,
      timestamp: new Date().toISOString(),
      status: 'sent',
      response: 'Waiting...'
    };

    setMessages(prev => [newCommand, ...prev]);
    
    // Simulate response after 2 seconds
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newCommand.id 
          ? { ...msg, status: 'completed', response: 'ACK_SUCCESS' }
          : msg
      ));
    }, 2000);

    // Clear form
    setCommandType('');
    setCommandValue('');
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'sent':
        return { icon: Loader, color: 'bg-yellow-100 text-yellow-800', spin: true };
      case 'completed':
        return { icon: CheckCircle, color: 'bg-green-100 text-green-800', spin: false };
      case 'failed':
        return { icon: XCircle, color: 'bg-red-100 text-red-800', spin: false };
      default:
        return { icon: MessageSquare, color: 'bg-blue-100 text-blue-800', spin: false };
    }
  };

  return (
    <div className="space-y-6">
      <TitleHead title="MQTT Commands" description="Send commands to devices and monitor responses" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Command Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Send className="w-5 h-5" />
                <span>Send Command</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Select Device
                </label>
                <Select value={selectedDevice} onChange={e => setSelectedDevice(e.target.value)}>
                  <option value="">Choose device...</option>
                  {mockDevices.map(device => (
                    <option key={device.id} value={device.id}>
                      {device.name} ({device.id})
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Command Type
                </label>
                <Select value={commandType} onChange={e => setCommandType(e.target.value)}>
                  <option value="">Choose command...</option>
                  {commandTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>
              </div>


              {commandType === 'SET_FREQ' && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Frequency (Hz)
                  </label>
                  <Select value={commandValue} onChange={e => setCommandValue(e.target.value)}>
                    <option value="">Select frequency...</option>
                    <option value="30">30 Hz</option>
                    <option value="40">40 Hz</option>
                    <option value="50">50 Hz</option>
                    <option value="60">60 Hz</option>
                    <option value="custom">Custom</option>
                  </Select>
                  {commandValue === 'custom' && (
                    <Input
                      type="number"
                      placeholder="Enter custom frequency..."
                      value={commandValue === 'custom' ? '' : commandValue}
                      onChange={(e) => setCommandValue(e.target.value)}
                      className="mt-2"
                    />
                  )}
                </div>
              )}

              {commandType === 'CUSTOM' && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Custom Command
                  </label>
                  <Select value={commandValue} onChange={e => setCommandValue(e.target.value)}>
                    <option value="">Select or enter custom command...</option>
                    <option value="REBOOT">Reboot</option>
                    <option value="STATUS">Status</option>
                    <option value="custom">Custom</option>
                  </Select>
                  {commandValue === 'custom' && (
                    <Textarea
                      placeholder="Enter custom command..."
                      value={commandValue === 'custom' ? '' : commandValue}
                      onChange={(e) => setCommandValue(e.target.value)}
                      className="mt-2"
                    />
                  )}
                </div>
              )}

              <Button 
                onClick={handleSendCommand}
                disabled={!selectedDevice || !commandType}
                className="w-full"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Command
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Message Log */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Command History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {messages.map((message, index) => {
                  const statusConfig = getStatusConfig(message.status);
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <motion.div
                            animate={statusConfig.spin ? { rotate: 360 } : {}}
                            transition={{
                              duration: 1,
                              repeat: statusConfig.spin ? Infinity : 0,
                              ease: 'linear'
                            }}
                          >
                            <StatusIcon className={`w-4 h-4 ${statusConfig.color.split(' ')[1]}`} />
                          </motion.div>
                          <span className="font-medium text-sm text-gray-900">
                            {message.command}
                          </span>
                        </div>
                        <Badge className={statusConfig.color}>
                          {message.status}
                        </Badge>
                      </div>
                      
                      <div className="text-xs text-gray-600 space-y-1">
                        <p>Device: {message.deviceId}</p>
                        <p>Response: {message.response}</p>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(message.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default MQTTCommands;
