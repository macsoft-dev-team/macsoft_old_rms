import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  AlertTriangle,
  Play,
  StopCircle,
  Settings2,
  RotateCcw,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DeviceMetricCard from '../components/DeviceMetricCard';
import DeviceMap from '../components/dashboard/DeviceMap';
import ChatInterface from '../components/device/ChatInterface';
import { mockDevices } from '../data/mockData';
import { deviceDashboardMetrics } from '../lib/constants/deviceDashboardMetrics';
const DeviceDashboard = () => {
  const { deviceId } = useParams();
  const device = mockDevices.find(d => d.id === deviceId);
  const hasAlerts = (device.data?.alarmCode ?? 0) !== 0 || (device.data?.faultCode ?? 0) !== 0;

  // Meta: Solar Pump Metrics Grid configuration

  const navigate = useNavigate();


  if (!device) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400">Device not found</p>
      </div>
    );
  }


  const getStatusConfig = (status) => {
    switch (status) {
      case 'online':
        return { color: 'bg-green-100 text-green-800', label: 'ONLINE' };
      case 'offline':
        return { color: 'bg-gray-100 text-gray-800', label: 'OFFLINE' };
      case 'fault':
        return { color: 'bg-red-100 text-red-800', label: 'FAULT' };
      default:
        return { color: 'bg-blue-100 text-blue-800', label: status?.toUpperCase?.() || '' };
    }
  };

  const statusConfig = getStatusConfig(device.status);

  return (
    <div className="space-y-6">
      {/* Header */}
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
              <Badge className={statusConfig.color + " dark:bg-opacity-80"}>
                {statusConfig.label}
              </Badge>
              <span className="text-gray-600 dark:text-gray-300">ID: {device.id}</span>
              <span className="text-gray-600 dark:text-gray-300">IMEI: {device.imei}</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">Last Update</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {new Date(device.lastUpdate).toLocaleString()}
          </p>
        </div>
      </motion.div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="commands">Commands</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Alert Banner */}
          {hasAlerts && (
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
                {device.data?.faultCode !== 0 && (
                  <p className="text-sm text-red-700 dark:text-red-400">Fault Code: {device.data?.faultCode}</p>
                )}
                {device.data?.alarmCode !== 0 && (
                  <p className="text-sm text-red-700 dark:text-red-400">Alarm Code: {device.data?.alarmCode}</p>
                )}
              </div>
            </motion.div>
          )}

          {/* Enhanced Solar Pump Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {deviceDashboardMetrics.map((metric, idx) => (
              <DeviceMetricCard
                key={metric.title + idx}
                icon={metric.icon}
                title={metric.title}
                value={device[metric.key]}
                unit={metric.unit}
                color={metric.color}
              />
            ))}
          </div>

          {/* Historical Data Chart */}
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
                <LineChart data={device.history}>
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

          {/* Location Map */}
          <DeviceMap />
        </TabsContent>

        <TabsContent value="commands">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Device Command Interface
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Send commands to {device.name} using the WhatsApp-style interface below.
              </p>

              {/* Quick Command Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <Button className="h-12" variant="outline">
                  <Play className="w-5 h-5 mr-2" />
                  Start Pump
                </Button>
                <Button className="h-12" variant="outline">
                  <StopCircle className="w-5 h-5 mr-2" />
                  Stop Pump
                </Button>
                <Button className="h-12" variant="outline">
                  <Settings2 className="w-5 h-5 mr-2" />
                  Set Frequency
                </Button>
                <Button className="h-12" variant="outline">
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Reset Fault
                </Button>
              </div>
            </div>

            <div>
              <ChatInterface
                deviceId={device.id}
                deviceName={device.name}
              />
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeviceDashboard;
