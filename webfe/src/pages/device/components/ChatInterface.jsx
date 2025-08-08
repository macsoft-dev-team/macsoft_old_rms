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

const ChatInterface = ({ deviceId, deviceName, status }) => {
  const { commands, fetchCommands, postCommand, loading, setCommands, setCommand } = useCommand();
  const { toast } = useToast();
  
  // React Hook Form for custom commands
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      action: 'READ',
      address: '',
      value: '',
    },
  });

  const watchedAction = watch('action');

  useEffect(() => {
    if (deviceId) {
      fetchCommands({ skip: null, take: null, filter: '', deviceId });
    }
  }, [deviceId, fetchCommands]);

  const [isTyping, setIsTyping] = useState(false);
  const [selectedCommandType, setSelectedCommandType] = useState('');
  const messagesEndRef = useRef(null);

  const commandTypes = [
    { value: 'START_PUMP', label: 'Start Pump' },
    { value: 'STOP_PUMP', label: 'Stop Pump' },
    { value: 'SET_FREQ', label: 'Set Frequency' },
    { value: 'RESET_FAULT', label: 'Reset Fault' },
    { value: 'GET_STATUS', label: 'Get Status' },
    { value: 'CUSTOM', label: 'Custom Command' }
  ];

  // Map command types to predefined commands
  const getCommandByType = (type) => {
    const commandMap = {
      'START_PUMP': { address: "0x01A4", value: "01", action: "WRITE" },
      'STOP_PUMP': { address: "0x01A8", value: "00", action: "WRITE" },
      'SET_FREQ': { address: "0x01A6", value: "50", action: "WRITE" },
      'RESET_FAULT': { address: "0x01A7", value: "01", action: "WRITE" },
      'GET_STATUS': { address: "0x01A9", value: "", action: "READ" }
    };
    return commandMap[type] || null;
  };

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
      await fetchCommands({ skip: null, take: null, filter: '', deviceId });
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [commands]);

  // Helper function to get command display name
  const getCommandDisplayName = (command) => {
    const { action, address, value } = command;
    
    // Check if this matches any predefined command
    for (const [type, commandInfo] of Object.entries({
      'START_PUMP': { address: "0x01A4", value: "01", action: "WRITE" },
      'STOP_PUMP': { address: "0x01A8", value: "00", action: "WRITE" },
      'SET_FREQ': { address: "0x01A6", value: "50", action: "WRITE" },
      'RESET_FAULT': { address: "0x01A7", value: "01", action: "WRITE" },
      'GET_STATUS': { address: "0x01A9", value: "", action: "read" }
    })) {
      if (commandInfo.address === address && 
          commandInfo.action.toLowerCase() === action.toLowerCase() &&
          (commandInfo.value === value || (commandInfo.value === "" && !value))) {
        return {
          name: type.replace('_', ' '),
          hex: `${action.toUpperCase()} ${address}${value ? ` : ${value}` : ''}`
        };
      }
    }
    
    // For custom commands, return the hex format
    return {
      name: `${action.toUpperCase()} Command`,
      hex: `${action.toUpperCase()} ${address}${value ? ` : ${value}` : ''}`
    };
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

    const commandInfo = getCommandByType(selectedCommandType);
    if (!commandInfo) return;

    const commandData = {
      action: commandInfo.action,
      address: commandInfo.address,
      value: commandInfo.value,
      deviceId: deviceId
    };

    // Add to chat immediately with pending status
    const newCommand = {
      id: Date.now(),
      ...commandData,
      createdAt: new Date().toISOString(),
      response: "", // Empty response indicates pending
      status: "pending"
    };
    setCommand(newCommand);

    // Show typing indicator for response
    setIsTyping(true);

    try {
      await postCommand(commandData);
      toast({
        title: "Command Sent",
        description: `${selectedCommandType.replace('_', ' ')} command sent successfully`,
        variant: "success"
      });
      
      // Reset selection
      setSelectedCommandType('');
      
      // Hide typing indicator after a delay (simulating response time)
      setTimeout(() => {
        setIsTyping(false);
      }, 2000);
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
      ...data,
      deviceId: deviceId
    };

    // Add to chat immediately with pending status
    const newCommand = {
      id: Date.now(),
      ...commandData,
      createdAt: new Date().toISOString(),
      response: "", // Empty response indicates pending
      status: "pending"
    };
    setCommand(newCommand);

    // Show typing indicator for response
    setIsTyping(true);

    try {
      await postCommand(commandData);
      toast({
        title: "Command Sent",
        description: `${data.action} command sent to ${data.address}`,
        variant: "default"
      });
      
      // Reset form after successful send
      reset({ action: data.action, address: '', value: '' });
      setSelectedCommandType('');
      
      // Hide typing indicator after a delay
      setTimeout(() => {
        setIsTyping(false);
      }, 2000);
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
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-[60vh] bg-white dark:bg-gray-900 border border-gray-400 dark:border-gray-700 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-400 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 dark:bg-blue-700 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {deviceName?.charAt(0) || 'D'}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{deviceName}</h3>
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
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    message.type === 'outgoing'
                      ? 'bg-blue-500 text-white dark:bg-blue-700'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <p className="text-sm font-medium">{message.content}</p>
                  {message.hexContent && (
                    <p className={`text-xs mt-1 font-mono ${
                      message.type === 'outgoing' 
                        ? 'text-blue-100 dark:text-blue-200 opacity-80' 
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
                        ? 'text-blue-100 dark:text-blue-200' 
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
      <div className="p-4 border-t border-gray-400 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-b-lg">
        <div className="space-y-4">
          {/* Command Type Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">
              Select Command
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Select
                direction='up'
                  placeholder="Choose command type..."
                  options={commandTypes}
                  value={selectedCommandType}
                  onChange={(e) => setSelectedCommandType(e.target.value)}
                  className="w-full dark:bg-gray-800 dark:text-gray-100"
                />
              </div>
              {selectedCommandType && selectedCommandType !== 'CUSTOM' && (
                <Button 
                  onClick={handlePredefinedCommandSelect}
                  disabled={!deviceId || !selectedCommandType}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-700"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </Button>
              )}
            </div>
          </div>

          {/* Custom Command Form - Only show when CUSTOM is selected */}
          {selectedCommandType === 'CUSTOM' && (
            <form onSubmit={handleSubmit(onSubmitCustomCommand)} className="space-y-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200 block">
                Custom Command Details
              </label>
              <div className="flex gap-2">
                <div className="flex-shrink-0">
                  <Select
                  direction='up'
                    placeholder='Action'
                    className='!w-20'
                    options={[
                      { value: 'read', label: 'Read' },
                      { value: 'WRITE', label: 'Write' }
                    ]}
                    value={watchedAction}
                    {...register('action', { required: 'Action is required' })}
                  />
                </div>
                <div className="flex-1">
                  <Input 
                    placeholder="Address (e.g., 0x01A1)" 
                    {...register('address', { 
                      required: 'Address is required',
                      pattern: {
                        value: /^0x[0-9A-Fa-f]+$/,
                        message: 'Address must be in hex format (0x...)'
                      }
                    })}
                    className={`dark:bg-gray-800 dark:text-white ${errors.address ? 'border-red-500' : ''}`}
                  />
                </div>
                {watchedAction !== 'read' && (
                  <div className="flex-1">
                    <Input 
                      placeholder="Value" 
                      {...register('value', { 
                        required: watchedAction !== 'read' ? 'Value is required for write commands' : false 
                      })}
                      className={`dark:bg-gray-800 dark:text-white ${errors.value ? 'border-red-500' : ''}`}
                    />
                  </div>
                )}
                <Button 
                  type="submit" 
                  disabled={!deviceId}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-700"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send</span>
                </Button>
              </div>
              {errors.address && (
                <span className="text-xs text-red-500">{errors.address.message}</span>
              )}
              {errors.value && (
                <span className="text-xs text-red-500">{errors.value.message}</span>
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