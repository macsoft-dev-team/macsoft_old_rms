import { Button } from '../../../components/ui/button';
import { Play, StopCircle, Settings2, RotateCcw } from 'lucide-react';

const CommandButtons = ({ deviceName }) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
      Device Command Interface
    </h3>
    <p className="text-gray-600 dark:text-gray-400 mb-6">
      Send commands to {deviceName} using the WhatsApp-style interface below.
    </p>
    <div className="grid grid-cols-2 gap-3 mb-6">
      <Button className="h-12" variant="outline">
        <Play className="w-5 h-5 mr-2" />
        Start Pump
      </Button>
      <Button className="h-12" variant="outline">
        <StopCircle className="w-5 h-5 mr-2" />
        Stop Pump
      </Button>
      <Button className="h-12" variant="outline">
        <Settings2 className="w-5 h-5 mr-2" />
        Set Frequency
      </Button>
      <Button className="h-12" variant="outline">
        <RotateCcw className="w-5 h-5 mr-2" />
        Reset Fault
      </Button>
    </div>
  </div>
);

export default CommandButtons;
