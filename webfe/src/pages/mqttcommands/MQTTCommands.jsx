import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { mockCommands } from '../../data/mockData';
import TitleHead from '../../components/TitleHead';
import CommandPanel from './components/CommandPanel';
import CommandHistory from './components/CommandHistory';
import { useDevice } from '../../hooks/useDevice';
import CommandLive from './components/CommandLive';

const MQTTCommands = () => {
  const { devices, device, setDevice : setSelectedDevice } = useDevice();
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
    setTimeout(() => {
      setMessages(prev => prev.map(msg =>
        msg.id === newCommand.id
          ? { ...msg, status: 'completed', response: 'ACK_SUCCESS' }
          : msg
      ));
    }, 2000);
    setCommandType('');
    setCommandValue('');
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'sent':
        return { icon: Loader, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', spin: true };
      case 'completed':
        return { icon: CheckCircle, color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', spin: false };
      case 'failed':
        return { icon: XCircle, color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', spin: false };
      default:
        return { icon: Loader, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', spin: false };
    }
  };

  return (
    <div className="space-y-6">
      <TitleHead title="MQTT Commands" description="Send commands to devices and monitor responses" />
      <div className="grid grid-cols-1 lg:grid-cols-3 divide-x divide-gray-200 dark:divide-gray-700">
        {/* Command Panel */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <CommandPanel
            devices={devices}
            selectedDevice={device}
            setSelectedDevice={setSelectedDevice}
            commandType={commandType}
            setCommandType={setCommandType}
            commandValue={commandValue}
            setCommandValue={setCommandValue}
            handleSendCommand={handleSendCommand}
            commandTypes={commandTypes}
          />
        </motion.div>
        {/* Message Log */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <CommandHistory messages={messages} getStatusConfig={getStatusConfig} />
        </motion.div>
        {/* Live Command View */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <CommandLive />
        </motion.div>
      </div>
    </div>
  );
};

export default MQTTCommands;
