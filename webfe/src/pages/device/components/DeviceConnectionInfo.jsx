import { motion } from 'motion/react';
import { Copy, Server, Shield, WifiIcon, Hash, User, Key, ArrowUpDown } from 'lucide-react';
import { useState } from 'react';

const DeviceConnectionInfo = ({ device }) => {
  const [copiedField, setCopiedField] = useState(null);

  const imei = device?.imeinumber || device?.serialNumber || '862287076795236';
    const serialNumber = device?.serialNumber || imei;
  const connectionInfo = {
    host: 'mqtt.macsoftautomations.in',
    imei: imei,
    username: `device_${imei}`,
    password: '$2b$10$IIzivdY7/40uyzWxpFoiPu.mO0WUjuR1tAUgQiHvVLDGrBkYlS6ZW',
    port: '1883',
    pubTopicData: `device/${imei}/data`,
    subTopicCmd: `device/${imei}/cmd`,
    pubTopicCmd: `device/${imei}/cmd/response`,
    serialNumber: serialNumber,
  };

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const InfoCard = ({ icon: Icon, label, value, field, className = "" }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.random() * 0.3 }}
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-all duration-300 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="flex-shrink-0 p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg"
          >
            <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </motion.div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {label}
            </p>
            <p className="text-sm font-mono text-gray-900 dark:text-gray-100 break-all">
              {value}
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => copyToClipboard(value, field)}
          className="flex-shrink-0 ml-2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          title="Copy to clipboard"
        >
          {copiedField === field ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-green-500"
            >
              ✓
            </motion.div>
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </motion.button>
      </div>
    </motion.div>
  );

  const TopicCard = ({ icon: Icon, label, topic, field, type }) => (
    <motion.div
      initial={{ opacity: 0, x: type === 'pub' ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-700 p-4 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 10 }}
            className={`flex-shrink-0 p-2 rounded-lg ${
              type === 'pub' 
                ? 'bg-green-100 dark:bg-green-900/40' 
                : 'bg-orange-100 dark:bg-orange-900/40'
            }`}
          >
            <Icon className={`h-5 w-5 ${
              type === 'pub' 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-orange-600 dark:text-orange-400'
            }`} />
          </motion.div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {label}
              </p>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                type === 'pub' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' 
                  : 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300'
              }`}>
                {type.toUpperCase()}
              </span>
            </div>
            <p className="text-sm font-mono text-gray-900 dark:text-gray-100 break-all">
              {topic}
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => copyToClipboard(topic, field)}
          className="flex-shrink-0 ml-2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          title="Copy to clipboard"
        >
          {copiedField === field ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-green-500"
            >
              ✓
            </motion.div>
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </motion.button>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg p-6 border border-blue-200 dark:border-blue-700"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="p-2 bg-blue-100 dark:bg-blue-800/50 rounded-lg"
            >
              <WifiIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </motion.div>
            <div>
              <h3 className="text-md sm:text-xl uppercase tracking-wide text-gray-800 dark:text-gray-100">Device Connection Information</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm sm:text-base">MQTT Configuration & Topics</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const allInfo = Object.entries(connectionInfo)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join('\n');
                copyToClipboard(allInfo, 'all');
              }}
              className="sm:hidden p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 shadow-md"
              title="Copy All Configuration"
            >
              <Copy className="h-4 w-4" />
              {copiedField === 'all' && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 text-green-300"
                >
                  ✓
                </motion.span>
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const allInfo = Object.entries(connectionInfo)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join('\n');
                copyToClipboard(allInfo, 'all');
              }}
              className="hidden sm:flex px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 items-center space-x-2 shadow-md text-sm"
            >
              <Copy className="h-4 w-4" />
              <span>Copy All</span>
              {copiedField === 'all' && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-green-300"
                >
                  ✓
                </motion.span>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
       
        <InfoCard
          icon={Server}
          label="MQTT Host"
          value={connectionInfo.host}
          field="host"
          className="md:col-span-2 lg:col-span-1"
        />
        <InfoCard 
          icon={ArrowUpDown} 
          label="Port" 
          value={connectionInfo.port} 
          field="port"
        />
        <InfoCard
          icon={Hash}
          label="IMEI Number"
          value={connectionInfo.imei}
          field="imei"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <InfoCard 
          icon={User} 
          label="Username" 
          value={connectionInfo.username} 
          field="username"
        />
        <InfoCard 
          icon={Shield} 
          label="Password" 
          value={connectionInfo.password} 
          field="password"
        /> 
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="space-y-4"
      >
        <motion.h4 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center space-x-2"
        >
          <ArrowUpDown className="h-5 w-5" />
          <span>MQTT Topics</span>
        </motion.h4>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-4">
            <TopicCard 
              icon={ArrowUpDown} 
              label="Publish Topic - Data" 
              topic={connectionInfo.pubTopicData} 
              field="pubTopicData"
              type="pub"
            />
            <TopicCard 
              icon={ArrowUpDown} 
              label="Publish Topic - Command Response" 
              topic={connectionInfo.pubTopicCmd} 
              field="pubTopicCmd"
              type="pub"
            />
          </div>
          <div className="space-y-4">
            <TopicCard 
              icon={ArrowUpDown} 
              label="Subscribe Topic - Commands" 
              topic={connectionInfo.subTopicCmd} 
              field="subTopicCmd"
              type="sub"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="hidden lg:block bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700 p-4 hover:shadow-lg transition-all duration-300 h-max"
            >
              <div className="flex items-start justify-between h-full">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className="flex-shrink-0 p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg"
                  >
                    <WifiIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </motion.div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Connection Status
                      </p>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        device?.status === 'online' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' 
                          : device?.status === 'offline'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300'
                      }`}>
                        {device?.status?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </div>
                    <p className="text-sm font-mono text-gray-900 dark:text-gray-100 break-all">
                      {device?.status === 'online' ? 'Device is connected' : 
                       device?.status === 'offline' ? 'Device is disconnected' : 
                       'Status information unavailable'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DeviceConnectionInfo;
