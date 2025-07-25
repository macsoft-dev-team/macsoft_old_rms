import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Check, CheckCheck, Clock, AlertCircle, Loader2 } from 'lucide-react';
import Input from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import Select from '../ui/select';

const ChatInterface = ({ deviceId, deviceName }) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'system',
      content: `Connected to ${deviceName}`,
      timestamp: new Date(Date.now() - 60000).toISOString(),
      status: 'delivered'
    },
    {
      id: '2',
      type: 'outgoing',
      content: 'START_PUMP',
      timestamp: new Date(Date.now() - 45000).toISOString(),
      status: 'delivered'
    },
    {
      id: '3',
      type: 'incoming',
      content: 'PUMP_STARTED_OK',
      timestamp: new Date(Date.now() - 44000).toISOString(),
      status: 'delivered'
    },
    {
      id: '4',
      type: 'outgoing',
      content: 'SET_FREQ_50',
      timestamp: new Date(Date.now() - 30000).toISOString(),
      status: 'delivered'
    },
    {
      id: '5',
      type: 'incoming',
      content: 'FREQ_SET_50HZ_OK',
      timestamp: new Date(Date.now() - 29000).toISOString(),
      status: 'delivered'
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [commandType, setCommandType] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const commandTypes = [
    { value: 'START_PUMP', label: 'Start Pump' },
    { value: 'STOP_PUMP', label: 'Stop Pump' },
    { value: 'SET_FREQ', label: 'Set Frequency' },
    { value: 'RESET_FAULT', label: 'Reset Fault' },
    { value: 'GET_STATUS', label: 'Get Status' },
    { value: 'CUSTOM', label: 'Custom Command' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sending':
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

  const simulateResponse = (command) => {
    const responses = {
      'START_PUMP': 'PUMP_STARTED_OK',
      'STOP_PUMP': 'PUMP_STOPPED_OK',
      'SET_FREQ': 'FREQ_SET_OK',
      'RESET_FAULT': 'FAULT_RESET_OK',
      'GET_STATUS': 'STATUS_NORMAL_RUNNING'
    };

    return responses[command] || 'ACK_RECEIVED';
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() && !commandType) return;

    const messageContent = commandType === 'CUSTOM' ? newMessage : commandType;
    if (!messageContent) return;

    const outgoingMessage = {
      id: Date.now().toString(),
      type: 'outgoing',
      content: messageContent,
      timestamp: new Date().toISOString(),
      status: 'sending'
    };

    setMessages(prev => [...prev, outgoingMessage]);
    setNewMessage('');
    setCommandType('');

    // Simulate sending delay
    setTimeout(() => {
      setMessages(prev => prev.map(msg =>
        msg.id === outgoingMessage.id
          ? { ...msg, status: 'sent' }
          : msg
      ));

      // Simulate delivery
      setTimeout(() => {
        setMessages(prev => prev.map(msg =>
          msg.id === outgoingMessage.id
            ? { ...msg, status: 'delivered' }
            : msg
        ));

        // Show typing indicator
        setIsTyping(true);

        // Simulate device response
        setTimeout(() => {
          setIsTyping(false);

          const responseMessage = {
            id: (Date.now() + 1).toString(),
            type: 'incoming',
            content: simulateResponse(messageContent.split('_')[0] + '_' + messageContent.split('_')[1]),
            timestamp: new Date().toISOString(),
            status: 'delivered'
          };

          setMessages(prev => [...prev, responseMessage]);
        }, 1500);
      }, 1000);
    }, 500);
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
            <p className="text-xs text-green-600 dark:text-green-400 flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full"></div>
              <span>Online</span>
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs dark:bg-gray-900 dark:text-gray-100">
          MQTT
        </Badge>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === 'outgoing' ? 'justify-end' :
                message.type === 'system' ? 'justify-center' : 'justify-start'
                }`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-lg ${
                  message.type === 'outgoing'
                    ? 'bg-blue-500 text-white dark:bg-blue-700'
                    : message.type === 'system'
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  }`}
              >
                <p className="font-mono text-sm">{message.content}</p>

                <div className={`flex items-center space-x-1 mt-1 ${message.type === 'outgoing' ? 'justify-end' : 'justify-start'
                  }`}>
                  <span className={`text-xs ${message.type === 'outgoing' ? 'text-blue-100 dark:text-blue-200' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                    {formatTime(message.timestamp)}
                  </span>
                  {message.type === 'outgoing' && getStatusIcon(message.status)}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

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
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-400 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-b-lg">
        <div className="space-y-3">
          <Select
            options={commandTypes}
            value={commandType}
            onChange={e => setCommandType(e.target.value)}
            placeholder="Select command type..."
            className="w-full dark:bg-gray-800 dark:text-gray-100"
          />

          {commandType === 'CUSTOM' && (
            <Input
              className="pl-10 w-100 border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
              placeholder="Enter custom command..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
          )}

          <div className="flex space-x-2">
            <Button
              onClick={handleSendMessage}
              disabled={!commandType || (commandType === 'CUSTOM' && !newMessage.trim())}
              className="flex-1 dark:bg-blue-700 dark:text-white"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Command
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;