import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Check, CheckCheck, Clock, AlertCircle, Loader2, RefreshCw, Power, Settings, Thermometer, Zap } from 'lucide-react';
import Input from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import Select from '../../../components/ui/select';
import { useCommand } from '../../../hooks/useCommand';
import { useToast } from '../../../hooks/use-toast';
import { useForm } from 'react-hook-form';
import { formatStatus, getStatusConfig } from '../../../utils/statusUtils';
import moment from 'moment';
import { useDevice } from '../../../hooks/useDevice';

const ChatInterface = ({ deviceId, deviceName, status }) => {
  const { commands, fetchCommands, postCommand, loading, setCommands, setCommand } = useCommand();
  const { device } = useDevice();
  const { toast } = useToast();

  // Only need payload for custom command
  const { control, register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      payload: '',
    },
  });

  // Only three command types
  const commandTypes = [
    { value: 'MOTOR_ON', label: 'Motor On' },
    { value: 'MOTOR_OFF', label: 'Motor Off' },
    { value: 'CUSTOM', label: 'Custom Command' }
  ];

  const [selectedCommandType, setSelectedCommandType] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (deviceId) {
      // Clear previous commands when switching devices
      setCommands([]);
      // Fetch commands for the new device
      refetchCommands(deviceId);
    } else {
      // Clear commands when no device is selected
      setCommands([]);
    }
  }, [deviceId, setCommands]); // Removed fetchCommands from deps since refetchCommands handles it

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [commands]);

  // Helper function to refetch commands with error handling
  const refetchCommands = async (deviceId) => {
    try {
      await fetchCommands({ skip: null, take: null, filter: '', deviceId });
    } catch (error) {
      console.error('Failed to fetch commands:', error);
    }
  };

  // Map command types to payloads
  const getPayloadByType = (type) => {
    if (type === 'MOTOR_ON') return '{srun:1}';
    if (type === 'MOTOR_OFF') return '{srun:0}';
    return '';
  };

  // Helper function to get command display name
  const getCommandDisplayName = (command) => {
    // Only show type and payload
    if (command.type === 'MOTOR_ON') {
      return { name: 'Motor On', hex: command.payload };
    }
    if (command.type === 'MOTOR_OFF') {
      return { name: 'Motor Off', hex: command.payload };
    }
    if (command.type === 'CUSTOM') {
      return { name: 'Custom Command', hex: command.payload };
    }
    // fallback
    return { name: 'Command', hex: command.payload };
  };

  // Create chat messages from commands
  const chatMessages = [];
  commands.forEach(command => {
    const displayInfo = getCommandDisplayName(command);
    
    // Add user message (command sent)
    chatMessages.push({
      id: `${command.id}-user`,
      type: 'outgoing',
      content: displayInfo.name,
      hexContent: displayInfo.hex,
      timestamp: command.createdAt,
      status: 'delivered',
      command: command
    });
    
    // Add device response if exists
    if (command.response) {
      chatMessages.push({
        id: `${command.id}-response`,
        type: 'incoming',
        content: command.response,
        timestamp: command.updatedAt || command.createdAt,
        status: 'delivered',
        command: command
      });
    }
  });

  // Handle refresh button click
  const handleRefresh = async () => {
    if (!deviceId) {
      toast({
        title: "No Device Selected",
        description: "Please select a device first",
        variant: "destructive"
      });
      return;
    }

    try {
      await refetchCommands(deviceId);
      toast({
        title: "Commands Refreshed",
        description: "Command history has been updated",
        variant: "success"
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh command history",
        variant: "destructive"
      });
    }
  };

  // Handle predefined command selection from dropdown
  const handlePredefinedCommandSelect = async () => {
    if (!selectedCommandType || selectedCommandType === 'CUSTOM') return;

    if (!deviceId) {
      toast({
        title: "No Device Selected",
        description: "Please select a device first",
        variant: "destructive"
      });
      return;
    }

    const payload = getPayloadByType(selectedCommandType);

    const commandData = {
      type: selectedCommandType,
      payload,
      deviceId: deviceId,
      imeinumber: device && device.imeinumber ? device.imeinumber : ''
    };

    // Add to chat immediately with pending status
    const newCommand = {
      id: Date.now(),
      ...commandData,
      createdAt: new Date().toISOString(),
      response: "",
      status: "pending"
    };
    setCommand(newCommand);

    setIsTyping(true);

    try {
      await postCommand(commandData);
      toast({
        title: "Command Sent",
        description: `${selectedCommandType.replace('_', ' ')} command sent successfully`,
        variant: "success"
      });

      setSelectedCommandType('');
      
      // Fetch commands after successful send with a small delay
      setTimeout(() => {
        refetchCommands(deviceId);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      setIsTyping(false);
      toast({
        title: "Command Failed",
        description: "Failed to send command",
        variant: "destructive"
      });
    }
  };

  // Handle custom command form submission
  const onSubmitCustomCommand = async (data) => {
    if (!deviceId) {
      toast({
        title: "No Device Selected",
        description: "Please select a device first",
        variant: "destructive"
      });
      return;
    }

    const commandData = {
      type: 'CUSTOM',
      payload: data.payload,
      deviceId: deviceId
    };

    const newCommand = {
      id: Date.now(),
      ...commandData,
      createdAt: new Date().toISOString(),
      response: "",
      status: "pending"
    };
    setCommand(newCommand);

    setIsTyping(true);

    try {
      await postCommand(commandData);
      toast({
        title: "Command Sent",
        description: `Custom command sent`,
        variant: "default"
      });

      reset({ payload: '' });
      setSelectedCommandType('');
      
      // Fetch commands after successful send with a small delay
      setTimeout(() => {
        refetchCommands(deviceId);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      setIsTyping(false);
      toast({
        title: "Command Failed",
        description: "Failed to send command",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sending':
      case 'pending':
        return <Clock className="w-3 h-3 text-gray-400" />;
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      case 'failed':
        return <AlertCircle className="w-3 h-3 text-red-500" />;
      default:
        return null;
    }
  };

  const formatTime = (timestamp) => {
    return moment(timestamp).format('LL LT');
  };
  if (!deviceId) return null;

  return (
    <div className="flex flex-col h-[60vh] bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 dark:bg-blue-700 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm uppercase">
              {deviceName?.charAt(0) || 'D'}
            </span>
          </div>
          <div>
            <h3 className="font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-100">{deviceName}</h3>
            <Badge
              className={`text-xs font-semibold px-2 py-1 rounded ${getStatusConfig(status).color}`}
            >
              {formatStatus(status)}
            </Badge>
          </div>
        </div>
        <div className=' ms-auto flex items-center gap-1'>
          <Button
            type="button"
            variant="outline"
            size="small"
            onClick={handleRefresh}
            disabled={loading || !deviceId}
            className="flex items-center space-x-2"
            title={!deviceId ? "Select a device first" : "Refresh command history"}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!deviceId ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <Send className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No Device Selected</p>
              <p className="text-sm">Select a device to start sending commands</p>
            </div>
          </div>
        ) : chatMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <Send className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No Commands Yet</p>
              <p className="text-sm">Send your first command using the buttons or custom form below</p>
            </div>
          </div>
        ) : (
          <AnimatePresence>
            {chatMessages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.type === 'outgoing' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs min-w-xs px-3 py-2 rounded-lg ${
                    message.type === 'outgoing'
                      ? 'bg-slate-200 dark:bg-slate-700 text-gray-600 dark:text-gray-200'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <p className="text-sm font-medium">{message.content}</p>
                  {message.hexContent && (
                    <p className={`text-xs mt-1 font-mono ${
                      message.type === 'outgoing' 
                        ? 'text-green-600 dark:text-green-700 opacity-80' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {message.hexContent}
                    </p>
                  )}

                  <div className={`flex items-center space-x-1 mt-1 ${
                    message.type === 'outgoing' ? 'justify-end' : 'justify-start'
                  }`}>
                    <span className={`text-xs ${
                      message.type === 'outgoing' 
                        ? 'text-blue-400 dark:text-blue-400' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {formatTime(message.timestamp)}
                    </span>
                    {message.type === 'outgoing' && getStatusIcon(message.status)}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-start"
            >
              <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-lg">
                <div className="flex space-x-1 items-center">
                  <div className="flex space-x-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">Waiting for response...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-b-lg">
        <div className="space-y-4">
          {/* Command Type Selection */}
          <div>
            <label className="text-base font-medium text-gray-700 dark:text-blue-100 mb-2 block">
              Select Command Type
            </label>
            <Select
              direction='down'
              options={commandTypes}
              value={selectedCommandType}
              onChange={(e) => setSelectedCommandType(e.target.value)}
              placeholder="Select a command..."
              className="w-full dark:bg-gray-800 dark:text-white dark:border-gray-600"
              disablePortal
            />
          </div>

          {/* Send Button for Predefined Commands */}
          {selectedCommandType && selectedCommandType !== 'CUSTOM' && (
            <div className="flex justify-end">
              <Button 
                type="button"
                onClick={handlePredefinedCommandSelect}
                disabled={!deviceId || loading}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-700"
              >
                <Send className="w-4 h-4" />
                Send {commandTypes.find(cmd => cmd.value === selectedCommandType)?.label}
              </Button>
            </div>
          )}

          {/* Custom Command Form - Only show when CUSTOM is selected */}
          {selectedCommandType === 'CUSTOM' && (
            <form onSubmit={handleSubmit(onSubmitCustomCommand)} className="space-y-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200 block">
                Custom Command Payload
              </label>
              <div className="flex gap-2">
                <Input 
                  placeholder='Payload (e.g. {TIM:"...",OPV:220.1,...})'
                  {...register('payload', { required: 'Payload is required' })}
                  className={`dark:bg-gray-800 dark:text-white ${errors.payload ? 'border-red-500' : ''}`}
                />
                <Button 
                  type="submit" 
                  disabled={!deviceId}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-700"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send</span>
                </Button>
              </div>
              {errors.payload && (
                <span className="text-xs text-red-500">{errors.payload.message}</span>
              )}
            </form>
          )}

          {!deviceId && (
            <p className="text-xs text-gray-500">Select a device to send commands</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;