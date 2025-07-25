import React from "react";
import { motion } from "motion/react";

const colorMap = {
  yellow: "bg-yellow-100 border-yellow-400",
  blue: "bg-blue-100 border-blue-400",
  purple: "bg-purple-100 border-purple-400",
  green: "bg-green-100 border-green-400",
  red: "bg-red-100 border-red-400",
  orange: "bg-orange-100 border-orange-400"
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
      className={`rounded-lg shadow p-6 border-l-4 ${colorMap[color] || colorMap.blue}`}
    >
      <div className="flex items-center space-x-3 mb-2">
        {Icon && (typeof Icon === "function" ? <Icon /> : Icon)}
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="flex items-baseline space-x-2 mb-2">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        <span className="text-sm text-gray-500">{unit}</span>
      </div>
      {children}
    </motion.div>
  );
}
