import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Play, StopCircle, MessageSquare } from 'lucide-react';
import Input from '../../../components/ui/input';
import { useCommand } from '../../../hooks/useCommand';
import { useToast } from '../../../hooks/use-toast';
import { useDevice } from '../../../hooks/useDevice';

const CommandButtons = () => {
  const { postCommand, setCommand } = useCommand();
  const { device } = useDevice();
  const { toast } = useToast();

  const [customPayload, setCustomPayload] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const handleSend = (type) => {
    if (!device.id) {
      toast({
        title: "No Device Selected",
        description: "Please select a device first",
        variant: "destructive"
      });
      return;
    }

    let payload = '';
    if (type === 'MOTOR_ON') payload = '"SRUN:1";';
    else if (type === 'MOTOR_OFF') payload = '"SRUN:0";';
    else if (type === 'CUSTOM') payload = customPayload;

    if (type === 'CUSTOM' && !customPayload) {
      toast({
        title: "Payload Required",
        description: "Please enter a payload for the custom command",
        variant: "destructive"
      });
      return;
    }

    const commandData = {
      type,
      payload,
      deviceId: device.id,
      imeinumber: device.imeinumber || ''
    };

    setCommand({
      id: Date.now(),
      ...commandData,
      createdAt: new Date().toISOString(),
      response: "",
      status: "pending"
    });

    try {
      postCommand(commandData);
      toast({
        title: "Command Sent",
        description: `${type === 'MOTOR_ON' ? 'Motor On' : type === 'MOTOR_OFF' ? 'Motor Off' : 'Custom'} command sent successfully`,
        variant: "success"
      });
      if (type === 'CUSTOM') setCustomPayload('');
    } catch (error) {
      toast({
        title: "Command Failed",
        description: "Failed to send command",
        variant: "destructive"
      });
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Device Command Interface
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Send commands to {device.name} using the command buttons below.
      </p>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Button
          className="h-12"
          variant="outline"
          onClick={() => handleSend('MOTOR_ON')}
          disabled={!device.id}
        >
          <Play className="w-5 h-5 mr-2" />
          Motor On
        </Button>
        <Button
          className="h-12"
          variant="outline"
          onClick={() => handleSend('MOTOR_OFF')}
          disabled={!device.id}
        >
          <StopCircle className="w-5 h-5 mr-2" />
          Motor Off
        </Button>
        <Button
          className="h-12 col-span-2"
          variant="outline"
          onClick={() => setShowCustom((v) => !v)}
          disabled={!device.id}
        >
          <MessageSquare className="w-5 h-5 mr-2" />
          Custom Command
        </Button>
      </div>
      {showCustom && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Custom Command Payload
          </label>
          <textarea
            className="w-full min-h-80 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 text-sm font-mono text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={customPayload}
            onChange={e => setCustomPayload(e.target.value)}
            placeholder={`"SRUN:1";`}
          />
          <div className="flex gap-2 mt-2">
            <Button
              onClick={() => handleSend('CUSTOM')}
              disabled={!device.id}
              className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-700"
            >
              <span>Send</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setCustomPayload('')}
            >
              Clear
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowCustom(false);
                setCustomPayload('');
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      {!device.id && (
        <p className="text-sm text-gray-500 text-center">
          Select a device to enable command buttons
        </p>
      )}
    </div>
  );
};

export default CommandButtons;
