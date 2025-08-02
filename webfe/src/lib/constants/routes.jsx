import { createBrowserRouter } from 'react-router-dom';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import Login from '../../pages/Login';
import Dashboard from '../../pages/Dashboard';
import DeviceDashboard from '../../pages/device/DeviceDashboard';
import CreateDevice from '../../pages/CreateDevice';
import MQTTCommands from '../../pages/MQTTCommands';
import ModbusTemplates from '../../pages/ModbusTemplates';
import ServerTemplates from '../../pages/ServerTemplates';
import Settings from '../../pages/Settings';
import Users from '../../pages/Users';
import Devices from '../../pages/devices/Devices';
import Manufacturers from '../../pages/manufacturers/Manufacturers';
import NotFound from '../../pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        path: '/',
        element: <Dashboard />
      },
      {
        path: 'devices',
        element: (
          <ProtectedRoute >
            <Devices />
          </ProtectedRoute>
        )
      },
      {
        path: 'devices/:deviceId',
        element: (
          <ProtectedRoute >
            <DeviceDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: 'devices/create',
        element: (
          <ProtectedRoute>
            <CreateDevice />
          </ProtectedRoute>
        )
      },
      {
        path: 'commands',
        element: (
          <ProtectedRoute>
            <MQTTCommands />
          </ProtectedRoute>
        )
      },
      {
        path: 'templates/modbus',
        element: (
          <ProtectedRoute>
            <ModbusTemplates />
          </ProtectedRoute>
        )
      },
      {
        path: 'templates/server',
        element: (
          <ProtectedRoute >
            <ServerTemplates />
          </ProtectedRoute>
        )
      },
      {
        path: 'manufacturers',
        element: (
          <ProtectedRoute >
            <Manufacturers />
          </ProtectedRoute>
        )
      },
      {
        path: 'users',
        element: (
          <ProtectedRoute >
            <Users />
          </ProtectedRoute>
        )
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute >
            <Settings />
          </ProtectedRoute>
        )
      }
    ]
  }
]);
 
const baseRoutes = [
  { index: true, path: '/', element: <Dashboard /> },
  { path: 'devices', element: <Devices /> },
  { path: 'devices/:deviceId', element: <DeviceDashboard /> },
  { path: 'devices/create', element: <CreateDevice /> },
  { path: 'commands', element: <MQTTCommands /> },
  { path: 'templates/modbus', element: <ModbusTemplates /> },
  { path: 'templates/server', element: <ServerTemplates /> },
  { path: 'settings', element: <Settings /> },
];


const roleBasedRoutes = {
  MACSOFT_ADMIN: [
    { path: 'manufacturers', element: <Manufacturers /> },
    { path: 'manufacturer/:manufacturerId', element: <Devices /> },
    { path: 'users', element: <Users /> },
  ],
  MACSOFT_USER: [],
  CUSTOMER_ADMIN: [{ path: 'users', element: <Users /> }],
  CUSTOMER_USER: [],
  END_USER: [
    { path: 'devices/:deviceId', element: <DeviceDashboard /> },
  ],
};



export const switchRoutes = (role) => {
 
  return createBrowserRouter([
    { path: '/login', element: <Login /> },
    {
      path: '/',
       errorElement: <NotFound />,
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        ...baseRoutes,
        ...(roleBasedRoutes[role] || []),
        
      ],
    },
  ]);
}; 