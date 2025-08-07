// dashboard.js
// Dashboard constants for stats card configuration

export const DASHBOARD_STATS = [
  {
    key: 'totalDevices',
    title: 'Total Devices',
    icon: 'Zap',
    color: 'from-blue-500 to-blue-600',
    trend: { type: 'up', value: '+2.5%' }
  },
  {
    key: 'onlineDevices',
    title: 'Online Devices',
    icon: 'Activity',
    color: 'from-green-500 to-green-600',
    trend: { type: 'up', value: '+5.2%' }
  },
  {
    key: 'faultDevices',
    title: 'Fault Devices',
    icon: 'AlertTriangle',
    color: 'from-red-500 to-red-600',
    trend: { type: 'down', value: '-1.8%' }
  },
  {
    key: 'offlineDevices',
    title: 'Offline Devices',
    icon: 'WifiOff',
    color: 'from-gray-500 to-gray-600',
    trend: { type: 'down', value: '-3.2%' }
  },
  {
    key: 'activeManufacturers',
    title: 'Active Manufacturers',
    icon: 'Users',
    color: 'from-purple-500 to-purple-600',
    trend: { type: 'up', value: '+1' }
  },
  {
    key: 'todaysComplaints',
    title: "Today's Complaints",
    icon: 'TrendingUp',
    color: 'from-orange-500 to-orange-600',
    trend: { type: 'up', value: '+2' }
  }
];
