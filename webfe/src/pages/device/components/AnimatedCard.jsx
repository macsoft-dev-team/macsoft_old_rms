 import { motion } from "motion/react";

const colorMap = {
  yellow: "bg-yellow-100 dark:bg-yellow-950 border-yellow-400 dark:border-yellow-600",
  blue: "bg-blue-100 dark:bg-blue-950 border-blue-400 dark:border-blue-600",
  purple: "bg-purple-100 dark:bg-purple-950 border-purple-400 dark:border-purple-600",
  green: "bg-green-100 dark:bg-green-950 border-green-400 dark:border-green-600",
  red: "bg-red-100 dark:bg-red-950 border-red-400 dark:border-red-600",
  orange: "bg-orange-100 dark:bg-orange-950 border-orange-400 dark:border-orange-600"
};

export default function AnimatedCard({
  title,
  value,
  unit,
  icon: Icon,
  color = "blue",
  animation = {},
  children
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1, ...animation }}
      transition={{ duration: 0.5 }}
      className={`rounded-lg shadow p-6 border-l-4 ${colorMap[color] || colorMap.blue} dark:shadow-none`}
    >
      <div className="flex items-center space-x-3 mb-2">
        {Icon && (typeof Icon === "function" ? <Icon /> : Icon)}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      </div>
      <div className="flex items-baseline space-x-2 mb-2">
        <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">{unit}</span>
      </div>
      {children}
    </motion.div>
  );
}
