import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Scan, Save, MapPin, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Input from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast.js';
import Select from '../components/ui/select';
import { mockManufacturers, mockTemplates, mockServerTemplates } from '../data/mockData';
import TitleHead from '../components/TitleHead.jsx';
import { Navigate, NavLink, useParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import { useManufacturer } from '../hooks/useManufacturer.js';
import useTemplate from '../hooks/useTemplate.js';

const CreateDevice = () => {
  const { toast } = useToast();
  const { manufacturerId } = useParams();
  const { user } = useAuth();
  const { manufacturer, fetchManufacturerById } = useManufacturer();
  const { templates, fetchTemplates } = useTemplate();
  const { register, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      imei: '',
      name: '',
      manufacturer: '',
      location: {
        lat: '',
        lng: '',
        address: ''
      },
      modbusTemplate: '',
      // serverTemplate removed
      mqttCredentials: {
        username: '',
        password: '',
        clientId: ''
      }
    }
  });
  const deviceForm = watch();

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
    setValue('mqttCredentials', credentials);
    toast({
      title: "Credentials Generated",
      description: "MQTT credentials have been generated successfully",
    });
  };

  const handleScanIMEI = () => {
    // Simulate scanning IMEI
    const simulatedIMEI = `862${Math.random().toString().slice(2, 14)}`;
    setValue('imei', simulatedIMEI);
    toast({
      title: "IMEI Scanned",
      description: `IMEI ${simulatedIMEI} captured successfully`,
    });
  };

  const onSubmit = (data) => {
    if (!data.imei || !data.name || !data.manufacturer) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Device Created",
      description: `Device ${data.name} has been created successfully`,
    });
    reset();
  };

  useEffect(() => {
    fetchManufacturerById(manufacturerId);
    fetchTemplates({ skip: 0, take: null, filter: {} });
  }, [manufacturerId]);

  if (!manufacturerId) return <Navigate to="/devices" replace />;

  return (
    <div className="space-y-6">
      <TitleHead title="Create Device" description="Add a new solar pump device to the system" />
 
      <form onSubmit={handleSubmit(onSubmit)}>
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
                  <label className="text-sm font-medium mb-2 block text-gray-900 dark:text-gray-100">
                    IMEI Number *
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      {...register('imei', { required: true })}
                      placeholder="Enter IMEI number..."
                      className="flex-1 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                    <Button variant="outline" onClick={handleScanIMEI}>
                      <Scan className="w-4 h-4 mr-2" />
                      Scan
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-900 dark:text-gray-100">
                    Device Name *
                  </label>
                  <Input
                    {...register('name', { required: true })}
                    placeholder="Enter device name..."
                    className="placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>
                {(user.role === "MACSOFT_ADMIN" || user.role === "MACSOFT_USER") && (
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-900 dark:text-gray-100">
                      Manufacturer *
                    </label>
                    <Input
                      {...register('manufacturer', { required: true })}
                      value={manufacturer?.name}
                      className={`${user.role === "MACSOFT_ADMIN" || user.role === "MACSOFT_USER" ? "unhidden" : "hidden"}`}
                      disabled
                    />
                  </div>
                )}
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-900 dark:text-gray-100">
                      Latitude
                    </label>
                    <Input
                      type="number"
                      {...register('location.lat')}
                      placeholder="28.6139"
                      className="placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-900 dark:text-gray-100">
                      Longitude
                    </label>
                    <Input
                      type="number"
                      {...register('location.lng')}
                      placeholder="77.2090"
                      className="placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-900 dark:text-gray-100">
                    Address
                  </label>
                  <Input
                    {...register('location.address')}
                    placeholder="Enter location address..."
                    className="placeholder:text-gray-400 dark:placeholder:text-gray-500"
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
                  <label className="text-sm font-medium mb-2 block text-gray-900 dark:text-gray-100">
                    Modbus Template
                  </label>
                  <Select
                    options={[{ value: '', label: 'Select Template' }, ...templates.map(t => ({ value: t.id, label: t.name }))]}
                    name={'modbusTemplate'}
                    value={deviceForm.modbusTemplate}
                    onChange={e => setValue('modbusTemplate', e.target.value)}
                    placeholder="All Status"
                    className="w-full dark:bg-gray-800 dark:text-white dark:border-gray-600"
                  />
                </div>

                {/* Server Template removed */}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center w-full justify-between">
                  <CardTitle>MQTT Credentials</CardTitle>
                  <Button variant="outline" size="sm" onClick={generateMQTTCredentials}>
                    Generate
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className='grid lg:grid-cols-2 gap-2'>
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-900 dark:text-gray-100">
                      Username
                    </label>
                    <Input
                      {...register('mqttCredentials.username')}
                      value={deviceForm.mqttCredentials.username}
                      placeholder="MQTT username..."
                      readOnly
                      className="placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-900 dark:text-gray-100">
                      Password
                    </label>
                    <Input
                      {...register('mqttCredentials.password')}
                      value={deviceForm.mqttCredentials.password}
                      placeholder="MQTT password..."
                      readOnly
                      className="placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-900 dark:text-gray-100">
                    Client ID
                  </label>
                  <Input
                    {...register('mqttCredentials.clientId')}
                    value={deviceForm.mqttCredentials.clientId}
                    placeholder="MQTT client ID..."
                    readOnly
                    className="placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>

                {deviceForm.mqttCredentials.username && (
                  <Badge className="bg-green-200 text-green-900 dark:bg-green-800 dark:text-green-100">
                    Credentials Generated
                  </Badge>
                )}
              </CardContent>
            </Card>
            <div className='flex items-center justify-end space-x-2 mt-4'>

              <Button type="submit" variant='success'>
                <Save className="w-4 h-4 mr-2" />
                Create Device
              </Button>
              <NavLink to="/devices">
                <Button variant='outline'   >
                  Cancel
                </Button>
              </NavLink>
            </div>

          </motion.div>
        </div>
      </form>
    </div>
  );
};

export default CreateDevice;
