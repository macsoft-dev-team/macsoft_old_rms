import { Zap, WifiOff, AlertTriangle, Users, TrendingUp, Activity } from 'lucide-react';
import DashboardHeader from './components/DashboardHeader';
import StatsGrid from './components/StatsGrid';
import ChartsAndMapSection from './components/ChartsAndMapSection';
import DevicesMap from './components/DevicesMap';
import RecentActivity from './components/RecentActivity';
import { DASHBOARD_STATS } from '../../lib/constants/dashboard';
import { useDashboard } from '../../hooks/useDashboard';
 
const Dashboard = () => {
  const { dashboard } = useDashboard();
  
  // Calculate trends based on current data
  const calculateTrends = (dashboard) => {
    const total = dashboard?.totalDevices || 0;
    const online = dashboard?.onlineDevices || 0;
    const fault = dashboard?.faultDevices || 0;
    const offline = dashboard?.offlineDevices || 0;
    
    const onlinePercentage = total > 0 ? ((online / total) * 100).toFixed(1) : 0;
    const faultPercentage = total > 0 ? ((fault / total) * 100).toFixed(1) : 0;
    
    return {
      totalDevices: { type: 'up', value: `+${total}` },
      onlineDevices: { type: online > fault ? 'up' : 'down', value: `${onlinePercentage}%` },
      faultDevices: { type: fault === 0 ? 'down' : 'up', value: `${faultPercentage}%` },
      offlineDevices: { type: offline === 0 ? 'down' : 'up', value: `${offline}` },
      activeManufacturers: { type: 'up', value: `+${dashboard?.activeManufacturers || 0}` },
      todaysComplaints: { type: dashboard?.todaysComplaints === 0 ? 'down' : 'up', value: `${dashboard?.todaysComplaints || 0}` }
    };
  };

  const trends = calculateTrends(dashboard);
  
   const iconMap = {
    Zap,
    Activity,
    AlertTriangle,
    WifiOff,
    Users,
    TrendingUp,
  };

 
  const stats = DASHBOARD_STATS.map((stat) => ({
    ...stat,
    value: dashboard?.[stat.key] || 0,
    icon: iconMap[stat.icon],
    trend: trends[stat.key] || stat.trend,
  }));

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      <DashboardHeader lastUpdated={dashboard?.lastUpdated} />
      <StatsGrid stats={stats} />
      <ChartsAndMapSection 
        deviceLocations={dashboard?.deviceLocations} 
        recentActivity={dashboard?.recentActivity}
        lastUpdated={dashboard?.lastUpdated}
      />
     </div>
  );
};

export default Dashboard;
