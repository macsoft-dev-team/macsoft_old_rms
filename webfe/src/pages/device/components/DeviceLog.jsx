import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/button';
import  Input  from '../../../components/ui/input';
import { Calendar, Search, Download } from 'lucide-react';
import TitleHead from '../../../components/TitleHead';
import { useToast } from '../../../hooks/use-toast';

const DeviceLog = ({ deviceId }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('2025-01-01');
  const [toDate, setToDate] = useState('2025-08-07');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  const mockLogs = [
    {
      id: 1,
      messageType: 'DATA',
      timestamp: '2025-08-07 14:30:15',
      lpm: 45.2,
      dcAmps: 12.5,
      dcVolts: 24.8,
      pvVolts: 28.3,
      pvCurrent: 8.7,
      totalDischarge: 156.8
    },
    {
      id: 2,
      messageType: 'ALARM',
      timestamp: '2025-08-07 14:25:10',
      lpm: 42.1,
      dcAmps: 11.8,
      dcVolts: 24.2,
      pvVolts: 27.9,
      pvCurrent: 8.3,
      totalDischarge: 156.2
    },
  ];

  useEffect(() => {
    fetchDeviceLogs();
  }, [deviceId, currentPage, searchTerm, fromDate, toDate]);

  const fetchDeviceLogs = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setLogs(mockLogs);
        setTotalPages(1);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching device logs:', error);
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchDeviceLogs();
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
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
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
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="flex flex-col justify-end"
          >
            <div className="flex gap-3">
              <Button 
                onClick={handleSearch} 
                className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button 
                variant="outline" 
                onClick={handleExport}
                className="h-11 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-md"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </motion.div>
 
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
                <th className="text-left p-4 text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Message Type</th>
                <th className="text-left p-4 text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Timestamp</th>
                <th className="text-left p-4 text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">LPM</th>
                <th className="text-left p-4 text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">DC Amps</th>
                <th className="text-left p-4 text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">DC Volts</th>
                <th className="text-left p-4 text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">PV Volts</th>
                <th className="text-left p-4 text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">PV Current</th>
                <th className="text-left p-4 text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Total Discharge</th>
              </motion.tr>
            </thead>
            <tbody>
              {loading ? (
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
              ) : logs.length === 0 ? (
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
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Try adjusting your search criteria or date range</p>
                      </div>
                    </div>
                  </td>
                </motion.tr>
              ) : (
                logs.map((log, index) => (
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
                      {(currentPage - 1) * 10 + index + 1}
                    </td>
                    <td className="p-4 text-sm text-gray-900 dark:text-gray-100">
                      <motion.span 
                        whileHover={{ scale: 1.05 }}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                          log.messageType === 'ALARM' 
                            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                            : log.messageType === 'WARNING'
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                            : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                        }`}>
                        {log.messageType}
                      </motion.span>
                    </td>
                    <td className="p-4 text-sm text-gray-900 dark:text-gray-100 font-mono group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {log.timestamp}
                    </td>
                    <td className="p-4 text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {formatValue(log.lpm)}
                    </td>
                    <td className="p-4 text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {formatValue(log.dcAmps)}
                    </td>
                    <td className="p-4 text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {formatValue(log.dcVolts)}
                    </td>
                    <td className="p-4 text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {formatValue(log.pvVolts)}
                    </td>
                    <td className="p-4 text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {formatValue(log.pvCurrent)}
                    </td>
                    <td className="p-4 text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {formatValue(log.totalDischarge)}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>     
      {totalPages > 1 && (
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
            Page <span className="font-bold text-blue-600 dark:text-blue-400">{currentPage}</span> of <span className="font-bold text-blue-600 dark:text-blue-400">{totalPages}</span>
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
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="small"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
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
