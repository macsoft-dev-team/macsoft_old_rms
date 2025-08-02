import { motion } from 'motion/react';
import { AlertTriangle } from 'lucide-react';

const AlertBanner = ({ faultCode, alarmCode }) => {
  if (faultCode === 0 && alarmCode === 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4"
    >
      <div className="flex items-center space-x-2">
        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
        <h3 className="font-semibold text-red-800 dark:text-red-300">Active Alerts</h3>
      </div>
      <div className="mt-2 space-y-1">
        {faultCode !== 0 && (
          <p className="text-sm text-red-700 dark:text-red-400">Fault Code: {faultCode}</p>
        )}
        {alarmCode !== 0 && (
          <p className="text-sm text-red-700 dark:text-red-400">Alarm Code: {alarmCode}</p>
        )}
      </div>
    </motion.div>
  );
};

export default AlertBanner;
