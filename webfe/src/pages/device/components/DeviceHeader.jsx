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
    className="flex  sm:items-center sm:justify-between gap-4"
  >
    <div className="flex items-start sm:items-center space-x-3 sm:space-x-4">
      <Button
        variant="outline"
        size="icon"
        onClick={() => navigate('/devices')}
        className="shrink-0"
      >
        <ArrowLeft className="w-4 h-4" />
      </Button>
     
    </div>
    <div className="min-w-0 ms-auto grid">
      <h1 className="text-lg sm:text-2xl tracking-wide font-medium text-slate-700 dark:text-white uppercase break-words">{device.name}</h1>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
        <Badge className={statusColors[device.status] + " dark:bg-opacity-80 w-fit"}>
          {device.status}
        </Badge>
        <div className="text-left sm:text-right shrink-0">
          <p className="text-sm text-gray-500 dark:text-gray-400">Last Update</p>
          <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
            {dateF(device.lastupdated)}
          </p>
        </div>
      </div>
    </div>
  </motion.div>
);

export default DeviceHeader;
