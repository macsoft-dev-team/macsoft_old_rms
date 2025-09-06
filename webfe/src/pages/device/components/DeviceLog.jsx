import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/button';
import  Input  from '../../../components/ui/input';
import { Calendar, Search, Download } from 'lucide-react';
import TitleHead from '../../../components/TitleHead';
import { useToast } from '../../../hooks/use-toast';
import { useDevice } from '../../../hooks/useDevice';
import { deviceLogTableConfig, getColorConfig, getTotalColumns } from '../../../lib/constants/deviceLogTableConfig';

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

  // Helper to format date and time from ISO string
  const formatDateAndTime = (isoString) => {
    if (!isoString) return { date: '--', time: '--' };
    // Split at 'T'
    const [datePart, timePartRaw] = isoString.split('T');
    if (!datePart || !timePartRaw) return { date: '--', time: '--' };
    // Format date yyyy-mm-dd -> dd-MM-yyyy
    const [yyyy, mm, dd] = datePart.split('-');
    const date = [dd, mm, yyyy].join('-');
    // Format time: hh:mm:ss from hh:mm:ss.sssZ
    const time = timePartRaw.slice(0, 8);
    return { date, time };
  };

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

        <form className='select-none' onSubmit={handleSubmit(onFilterSubmit)}>
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
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1600px]">
            <thead>
              <motion.tr
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.3 }}
                className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700"
              >
                {/* Fixed columns */}
                <th className="p-3 border-r border-slate-200 dark:border-slate-600" />
                <th className="p-3 border-r border-slate-200 dark:border-slate-600" />
                
                {/* Dynamic sections */}
                {deviceLogTableConfig.sections.map((section) => {
                  const colorConfig = getColorConfig(section.color);
                  return (
                    <th 
                      key={section.id}
                      className={`text-center p-3 font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider border-r border-slate-200 dark:border-slate-600 ${colorConfig.bg}`} 
                      colSpan={section.columns.length}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <div className={`w-2 h-2 ${colorConfig.dot} rounded-full`}></div>
                        {section.name}
                      </div>
                    </th>
                  );
                })}
                
                {/* Additional columns */}
                <th className="text-center p-3 font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider border-r border-slate-200 dark:border-slate-600 ">
                  RMS
                </th>
              </motion.tr>
              
              <motion.tr 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 border-b-2 border-slate-300 dark:border-slate-500"
              >
                {/* Fixed columns */}
                {deviceLogTableConfig.fixedColumns.map((column) => (
                  <th 
                    key={column.key}
                    className={`text-center p-4 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider border-r border-slate-200 dark:border-slate-600 ${column.width}`}
                  >
                    <div className="flex flex-col items-center">
                      <span>{column.label}</span>
                      {column.description && (
                        <span className="font-normal text-xs text-slate-500 dark:text-slate-400">{column.description}</span>
                      )}
                    </div>
                  </th>
                ))}
                
                {/* Dynamic section columns */}
                {deviceLogTableConfig.sections.map((section) => {
                  const colorConfig = getColorConfig(section.color);
                  return section.columns.map((column) => (
                    <th 
                      key={column.key}
                      className={`text-center p-4 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider border-r border-slate-200 dark:border-slate-600 ${colorConfig.bgLight} ${column.width}`}
                    >
                      <div className="flex flex-col items-center">
                        <span>{column.label}</span>
                        {column.unit && (
                          <span className="font-normal text-xs text-slate-500 dark:text-slate-400">({column.unit})</span>
                        )}
                      </div>
                    </th>
                  ));
                })}
                
                {/* Additional columns */}
                {deviceLogTableConfig.additionalColumns.map((column) => (
                  <th 
                    key={column.key}
                    className={`text-center p-4 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider ${column.width}`}
                  >
                    <div className="flex flex-col items-center">
                      <span>{column.label}</span>
                      {column.description && (
                        <span className="font-normal text-xs text-slate-500 dark:text-slate-400">{column.description}</span>
                      )}
                    </div>
                  </th>
                ))}
              </motion.tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {isLoading ? (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td colSpan={getTotalColumns()} className="text-center p-16">
                    <div className="flex flex-col items-center justify-center space-y-6">
                      <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 dark:border-blue-800"></div>
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0"></div>
                      </div>
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-center"
                      >
                        <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-1">Loading device logs...</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Please wait while we fetch the latest data</p>
                      </motion.div>
                    </div>
                  </td>
                </motion.tr>
              ) : !hasLogs ? (
                <motion.tr
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <td colSpan={getTotalColumns()} className="text-center p-16">
                    <div className="flex flex-col items-center justify-center space-y-6">
                      <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                        <Search className="h-10 w-10 text-slate-400" />
                      </div>
                      <div className="text-center">
                        <h4 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">No data available</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md">
                          {!hasDevice 
                            ? 'Please select a device first to view its logs and monitoring data.' 
                            : 'No logs found for the selected criteria. Try adjusting your search parameters or date range.'
                          }
                        </p>
                      </div>
                    </div>
                  </td>
                </motion.tr>
              ) : (
                deviceLog.logs.map((log, index) => {
                  const { date, time } = formatDateAndTime(log.timestamp);
                  return (
                    <motion.tr
                      key={log.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ 
                        delay: index * 0.05,
                        duration: 0.3,
                        ease: "easeOut"
                      }}
                      whileHover={{ 
                        backgroundColor: 'rgba(59, 130, 246, 0.03)',
                        scale: 1.001
                      }}
                      className="hover:shadow-sm transition-all duration-200 group"
                    >
                      {/* Fixed columns */}
                      <td className="p-4 text-center text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors border-r border-slate-100 dark:border-slate-700">
                        <div className="flex items-center justify-center w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full text-xs font-bold">
                          {(deviceLog.currentPage - 1) * 10 + index + 1}
                        </div>
                      </td>
                      <td className="p-4 text-center text-sm text-slate-900 dark:text-slate-100 font-mono border-r border-slate-100 dark:border-slate-700">
                        <div className="flex flex-col items-center">
                          <span className="font-semibold">
                            {date}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {time}
                          </span>
                        </div>
                      </td>
                      
                      {/* Dynamic section columns */}
                      {deviceLogTableConfig.sections.map((section) => {
                        const colorConfig = getColorConfig(section.color);
                        return section.columns.map((column) => (
                          <td 
                            key={column.key}
                            className={`p-4 text-center text-sm font-semibold border-r border-slate-100 dark:border-slate-700 ${colorConfig.bgRow}`}
                          >
                            <span className="text-slate-900 dark:text-slate-100">{formatValue(log[column.key])}</span>
                          </td>
                        ));
                      })}
                      
                      {/* Signal column */}
                      <td className="p-4 text-center text-sm font-semibold">
                        <div className="flex flex-col items-center">
                          <span className="text-slate-900 dark:text-slate-100 font-bold">{formatValue(log.signalStrength)}%</span>
                          <div className="w-full max-w-[60px] bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${Math.min(100, Math.max(0, log.signalStrength || 0))}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {hasLogs && (
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between text-sm">
              <div className="text-slate-600 dark:text-slate-400">
                Showing <span className="font-semibold text-slate-900 dark:text-slate-100">{((deviceLog.currentPage - 1) * 10) + 1}</span> to{' '}
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {Math.min(deviceLog.currentPage * 10, deviceLog.totalCount || 0)}
                </span> of{' '}
                <span className="font-semibold text-slate-900 dark:text-slate-100">{deviceLog.totalCount || 0}</span> results
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Last updated: {new Date().toLocaleString('en-GB')}
              </div>
            </div>
          </div>
        )}
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
