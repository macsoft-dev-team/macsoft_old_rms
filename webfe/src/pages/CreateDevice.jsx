import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scan, Save, MapPin, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import  Input  from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast.js';
import  Select from '../components/ui/select';
import { mockManufacturers, mockTemplates, mockServerTemplates } from '../data/mockData';
import TitleHead from '../components/TitleHead.jsx';

const CreateDevice = () => {
  const { toast } = useToast();
  const [deviceForm, setDeviceForm] = useState({
    imei: '',
    name: '',
    manufacturer: '',
    location: {
      lat: '',
      lng: '',
      address: ''
    },
    modbusTemplate: '',
    serverTemplate: '',
    mqttCredentials: {
      username: '',
      password: '',
      clientId: ''
    }
  });

  const generateMQTTCredentials = () => {
    if (!deviceForm.imei) {
      toast({
        title: "IMEI Required",
        description: "Please enter IMEI first to generate credentials",
        variant: "destructive",
      });
      return;
    }

    const credentials = {
      username: `pump_${deviceForm.imei}`,
      password: Math.random().toString(36).substring(2, 15),
      clientId: `client_${deviceForm.imei}`
    };

    setDeviceForm(prev => ({
      ...prev,
      mqttCredentials: credentials
    }));

    toast({
      title: "Credentials Generated",
      description: "MQTT credentials have been generated successfully",
    });
  };

  const handleScanIMEI = () => {
    // Simulate scanning IMEI
    const simulatedIMEI = `862${Math.random().toString().slice(2, 14)}`;
    setDeviceForm(prev => ({
      ...prev,
      imei: simulatedIMEI
    }));
    
    toast({
      title: "IMEI Scanned",
      description: `IMEI ${simulatedIMEI} captured successfully`,
    });
  };

  const handleCreateDevice = () => {
    if (!deviceForm.imei || !deviceForm.name || !deviceForm.manufacturer) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Simulate device creation
    toast({
      title: "Device Created",
      description: `Device ${deviceForm.name} has been created successfully`,
    });

    // Reset form
    setDeviceForm({
      imei: '',
      name: '',
      manufacturer: '',
      location: { lat: '', lng: '', address: '' },
      modbusTemplate: '',
      serverTemplate: '',
      mqttCredentials: { username: '', password: '', clientId: '' }
    });
  };

  return (
    <div className="space-y-6">
<TitleHead title="Create Device" description="Add a new solar pump device to the system">
  </TitleHead>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Device Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  IMEI Number *
                </label>
                <div className="flex space-x-2">
                  <Input
                    value={deviceForm.imei}
                    onChange={(e) => setDeviceForm(prev => ({ ...prev, imei: e.target.value }))}
                    placeholder="Enter IMEI number..."
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={handleScanIMEI}>
                    <Scan className="w-4 h-4 mr-2" />
                    Scan
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Device Name *
                </label>
                <Input
                  value={deviceForm.name}
                  onChange={(e) => setDeviceForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter device name..."
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Manufacturer *
                </label>
                <Select
                  value={deviceForm.manufacturer}
                  onChange={e => setDeviceForm(prev => ({ ...prev, manufacturer: e.target.value }))}
                >
                  <option value="" disabled>Select manufacturer...</option>
                  {mockManufacturers.map(manufacturer => (
                    <option key={manufacturer.id} value={manufacturer.name}>
                      {manufacturer.name}
                    </option>
                  ))}
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Location</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Latitude
                  </label>
                  <Input
                    type="number"
                    value={deviceForm.location.lat}
                    onChange={(e) => setDeviceForm(prev => ({ 
                      ...prev, 
                      location: { ...prev.location, lat: e.target.value }
                    }))}
                    placeholder="28.6139"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Longitude
                  </label>
                  <Input
                    type="number"
                    value={deviceForm.location.lng}
                    onChange={(e) => setDeviceForm(prev => ({ 
                      ...prev, 
                      location: { ...prev.location, lng: e.target.value }
                    }))}
                    placeholder="77.2090"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Address
                </label>
                <Input
                  value={deviceForm.location.address}
                  onChange={(e) => setDeviceForm(prev => ({ 
                    ...prev, 
                    location: { ...prev.location, address: e.target.value }
                  }))}
                  placeholder="Enter location address..."
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Configuration & Credentials */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Templates Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Modbus Template
                </label>
                <Select
                  value={deviceForm.modbusTemplate}
                  onChange={e => setDeviceForm(prev => ({ ...prev, modbusTemplate: e.target.value }))}
                >
                  <option value="" disabled>Select modbus template...</option>
                  {mockTemplates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name} ({template.driveCode})
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Server Template
                </label>
                <Select
                  value={deviceForm.serverTemplate}
                  onChange={e => setDeviceForm(prev => ({ ...prev, serverTemplate: e.target.value }))}
                >
                  <option value="" disabled>Select server template...</option>
                  {mockServerTemplates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>MQTT Credentials</CardTitle>
                <Button variant="outline" size="sm" onClick={generateMQTTCredentials}>
                  Generate
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Username
                </label>
                <Input
                  value={deviceForm.mqttCredentials.username}
                  onChange={(e) => setDeviceForm(prev => ({ 
                    ...prev, 
                    mqttCredentials: { ...prev.mqttCredentials, username: e.target.value }
                  }))}
                  placeholder="MQTT username..."
                  readOnly
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Password
                </label>
                <Input
                  value={deviceForm.mqttCredentials.password}
                  onChange={(e) => setDeviceForm(prev => ({ 
                    ...prev, 
                    mqttCredentials: { ...prev.mqttCredentials, password: e.target.value }
                  }))}
                  placeholder="MQTT password..."
                  readOnly
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Client ID
                </label>
                <Input
                  value={deviceForm.mqttCredentials.clientId}
                  onChange={(e) => setDeviceForm(prev => ({ 
                    ...prev, 
                    mqttCredentials: { ...prev.mqttCredentials, clientId: e.target.value }
                  }))}
                  placeholder="MQTT client ID..."
                  readOnly
                />
              </div>

              {deviceForm.mqttCredentials.username && (
                <Badge className="bg-green-100 text-green-800">
                  Credentials Generated
                </Badge>
              )}
            </CardContent>
          </Card>

          <Button onClick={handleCreateDevice} className="w-full h-12">
            <Save className="w-4 h-4 mr-2" />
            Create Device
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateDevice;
