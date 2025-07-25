 import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color, trend, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between`}
    >
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
        <div className="flex items-center mt-2">
          {trend?.type === 'up' ? (
            <span className="text-green-600 dark:text-green-400 mr-1">▲</span>
          ) : (
            <span className="text-red-600 dark:text-red-400 mr-1">▼</span>
          )}
          <span className={`text-sm font-medium ${trend?.type === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{trend?.value}</span>
        </div>
      </div>
      <div className={`bg-gradient-to-br ${color} p-3 rounded-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </motion.div>
  );
};

export default StatCard;
