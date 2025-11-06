import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  Monitor,
  UserCheck,
  Server,
} from 'lucide-react';

import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import Login from '../../pages/Login';
import Dashboard from '../../pages/dashboard/Dashboard';
import DeviceDashboard from '../../pages/device/DeviceDashboard';
import MQTTCommands from '../../pages/mqttcommands/MQTTCommands';
import ModbusTemplates from '../../pages/modbustemplates/ModbusTemplates';
import SettingsPage from '../../pages/Settings';
import Devices from '../../pages/devices/Devices';
import Manufacturers from '../../pages/manufacturers/Manufacturers';
import NotFound from '../../pages/NotFound';
import { createBrowserRouter } from 'react-router-dom';
import Mappings from '../../pages/mapping/mappings';
import UsersPage from '../../pages/users/Users';
  
// 1️⃣ Base config with both menu + component
const BASE_ITEMS = {
  dashboard: {
    path: '/',
    icon: LayoutDashboard,
    label: 'Dashboard',
    category: 'main',
    element: <Dashboard />,
  },
  devices: {
    path: '/devices',
    icon: Monitor,
    label: 'Devices',
    category: 'main',
    element: <Devices />,
  },
  deviceDetails: {
    path: '/devices/:deviceId',
    icon: Monitor,
    label: 'Device Details',
    hidden: true,
    category: 'main',
    element: <DeviceDashboard />,
  }, 
  users: {
    path: '/users',
    icon: UserCheck,
    label: 'Users',
    category: 'management',
    element: <UsersPage />,
  },
  manufacturers: {
    path: '/manufacturers',
    icon: Users,
    label: 'Manufacturers',
    category: 'management',
    element: <Manufacturers />,
  },
  manufacturerDevices: {
    path: '/manufacturer/:manufacturerId',
    icon: Users,
    label: 'Manufacturer Devices',
    hidden: true,
    category: 'management',
    element: <Devices />,
  },
  modbus: {
    path: '/templates',
    icon: FileText,
    label: 'Templates',
    category: 'main',
    element: <ModbusTemplates />,
  }, 
  mappings: {
    path: '/mappings',
    icon: FileText,
    label: 'Mappings',
    category: 'main',
    element: <Mappings />,
  },
  commands: {
    path: '/commands',
    icon: Server,
    label: 'Commands',
    category: 'main',
    element: <MQTTCommands />,
  },
  settings: {
    path: '/settings',
    icon: Settings,
    label: 'Settings',
    category: 'system',
    element: <SettingsPage />,
  },
  endUserDevices: {
    path: '/devices/:deviceId',
    icon: Monitor,
    hidden: true,
    label: 'Devices',
    category: 'main',
    element: <DeviceDashboard />,
  },
};

 const ROLE_ITEMS = {
  MACSOFT_ADMIN: [
    BASE_ITEMS.dashboard,
    BASE_ITEMS.devices,
    BASE_ITEMS.mappings,
    BASE_ITEMS.deviceDetails,
     BASE_ITEMS.manufacturers,
    BASE_ITEMS.manufacturerDevices,
    BASE_ITEMS.users,
    BASE_ITEMS.modbus,
    BASE_ITEMS.commands,
    BASE_ITEMS.settings,
  ],
  MACSOFT_USER: [
    BASE_ITEMS.dashboard,
    BASE_ITEMS.devices,
    BASE_ITEMS.mappings,
    BASE_ITEMS.deviceDetails,
    BASE_ITEMS.manufacturerDevices,
    BASE_ITEMS.modbus,
    BASE_ITEMS.commands,
    BASE_ITEMS.settings,
  ],
  CUSTOMER_ADMIN: [
    BASE_ITEMS.dashboard,
    BASE_ITEMS.devices,
    BASE_ITEMS.mappings,
    BASE_ITEMS.deviceDetails,
    BASE_ITEMS.users,
    BASE_ITEMS.modbus,
    BASE_ITEMS.commands,
    BASE_ITEMS.settings,
  ],
  CUSTOMER_USER: [
    BASE_ITEMS.dashboard,
    BASE_ITEMS.devices,
    BASE_ITEMS.mappings,
    BASE_ITEMS.deviceDetails,
    BASE_ITEMS.modbus,
    BASE_ITEMS.commands,
    BASE_ITEMS.settings,
  ],
  END_USER: [BASE_ITEMS.endUserDevices],
};

export const switchMenuItems = (role) => ROLE_ITEMS[role] || ROLE_ITEMS.END_USER;


export const switchRoutes = (role) =>
  createBrowserRouter([
    { path: '/login', element: <Login /> },
    {
      path: '/',
      errorElement: <NotFound />,
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: (ROLE_ITEMS[role] || ROLE_ITEMS.END_USER).map((item) => ({
        path: item.path === '/' ? '' : item.path.replace(/^\//, ''), 
        index: item.path === '/',
        element: <ProtectedRoute>{item.element}</ProtectedRoute>,
      })),
    },
  ]);
