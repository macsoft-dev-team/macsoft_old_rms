import { useEffect, useState } from 'react';
import TitleHead from '../../components/TitleHead';
import { Button } from '../../components/ui/button';
import { AlertTriangle, Download, RefreshCw } from 'lucide-react';
import ReusableTable from '../../components/ui/reusableTable';
import { useDevice } from '../../hooks/useDevice';
import useAuth from '../../hooks/useAuth';
import { useManufacturer } from '../../hooks/useManufacturer';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import Input from '../../components/ui/input';

export default function FaultyDevices() {
  const { devices, device, setDevice, currentPage, totalPages, filter, setFilter, fetchDevices, loading } = useDevice();
  const { manufacturers, fetchManufacturers } = useManufacturer();
  const { user } = useAuth();
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showDeviceModal, setShowDeviceModal] = useState(false);

  // Filter devices to show only faulty ones
  const faultyDevices = devices.filter(device => 
    device.status === 'FAULT' || 
    device.status === 'ERROR' || 
    device.status === 'OFFLINE' ||
    device.isActive === false
  );

  const handleRefresh = () => {
    fetchDevices({ skip: 0, take: 50, filter: { ...filter, status: 'FAULT,ERROR,OFFLINE' } });
  };

  const handleViewDevice = (device) => {
    setSelectedDevice(device);
    setShowDeviceModal(true);
  };

  const handleExportFaultyDevices = () => {
    // Create CSV data
    const csvHeaders = ['Device Name', 'IMEI', 'Status', 'Manufacturer', 'Location', 'Last Seen'];
    const csvData = faultyDevices.map(device => [
      device.devicename || 'N/A',
      device.imeinumber || 'N/A',
      device.status || 'N/A',
      device.manufacturer || 'N/A',
      `${device.latitude || 'N/A'}, ${device.longitude || 'N/A'}`,
      device.updatedAt ? new Date(device.updatedAt).toLocaleString() : 'N/A'
    ]);

    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `faulty-devices-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    { key: 'devicename', label: 'Device Name', align: 'left' },
    { key: 'imeinumber', label: 'IMEI', align: 'left' },
    { key: 'status', label: 'Status', align: 'center' },
    { key: 'manufacturer', label: 'Manufacturer', align: 'left' },
    { key: 'location', label: 'Location', align: 'left' },
    { key: 'lastSeen', label: 'Last Seen', align: 'left' },
  ];

  const tableData = faultyDevices.map(device => ({
    ...device,
    status: (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        device.status === 'FAULT' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
        device.status === 'ERROR' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
        device.status === 'OFFLINE' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' :
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      }`}>
        <AlertTriangle className="w-3 h-3 mr-1" />
        {device.status || 'INACTIVE'}
      </div>
    ),
    location: device.latitude && device.longitude 
      ? `${parseFloat(device.latitude).toFixed(4)}, ${parseFloat(device.longitude).toFixed(4)}`
      : 'N/A',
    lastSeen: device.updatedAt 
      ? new Date(device.updatedAt).toLocaleString()
      : 'N/A'
  }));

  useEffect(() => {
    // Fetch devices with filter for faulty devices
    fetchDevices({ skip: 0, take: 50, filter: { ...filter } });
    fetchManufacturers({ skip: 0, take: 100 });
  }, [fetchDevices, fetchManufacturers]);

  const onPageChange = (page) => {
    fetchDevices({ skip: page, take: 50, filter });
  };

  return (
    <div className="space-y-6">
      <TitleHead 
        title="Faulty Devices" 
        description="Monitor and manage devices with issues, faults, or offline status."
      >
        <div className='flex items-center gap-2'>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
            className="text-base"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
         {/*  <Button
            variant="success"
            onClick={handleExportFaultyDevices}
            disabled={faultyDevices.length === 0}
            className="text-base"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button> */}
        </div>
      </TitleHead>

      {/* Summary Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-800 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {faultyDevices.length} Faulty Device{faultyDevices.length !== 1 ? 's' : ''}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Devices requiring attention
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {faultyDevices.length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              of {devices.length} total
            </div>
          </div>
        </div>
      </div>

      {/* Devices Table */}
      {faultyDevices.length > 0 ? (
        <ReusableTable
          columns={columns}
          data={tableData}
          headerColor="bg-red-50 dark:bg-red-900/20"
          headerTextColor="text-red-700 dark:text-red-300"
          size="sm"
          onView={handleViewDevice}
          SNo={true}
          currentPage={currentPage}
          totalPages={totalPages}
          bordered
          onPageChange={onPageChange}
        />
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
          <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Faulty Devices Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            All devices are currently functioning normally. Great job!
          </p>
        </div>
      )}

      {/* Device Details Modal */}
      <Dialog open={showDeviceModal} onOpenChange={setShowDeviceModal}>
        <DialogContent className="max-w-2xl dark:bg-black/10 dark:text-blue-100">
          <DialogHeader>
            <DialogTitle className="text-lg dark:text-blue-100 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
              Device Details
            </DialogTitle>
          </DialogHeader>
          {selectedDevice && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-blue-100 mb-2 block">
                    Device Name
                  </label>
                  <Input 
                    value={selectedDevice.devicename || 'N/A'} 
                    disabled 
                    className="dark:bg-gray-800 dark:text-blue-100" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-blue-100 mb-2 block">
                    IMEI Number
                  </label>
                  <Input 
                    value={selectedDevice.imeinumber || 'N/A'} 
                    disabled 
                    className="dark:bg-gray-800 dark:text-blue-100" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-blue-100 mb-2 block">
                    Status
                  </label>
                  <Input 
                    value={selectedDevice.status || 'N/A'} 
                    disabled 
                    className="dark:bg-gray-800 dark:text-blue-100" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-blue-100 mb-2 block">
                    Manufacturer
                  </label>
                  <Input 
                    value={selectedDevice.manufacturer || 'N/A'} 
                    disabled 
                    className="dark:bg-gray-800 dark:text-blue-100" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-blue-100 mb-2 block">
                    Location (Lat, Long)
                  </label>
                  <Input 
                    value={selectedDevice.latitude && selectedDevice.longitude 
                      ? `${selectedDevice.latitude}, ${selectedDevice.longitude}`
                      : 'N/A'
                    } 
                    disabled 
                    className="dark:bg-gray-800 dark:text-blue-100" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-blue-100 mb-2 block">
                    Last Updated
                  </label>
                  <Input 
                    value={selectedDevice.updatedAt 
                      ? new Date(selectedDevice.updatedAt).toLocaleString()
                      : 'N/A'
                    } 
                    disabled 
                    className="dark:bg-gray-800 dark:text-blue-100" 
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDeviceModal(false)}
                  className="dark:bg-gray-800 dark:text-blue-100"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}