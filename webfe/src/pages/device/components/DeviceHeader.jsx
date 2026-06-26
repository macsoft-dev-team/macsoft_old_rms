import { Button } from '../../../components/ui/button';
import { ArrowLeft, Clock, Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { dateF } from '../../../lib/constants/variables';
import { motion } from 'motion/react';

const statusConfig = {
  1: { // ONLINE
    color: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
    icon: Wifi,
    pulse: 'animate-pulse',
    text: 'ONLINE'
  },
  0: { // OFFLINE
    color: 'bg-gradient-to-r from-gray-400 to-slate-500 text-white',
    icon: WifiOff,
    pulse: '',
    text: 'OFFLINE'
  },
  2: { // FAULT (keeping as fallback)
    color: 'bg-gradient-to-r from-red-500 to-pink-500 text-white',
    icon: AlertTriangle,
    pulse: 'animate-pulse',
    text: 'FAULT'
  },
};

const DeviceHeader = ({ device, navigate }) => {
  const StatusIcon = statusConfig[device.status]?.icon || Wifi;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden"
    >
      {/* Main Header Container */}
      <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-gray-900/5 dark:shadow-black/20">

        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-400/20 via-purple-400/20 to-transparent rounded-full blur-2xl" />
        </div>

        {/* Content */}
        <div className="relative p-3 sm:p-4">
          <div className="flex items-center justify-between gap-3">

            {/* Back Button */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="small"
                onClick={() => navigate('/devices')}
              >
                <ArrowLeft className="w-3.5 h-3.5 text-gray-700 dark:text-gray-200" />
              </Button>
            </motion.div>

            {/* Device Info */}
            <motion.div
              className="flex-1 min-w-0 text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <motion.p
                className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                Device Monitor
              </motion.p>
            </motion.div>

            {/* Status Indicator */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, duration: 0.6, type: "spring", bounce: 0.4 }}
              className="flex-shrink-0"
            >
              <div className={`relative p-2 rounded-xl ${statusConfig[device.status]?.color || statusConfig[0].color} shadow-md`}>
                <StatusIcon className={`w-4 h-4 ${statusConfig[device.status]?.pulse || ''}`} />
                {device.status === 1 && (
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full animate-ping" />
                )}
              </div>
            </motion.div>
          </div>

          {/* Status and Last Update Row */}
          <motion.div
            className="flex items-center justify-between gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            {/* Status Badge */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Badge className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/60 dark:border-gray-600/60 text-gray-700 dark:text-gray-200 font-medium rounded-full shadow-sm text-xs">
                <div className={`w-1.5 h-1.5 rounded-full ${device.status === 1 ? 'bg-green-500 animate-pulse' :
                    device.status === 2 ? 'bg-red-500 animate-pulse' :
                      'bg-gray-400'
                  }`} />
                {statusConfig[device.status]?.text || 'UNKNOWN'}
              </Badge>
            </motion.div>

            {/* Last Update */}
            <motion.div
              className="flex items-center gap-1.5 text-right"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >

              <div>
                <div className='text-emerald-700 tracking-widest'>
                  IMEI : {device.imeinumber}
                </div>
                <div className="flex justify-end gap-1.5 my-1 text-[10px] sm:text-xs">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 font-medium shadow-sm">
                    HW: <span className="ml-1 font-semibold text-indigo-600 dark:text-indigo-400">{device.hardwareVersion !== undefined && device.hardwareVersion !== null ? `v${device.hardwareVersion}` : 'N/A'}</span>
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 font-medium shadow-sm">
                    FW: <span className="ml-1 font-semibold text-indigo-600 dark:text-indigo-400">{device.firmwareVersion !== undefined && device.firmwareVersion !== null ? `v${device.firmwareVersion}` : 'N/A'}</span>
                  </span>
                </div>
                <p className="text-xs flex items-center justify-end gap-2 text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium leading-none">
                  <Clock className="w-3 h-3 text-gray-400" /> Last Update
                </p>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                  {dateF(device.lastupdated)}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Accent Line */}
        <motion.div
          className={`h-1 ${statusConfig[device.status]?.color || statusConfig[0].color}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
          style={{ originX: 0 }}
        />
      </div>
    </motion.div>
  );
};

export default DeviceHeader;
