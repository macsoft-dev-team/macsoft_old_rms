import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  Check,
  CheckCheck,
  Clock,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import Input from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { useCommand } from '../../../hooks/useCommand';
import { useToast } from '../../../hooks/use-toast';
import { useForm } from 'react-hook-form';
import { formatStatus, getStatusConfig } from '../../../utils/statusUtils';
import moment from 'moment';
import { useDevice } from '../../../hooks/useDevice';

const ChatInterface = ({ deviceId, deviceName, status, isCommandSelectionNeeded }) => {
  const { commands, fetchCommands, postCommand, loading, setCommand } = useCommand();
  const { device } = useDevice();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: { payload: '' }
  });

  const [selectedCommandType, setSelectedCommandType] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (deviceId) {
      fetchCommands({ skip: null, take: null, filter: '', deviceId });
    }
  }, [deviceId, fetchCommands]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [commands, isTyping]);

  const getPayloadByType = (type) => {
    if (type === 'MOTOR_ON') return '"SRUN:1";';
    if (type === 'MOTOR_OFF') return '"SRUN:0";';
    return '';
  };

  const handlePredefinedCommandSelect = async (type) => {
    if (!type || type === 'CUSTOM' || !deviceId) return;

    const commandData = {
      type,
      payload: getPayloadByType(type),
      deviceId,
      imeinumber: device?.imeinumber || ''
    };

    setCommand({
      id: Date.now(),
      ...commandData,
      createdAt: new Date().toISOString(),
      response: '',
      status: 'pending'
    });

    setIsTyping(true);

    try {
      postCommand(commandData);
      setSelectedCommandType('');
    } catch {
      toast({
        title: 'Command Failed',
        description: 'Failed to send command',
        variant: 'destructive'
      });
    } finally {
      setTimeout(() => setIsTyping(false), 2000);
    }
  };

  const onSubmitCustomCommand = async ({ payload }) => {
    if (!payload || !deviceId) return;

    const commandData = {
      type: 'CUSTOM',
      payload,
      deviceId,
      imeinumber: device?.imeinumber || ''
    };

    setCommand({
      id: Date.now(),
      ...commandData,
      createdAt: new Date().toISOString(),
      response: '',
      status: 'pending'
    });

    setIsTyping(true);

    try {
      postCommand(commandData);
      reset({ payload: '' });
      setSelectedCommandType('');
    } catch {
      toast({
        title: 'Command Failed',
        description: 'Failed to send command',
        variant: 'destructive'
      });
    } finally {
      setTimeout(() => setIsTyping(false), 2000);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      case 'failed':
        return <AlertCircle className="w-3 h-3 text-red-500" />;
      default:
        return <Check className="w-3 h-3 text-gray-400" />;
    }
  };

  if (!deviceId) return null;

  return (
    <div className="flex flex-col h-[60vh] bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 dark:bg-gray-800">
        <div>
          <h3 className="font-semibold uppercase">{deviceName}</h3>
          <Badge className={getStatusConfig(status).color}>
            {formatStatus(status)}
          </Badge>
        </div>
        <Button variant="outline" size="small" onClick={() => fetchCommands({ deviceId, skip: null, take: null, filter: '' })} >
          <RefreshCw className={loading ? 'animate-spin' : ''} />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {[...commands]
            .sort((a, b) => {
              const timeA = a.createdAt ? moment(a.createdAt).valueOf() : 0;
              const timeB = b.createdAt ? moment(b.createdAt).valueOf() : 0;
              const valA = isNaN(timeA) ? 0 : timeA;
              const valB = isNaN(timeB) ? 0 : timeB;
              return valA - valB;
            })
            .map((cmd) => {
              // Only RESPONSE is left, all others (including CUSTOM) are right
              const isResponse = cmd.type === 'RESPONSE';
            return (
              <motion.div
                key={cmd.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isResponse ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`px-3 py-2 rounded-lg max-w-lg ${isResponse
                    ? 'bg-blue-100 dark:bg-blue-800'
                    : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                >
                  <p className="text-sm uppercase tracking-wider border-b border-gray-300">{cmd.type}</p>
                  <p class="text-xs font-mono py-1 break-all whitespace-pre-wrap">
                    {cmd.payload ? cmd.payload : cmd.response}
                  </p>
                  <div className="flex justify-end items-center gap-1 text-xs">
                    {moment(cmd.createdAt).format('LT')}
                    {getStatusIcon(cmd.status)}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {isTyping && (
          <div className="text-sm text-gray-500">Waiting for response...</div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Command Tabs */}
      {isCommandSelectionNeeded && (
        <div className="p-4 border-t border-gray-200 bg-gray-50 dark:bg-gray-800">
          <div className="flex gap-2">
            <Button
              variant={selectedCommandType === 'MOTOR_ON' ? 'default' : 'outline'}
              onClick={() => {
                setSelectedCommandType('MOTOR_ON');
                handlePredefinedCommandSelect('MOTOR_ON');
              }}
            >
              Motor On
            </Button>

            <Button
              variant={selectedCommandType === 'MOTOR_OFF' ? 'default' : 'outline'}
              onClick={() => {
                setSelectedCommandType('MOTOR_OFF');
                handlePredefinedCommandSelect('MOTOR_OFF');
              }}
            >
              Motor Off
            </Button>

            <Button
              variant={selectedCommandType === 'CUSTOM' ? 'default' : 'outline'}
              onClick={() => setSelectedCommandType('CUSTOM')}
            >
              Custom
            </Button>
          </div>

          {selectedCommandType === 'CUSTOM' && (
            <form onSubmit={handleSubmit(onSubmitCustomCommand)} className="mt-3 flex gap-2">
              <Input
                placeholder="Payload"
                {...register('payload', { required: true })}
              />
              <Button type="submit" disabled={!watch('payload')}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
