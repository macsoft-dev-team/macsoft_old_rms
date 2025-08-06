import { motion } from 'framer-motion';
import TitleHead from '../../components/TitleHead';
import CommandPanel from './components/CommandPanel';
import CommandHistory from './components/CommandHistory';
import { useDevice } from '../../hooks/useDevice';
import { useCommand } from '../../hooks/useCommand';

const MQTTCommands = () => {
  const { devices, device, setDevice: setSelectedDevice, fetchDevices } = useDevice();
  const { command, commands, currentPage, totalPages, loading, error, fetchCommands, setCommands, setCommand, postCommand } = useCommand();

  const getDevices = (value) => {
    fetchCommands({
      skip: 0,
      take: 10,
      filter: "",
      deviceId: value
    });
    setSelectedDevice({id: value, name: value}); 
  };
  const onPageChange = (page) => {
    fetchCommands({
      skip: (page - 1) * 10,
      take: 10,
      filter: "",
      deviceId: device?.id
    });
  };

  return (
    <div className="space-y-6">
      <TitleHead title="MQTT Commands" description="Send commands to devices and monitor responses" />
      <div className="grid grid-cols-1 divide-y divide-gray-200 dark:divide-gray-700">
        {/* Command Panel */}
        <motion.div className='grid grid-cols-1 lg:grid-cols-2  divide-y lg:divide-x divide-gray-200' initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <CommandPanel
            setSelectedDevice={setSelectedDevice}
            devices={devices}
            getDevices={getDevices}
            setCommands={setCommands}
          />
          <CommandHistory
            commands={commands}
            command={command}
            device={device}
            postCommand={postCommand}
            onPageChange={onPageChange}
            currentPage={currentPage}
            totalPages={totalPages}
            setCommand={setCommand}
            loading={loading}
            error={error}
          />
        </motion.div>

      </div>
    </div>
  );
};

export default MQTTCommands;
