
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Plus, Download } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import  Select from '../components/ui/select';
import DeviceCard from '../components/devices/DeviceCard';
import { mockDevices } from '../data/mockData';
import TitleHead from '../components/TitleHead';
import SearchForm from '../components/SearchForm';
import { NavLink } from 'react-router-dom';

const Devices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [manufacturerFilter, setManufacturerFilter] = useState('all');

  const filteredDevices = mockDevices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || device.status === statusFilter;
    const matchesManufacturer = manufacturerFilter === 'all' || device.manufacturer === manufacturerFilter;

    return matchesSearch && matchesStatus && matchesManufacturer;
  })
    // Sort by most recent data first
    .sort((a, b) => new Date(b.lastUpdate) - new Date(a.lastUpdate));

  const manufacturers = [...new Set(mockDevices.map(device => device.manufacturer))];



  return (
    <div className="space-y-6">
      <TitleHead title="Device Management" description="Monitor and manage all solar pump devices">
        <div className="flex gap-3 *:uppercase *:text-sm">
          <Button variant="outline" className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
            <Download className="w-4 h-4 mr-2" />
            <span className='hidden lg:inline'>

              Export
            </span>
          </Button>
          <NavLink to="/devices/create">
          <Button className="dark:bg-blue-500 dark:hover:bg-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            <span className='hidden lg:inline'> Add Device</span>
          </Button>
          </NavLink>
        </div>
      </TitleHead>

      {/* Filters (Search, Status, Manufacturer) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <SearchForm value={searchTerm} onSearch={(value) => setSearchTerm(value)} onClear={() => setSearchTerm('')} />
        <div className="w-full sm:w-48">
          <Select
            options={[
              { value: 'all', label: 'All Devices' },
              { value: 'online', label: 'Online' },
              { value: 'offline', label: 'Offline' },
              { value: 'fault', label: 'Fault' },
            ]}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            placeholder="All Status"
            className="w-full dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            options={[{ value: 'all', label: 'All Manufacturers' }, ...manufacturers.map(m => ({ value: m, label: m }))]}
            value={manufacturerFilter}
            onChange={e => setManufacturerFilter(e.target.value)}
            placeholder="All Manufacturers"
            className="w-full dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
        </div>
        <Button variant="outline" className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
          <Filter className="w-4 h-4 mr-2" />
          More Filters
        </Button>
      </motion.div>

      {/* Recently Updated Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center space-x-2"
      >
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700">
          📊 Sorted by most recent data
        </Badge>
        <span className="text-sm text-gray-500 dark:text-gray-300">
          ({filteredDevices.length} devices shown)
        </span>
      </motion.div>

      {/* Devices Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredDevices.map((device, index) => (
          <DeviceCard
            key={device.id}
            device={device}
            delay={index * 0.1}
            darkMode={true}
          />
        ))}
      </motion.div>

      {filteredDevices.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-gray-500 dark:text-gray-300 text-lg">No devices found matching your criteria</p>
        </motion.div>
      )}
    </div>
  );
};

export default Devices;
