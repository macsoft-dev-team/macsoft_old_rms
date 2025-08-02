import { motion } from 'motion/react';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from 'recharts';

const HistoricalChart = ({ history }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
    className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border dark:border-gray-800"
  >
    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
      Historical Data Trends (Last 3 Days)
    </h3>
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={history}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
            stroke="#6b7280"
          />
          <YAxis stroke="#6b7280" />
          <Tooltip
            labelFormatter={(value) => new Date(value).toLocaleString()}
            contentStyle={{
              backgroundColor: 'rgb(255 255 255 / 1)',
              color: '#111827',
              border: '1px solid #e5e7eb'
            }}
            wrapperStyle={{
              backgroundColor: 'rgb(31 41 55 / 1)',
              color: '#f3f4f6',
              border: '1px solid #374151'
            }}
          />
          <Line type="monotone" dataKey="motorVoltage" stroke="#3b82f6" strokeWidth={2} name="Motor Voltage" />
          <Line type="monotone" dataKey="motorCurrent" stroke="#10b981" strokeWidth={2} name="Motor Current" />
          <Line type="monotone" dataKey="temperature" stroke="#f59e0b" strokeWidth={2} name="Temperature" />
          <Line type="monotone" dataKey="pvVoltage" stroke="#8b5cf6" strokeWidth={2} name="PV Voltage" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </motion.div>
);

export default HistoricalChart;
