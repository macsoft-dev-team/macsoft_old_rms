import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color, trend, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 flex items-center justify-between`}
    >
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">{title}</p>
        <p className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1 sm:mt-2">{value}</p>
        <div className="flex items-center mt-1 sm:mt-2">
          {trend && (
            <>
              {trend.type === 'up' ? (
                <span className="text-green-600 dark:text-green-400 mr-1">▲</span>
              ) : (
                <span className="text-red-600 dark:text-red-400 mr-1">▼</span>
              )}
              <span className={`text-xs sm:text-sm font-medium ${trend.type === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {trend.value}
              </span>
            </>
          )}
        </div>
      </div>
      <div className={`bg-gradient-to-br ${color} p-2 sm:p-3 rounded-lg ml-3 flex-shrink-0`}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </div>
    </motion.div>
  );
};

export default StatCard;
