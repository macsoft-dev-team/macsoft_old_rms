import { motion } from 'framer-motion';
import TitleHead from '../../components/TitleHead';
import CommandPanel from './components/CommandPanel';
import { useDevice } from '../../hooks/useDevice';
import { useCommand } from '../../hooks/useCommand';
import ChatInterface from '../device/components/ChatInterface';
import { useEffect } from 'react';

const MQTTCommands = () => {
  const { devices, device, setDevice: setSelectedDevice, fetchDeviceById } = useDevice();
  const { fetchCommands, setCommands } = useCommand();

  const getDevices = (value) => {
    fetchCommands({
      skip: 0,
      take: 10,
      filter: "",
      deviceId: value
    });
    fetchDeviceById(value)
  };

  useEffect(() => {
    setSelectedDevice(null)
  }, [])
  return (
    <div className="space-y-6">
      <TitleHead title="MQTT Commands" description="Send commands to devices and monitor responses" />
      <div className="grid grid-cols-1 divide-y divide-gray-200 dark:divide-gray-700">
        {/* Command Panel */}
        <motion.div className='grid grid-cols-1 lg:grid-cols-2  divide-y divide-gray-200' initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <CommandPanel
            setSelectedDevice={setSelectedDevice}
            devices={devices}
            getDevices={getDevices}
            setCommands={setCommands}
          />
          {device ? (
            <ChatInterface
              deviceId={device.id}
              deviceName={device.username}
              status={device.status}
            />
          ) : (
            <div className="text-center py-4 min-h-96 ">
              <p className="text-sm text-gray-500 my-auto">No device selected</p>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
};

export default MQTTCommands;
