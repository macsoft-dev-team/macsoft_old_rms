import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import DeviceMap from './components/DeviceMap';
import ChatInterface from './components/ChatInterface';
import { useDevice } from '../../hooks/useDevice';
import { useEffect } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import DeviceHeader from './components/DeviceHeader';
import AlertBanner from './components/AlertBanner';
import MetricsGrid from './components/MetricsGrid';
import HistoricalChart from './components/HistoricalChart';
import CommandButtons from './components/CommandButtons';
import DeviceConnectionInfo from './components/DeviceConnectionInfo';
import DeviceLog from './components/DeviceLog';
const DeviceDashboard = () => {
  const { deviceId } = useParams();
  const { device ,fetchDeviceById ,loading} = useDevice();

 
  const navigate = useNavigate();
  useEffect(() => {
    console.log("Fetching device by ID:", deviceId);
    
    if (deviceId) {
      fetchDeviceById(deviceId);
    }
  }, [deviceId, fetchDeviceById]);


  if (!device && !loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400">Device not found</p>
      </div>
    );
  }
  if (!device && loading) {
    return <LoadingSpinner/>
  }

  const hasAlerts = (device.data?.alarmCode ?? 0) !== 0 || (device.data?.faultCode ?? 0) !== 0;
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
       <DeviceHeader device={device} statusConfig={statusConfig} navigate={navigate} />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="logs">Device Log</TabsTrigger>
          <TabsTrigger value="commands">Commands</TabsTrigger>
          <TabsTrigger value="connection">Connection</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
           <AlertBanner faultCode={device.data?.faultCode ?? 0} alarmCode={device.data?.alarmCode ?? 0} />

           <MetricsGrid device={device} />

           <HistoricalChart history={device.history} />

           <DeviceMap 
            status={device.status}
            latitude={device.lattitude}
            longitude={device.longitude}
          />
        </TabsContent>

        <TabsContent value="logs">
          <DeviceLog deviceId={deviceId} />
        </TabsContent>

        <TabsContent value="commands">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CommandButtons deviceName={device.name} />
            <div>
              <ChatInterface
                deviceId={device.id}
                deviceName={device.name}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="connection">
          <DeviceConnectionInfo device={device} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeviceDashboard;
