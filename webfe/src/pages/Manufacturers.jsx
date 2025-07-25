import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import { Building2, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { _mockManufacturers, mockDevices } from '../data/mockData';
import TitleHead from '../components/TitleHead';

const Manufacturers = () => {
  const navigate = useNavigate();
  
  const getManufacturerDevices = (manufacturerName) => {
    return mockDevices.filter(device => device.manufacturer === manufacturerName);
  };

  const getDeviceStatusCounts = (devices) => {
    return {
      online: devices.filter(d => d.status === 'online').length,
      offline: devices.filter(d => d.status === 'offline').length,
      fault: devices.filter(d => d.status === 'fault').length
    };
  };

  return (
    <div className="space-y-6">
      <TitleHead title="Manufacturers" description="Manage pump manufacturer access and devices">
        <Button>
          <Users className="w-4 h-4 mr-2" />
          Add Manufacturer
        </Button>
      </TitleHead>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {_mockManufacturers.map((manufacturer, index) => {
          const devices = getManufacturerDevices(manufacturer.name);
          const statusCounts = getDeviceStatusCounts(devices);
          
          return (
            <motion.div
              key={manufacturer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      className="p-2 rounded-full bg-white bg-opacity-20"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Building2 className="w-6 h-6" />
                    </motion.div>
                    <div>
                      <CardTitle className="text-lg">{manufacturer.name}</CardTitle>
                      <p className="text-blue-100 text-sm">@{manufacturer.username}</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Total Devices</span>
                      <Badge variant="outline" className="font-semibold">
                        {devices.length}
                      </Badge>
                    </div>

                    {devices.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 flex items-center"><Wifi className="w-4 h-4 text-green-500 mr-1" /> Online</span>
                          <span className="font-medium">{statusCounts.online}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 flex items-center"><WifiOff className="w-4 h-4 text-gray-500 mr-1" /> Offline</span>
                          <span className="font-medium">{statusCounts.offline}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 flex items-center"><AlertCircle className="w-4 h-4 text-red-500 mr-1" /> Fault</span>
                          <span className="font-medium">{statusCounts.fault}</span>
                        </div>
                      </div>
                    )}

                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Associated Devices</h4>
                      {devices.length > 0 ? (
                        <div className="space-y-1">
                          {devices.slice(0, 3).map(device => (
                            <div key={device.id} className="text-sm text-gray-600">
                              {device.name} ({device.id})
                            </div>
                          ))}
                          {devices.length > 3 && (
                            <p className="text-xs text-gray-500">
                              +{devices.length - 3} more devices
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No devices assigned</p>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        className="flex-1 group-hover:bg-blue-50 transition-colors"
                        onClick={() => navigate('/devices')}
                      >
                        <Building2 className="w-4 h-4 mr-2" />
                        View Devices
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Manufacturers;
