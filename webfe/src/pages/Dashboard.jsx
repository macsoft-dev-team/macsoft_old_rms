import React from 'react';
import { motion } from 'framer-motion';
import { Zap, WifiOff, AlertTriangle, Users, TrendingUp, Activity } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import DeviceMap from '../components/dashboard/DeviceMap';
import RecentActivity from '../components/dashboard/RecentActivity';

import Select from '../components/ui/select';

import { mockStats } from '../data/mockData';
import { DASHBOARD_STATS } from '../lib/constants/dashboard';

const Dashboard = () => {
  // Map icon string to actual icon component
  const iconMap = {
    Zap,
    Activity,
    AlertTriangle,
    WifiOff,
    Users,
    TrendingUp,
  };

  // Example select state for filtering stats
  const [statFilter, setStatFilter] = React.useState('all');

  const statOptions = [
    { value: 'all', label: 'All Stats' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  const stats = DASHBOARD_STATS.map((stat) => ({
    ...stat,
    value: mockStats[stat.key],
    icon: iconMap[stat.icon],
  }));

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor your solar pump network in real-time</p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-right"
        >
          <p className="text-sm text-gray-500">Last updated</p>
          <p className="text-lg font-semibold text-gray-900">
            {new Date().toLocaleTimeString()}
          </p>
        </motion.div>
      </motion.div>

      {/* Example Select for filtering stats */}
      <div className="w-48 mb-2">
        <Select
          options={statOptions}
          value={statFilter}
          onChange={e => setStatFilter(e.target.value)}
          placeholder="Filter stats"
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats
          // Example filter logic (no-op for now)
          .filter(stat => statFilter === 'all' || stat.status === statFilter)
          .map((stat, index) => {
            const { key, ...rest } = stat;
            return (
              <StatCard
                key={stat.title}
                {...rest}
                delay={index * 0.1}
              />
            );
          })}
      </div>

      {/* Charts and Map Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DeviceMap />
        </div>
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
