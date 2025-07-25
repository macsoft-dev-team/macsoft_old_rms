import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../ui/badge';
import { NavLink } from 'react-router-dom';

const statusColors = {
  online: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
  offline: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  fault: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
};

const DeviceCard = ({ device, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-700 flex flex-col space-y-2 transition-all duration-200 hover:shadow-2xl hover:shadow-blue-200/40 dark:hover:shadow-blue-900/40 hover:-translate-y-1 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
    >
      <div className="flex items-center justify-between p-4 gap-2">
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">{device.name}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{device.manufacturer}</span>
        </div>
        <Badge className={statusColors[device.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}>
          {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
        </Badge>
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 px-4">ID: {device.id}</div>
      <div className="text-sm text-gray-700 dark:text-gray-200 px-4">Last Update: {device.lastUpdate}</div>
      <div className='flex-grow'></div>
      <div className="px-4 pb-4">
        <NavLink
          to={`/devices/${device.id}`}
          className="w-full inline-block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors duration-150"
        >
          View Details
        </NavLink>
      </div>
    </motion.div>
  );
};

export default DeviceCard;
