import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/button';
import  Input  from '../../../components/ui/input';
import { Calendar, Search, Download } from 'lucide-react';
import TitleHead from '../../../components/TitleHead';
import { useToast } from '../../../hooks/use-toast';
import { useDevice } from '../../../hooks/useDevice';

const DeviceLog = ({ deviceId }) => {
  const { device, deviceLog, fetchDeviceLogs, onDeviceLogPageChange, setDeviceLogFilters } = useDevice();
  const { toast } = useToast();
  
  const { register, handleSubmit, watch, reset, setValue } = useForm({
    defaultValues: {
      fromDate: deviceLog?.fromDate || '',
      toDate: deviceLog?.toDate || '',
      search: ''
    }
  });

  const [currentFilters, setCurrentFilters] = useState({
    fromDate: deviceLog?.fromDate || '',
    toDate: deviceLog?.toDate || '',
    search: ''
  });

  useEffect(() => {
    if (deviceLog?.fromDate) setValue('fromDate', deviceLog.fromDate);
    if (deviceLog?.toDate) setValue('toDate', deviceLog.toDate);
    setCurrentFilters({
      fromDate: deviceLog?.fromDate || '',
      toDate: deviceLog?.toDate || '',
      search: ''
    });
  }, [deviceLog?.fromDate, deviceLog?.toDate, setValue]);

  useEffect(() => {
    if (device && device.imeinumber) {
      fetchInitialLogs();
    }
  }, [device, deviceId]);

  useEffect(() => {
    if (currentFilters.fromDate) setValue('fromDate', currentFilters.fromDate);
    if (currentFilters.toDate) setValue('toDate', currentFilters.toDate);
    if (currentFilters.search) setValue('search', currentFilters.search);
  }, [currentFilters, setValue]);

  const fetchInitialLogs = () => {
    if (device && device.imeinumber) {
      fetchDeviceLogs({
        skip: 1,
        take: 10,
        imeinumber: device.imeinumber,
        tablename: device.tablename
      });
    }
  };

  const onFilterSubmit = (data) => {
    if (device && device.imeinumber) {
      const filterParams = {
        skip: 1,
        take: 10,
        imeinumber: device.imeinumber,
        tablename: device.tablename
      };

      if (data.fromDate) {
        filterParams.fromDate = data.fromDate;
      }
      if (data.toDate) {
        filterParams.toDate = data.toDate;
      }

      const filterData = {
        fromDate: data.fromDate || '',
        toDate: data.toDate || ''
      };
      
      setDeviceLogFilters(filterData);
      setCurrentFilters({
        fromDate: data.fromDate || '',
        toDate: data.toDate || '',
        search: data.search || ''
      });

      fetchDeviceLogs(filterParams);
    }
  };

  const handleClearFilters = () => {
    reset();
    setDeviceLogFilters({ fromDate: '', toDate: '' });
    setCurrentFilters({
      fromDate: '',
      toDate: '',
      search: ''
    });
    fetchInitialLogs();
  };

  const handlePageChange = (page) => {
    if (device && device.imeinumber) {
      const filterParams = {
        skip: page,
        take: 10,
        imeinumber: device.imeinumber,
        tablename: device.tablename
      };

      if (currentFilters.fromDate) {
        filterParams.fromDate = currentFilters.fromDate;
      }
      if (currentFilters.toDate) {
        filterParams.toDate = currentFilters.toDate;
      }

      fetchDeviceLogs(filterParams);
    }
  };

  const handleExport = () => {
    toast({
      title: "Export Feature",
      description: "Export functionality will be implemented soon. Stay tuned for updates!",
      variant: "info"
    });
  };

  const formatValue = (value) => {
    if (value === null || value === undefined) return '--';
    return typeof value === 'number' ? value.toFixed(2) : value;
  };

  
  const hasDevice = device && device.imeinumber;
  const hasLogs = deviceLog && deviceLog.logs && Array.isArray(deviceLog.logs) && deviceLog.logs.length > 0;
  const isLoading = deviceLog?.loading;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className='space-y-4'
     >

          <TitleHead 
            description="View and manage device logs with advanced filtering and search capabilities."
          />

        {!hasDevice && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-yellow-800 dark:text-yellow-200">
              Please select a device to view logs. Current device: {device ? device.imeinumber || 'No IMEI' : 'None'}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onFilterSubmit)}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="flex flex-col group"
            >
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors group-focus-within:text-blue-600">
                From
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                <Input
                  type="date"
                  {...register('fromDate')}
                  className="pl-10 h-11 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                />
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="flex flex-col group"
            >
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors group-focus-within:text-blue-600">
                To
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                <Input
                  type="date"
                  {...register('toDate')}
                  className="pl-10 h-11 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                />
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              className="flex flex-col group"
            >
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors group-focus-within:text-blue-600">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                <Input
                  type="text"
                  placeholder="Search logs..."
                  {...register('search')}
                  className="pl-10 h-11 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                />
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="flex flex-col justify-end"
            >
              <div className="flex gap-2">
                <Button 
                  type="submit"
                  className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={handleClearFilters}
                  className="h-11 px-3 border-2 border-gray-200 dark:border-gray-600 hover:border-orange-500 dark:hover:border-orange-400 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-md"
                  title="Clear Filters"
                >
                  Clear
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={handleExport}
                  className="h-11 px-3 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-md"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </form>
 
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-sm"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <motion.tr 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-b-2 border-gray-200 dark:border-gray-600"
              >
                <th className="text-left p-4 text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">S.No</th>
                <th className="text-left p-4 text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">IMEI</th>
                <th className="text-left p-4 text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Timestamp</th>
                <th className="text-left p-4 text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Status</th>
                <th className="text-left p-4 text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Output Voltage</th>
                <th className="text-left p-4 text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Output Current</th>
                <th className="text-left p-4 text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Flow</th>
                <th className="text-left p-4 text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Temperature</th>
                <th className="text-left p-4 text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Signal Strength</th>
              </motion.tr>
            </thead>
            <tbody>
              {isLoading ? (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td colSpan="9" className="text-center p-12">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="relative">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 dark:border-blue-800"></div>
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent absolute top-0"></div>
                      </div>
                      <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-600 dark:text-gray-400 font-medium"
                      >
                        Loading device logs...
                      </motion.span>
                    </div>
                  </td>
                </motion.tr>
              ) : !hasLogs ? (
                <motion.tr
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <td colSpan="9" className="text-center p-12">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <Search className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="text-center">
                        <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">No data available</h4>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          {!hasDevice 
                            ? 'Please select a device first' 
                            : 'Try adjusting your search criteria or date range'
                          }
                        </p>
                      </div>
                    </div>
                  </td>
                </motion.tr>
              ) : (
                deviceLog.logs.map((log, index) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0, x: -30, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ 
                      delay: index * 0.1,
                      duration: 0.4,
                      ease: "easeOut"
                    }}
                    whileHover={{ 
                      backgroundColor: 'rgba(59, 130, 246, 0.05)',
                     }}
                    className="border-b border-gray-100 dark:border-gray-700 cursor-pointer group"
                  >
                    <td className="p-4 text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {(deviceLog.currentPage - 1) * 10 + index + 1}
                    </td>
                    <td className="p-4 text-sm text-gray-900 dark:text-gray-100 font-mono group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {log.imeinumber}
                    </td>
                    <td className="p-4 text-sm text-gray-900 dark:text-gray-100 font-mono group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4 text-sm text-gray-900 dark:text-gray-100">
                      <motion.span 
                        whileHover={{ scale: 1.05 }}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                          log.status === 2 
                            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                            : log.status === 1
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                            : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                        }`}>
                        {log.status === 1 ? 'ONLINE' : log.status === 2 ? 'FAULT' : 'OFFLINE'}
                      </motion.span>
                    </td>
                    <td className="p-4 text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {formatValue(log.outputVoltage)} V
                    </td>
                    <td className="p-4 text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {formatValue(log.outputCurrent)} A
                    </td>
                    <td className="p-4 text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {formatValue(log.flow)} L/min
                    </td>
                    <td className="p-4 text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {formatValue(log.temperature)}°C
                    </td>
                    <td className="p-4 text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {formatValue(log.signalStrength)}%
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>     
      {deviceLog.totalPages > 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex justify-between items-center px-8"
        >
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.4 }}
            className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider"
          >
            Page <span className="font-bold text-blue-600 dark:text-blue-400">{deviceLog.currentPage}</span> of <span className="font-bold text-blue-600 dark:text-blue-400">{deviceLog.totalPages}</span>
            {deviceLog.totalCount && (
              <span className="ml-2">
                | Total: <span className="font-bold text-blue-600 dark:text-blue-400">{deviceLog.totalCount}</span> records
              </span>
            )}
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.4 }}
            className="flex gap-3"
          >
            <Button
              variant="outline"
              size="small"
              onClick={() => handlePageChange(Math.max(1, deviceLog.currentPage - 1))}
              disabled={deviceLog.currentPage === 1}
              className="border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="small"
              onClick={() => handlePageChange(Math.min(deviceLog.totalPages, deviceLog.currentPage + 1))}
              disabled={deviceLog.currentPage === deviceLog.totalPages}
              className="border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Next
            </Button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DeviceLog;
