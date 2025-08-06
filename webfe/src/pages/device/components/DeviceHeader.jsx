import { Button } from '../../../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { dateF } from '../../../lib/constants/variables';
import { motion } from 'motion/react';

const statusColors = {
  ONLINE: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
  OFFLINE: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  FAULT: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
};

const DeviceHeader = ({ device, statusConfig, navigate }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center justify-between"
  >
    <div className="flex items-center space-x-4">
      <Button
        variant="outline"
        size="icon"
        onClick={() => navigate('/devices')}
      >
        <ArrowLeft className="w-4 h-4" />
      </Button>
      <div>
        <h1 className="text-2xl sm:text-2xl tracking-wide font-medium text-slate-700 dark:text-white uppercase">{device.name}</h1>
        <div className="flex items-center space-x-4 mt-2">
          <Badge className={statusColors[device.status] + " dark:bg-opacity-80"}>
            {device.status}
          </Badge>
          <span className="text-gray-600 dark:text-gray-300">username: {device.username}</span>
          <span className="text-gray-600 dark:text-gray-300">IMEI: {device.imeinumber}</span>
        </div>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm text-gray-500 dark:text-gray-400">Last Update</p>
      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {dateF(device.lastupdated)}
      </p>
    </div>
  </motion.div>
);

export default DeviceHeader;
