import { Button } from '../../../components/ui/button';
import { Play, StopCircle, Settings2, RotateCcw } from 'lucide-react';
import { useCommand } from '../../../hooks/useCommand';
import { useToast } from '../../../hooks/use-toast';

const CommandButtons = ({ deviceName, deviceId }) => {
  const { postCommand, setCommand } = useCommand();
  const { toast } = useToast();

  // Predefined commands with their addresses
  const predefinedCommands = [
    { 
      name: "Start Pump", 
      address: "0x01A4", 
      value: "01", 
      action: "WRITE",
      icon: Play,
      color: "bg-green-500 hover:bg-green-600"
    },
    { 
      name: "Stop Pump", 
      address: "0x01A8", 
      value: "00", 
      action: "WRITE",
      icon: StopCircle,
      color: "bg-red-500 hover:bg-red-600"
    },
    { 
      name: "Set Frequency", 
      address: "0x01A6", 
      value: "50", 
      action: "WRITE",
      icon: Settings2,
      color: "bg-blue-500 hover:bg-blue-600"
    },
    { 
      name: "Reset Fault", 
      address: "0x01A7", 
      value: "01", 
      action: "WRITE",
      icon: RotateCcw,
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ];

  const handleCommandClick = async (cmd) => {
    if (!deviceId) {
      toast({
        title: "No Device Selected",
        description: "Please select a device first",
        variant: "destructive"
      });
      return;
    }

    const commandData = {
      action: cmd.action,
      address: cmd.address,
      value: cmd.value,
      deviceId: deviceId
    };

    // Add to chat immediately with pending status
    setCommand({
      id: Date.now(),
      ...commandData,
      createdAt: new Date().toISOString(),
      response: "", // Empty response indicates pending
      status: "pending"
    });

    try {
      await postCommand(commandData);
      toast({
        title: "Command Sent",
        description: `${cmd.name} command sent successfully`,
        variant: "success"
      });
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
        Send commands to {deviceName} using the command buttons below.
      </p>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {predefinedCommands.map((cmd, index) => {
          const IconComponent = cmd.icon;
          return (
            <Button 
              key={index}
              className="h-12" 
              variant="outline"
              onClick={() => handleCommandClick(cmd)}
              disabled={!deviceId}
            >
              <IconComponent className="w-5 h-5 mr-2" />
              {cmd.name}
            </Button>
          );
        })}
      </div>
      {!deviceId && (
        <p className="text-sm text-gray-500 text-center">
          Select a device to enable command buttons
        </p>
      )}
    </div>
  );
};

export default CommandButtons;
