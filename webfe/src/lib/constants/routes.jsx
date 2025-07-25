import { createBrowserRouter } from 'react-router-dom';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import Login from '../../pages/Login';
import Dashboard from '../../pages/Dashboard';
import Devices from '../../pages/Devices';
import DeviceDashboard from '../../pages/DeviceDashboard';
import CreateDevice from '../../pages/CreateDevice';
import MQTTCommands from '../../pages/MQTTCommands';
import ModbusTemplates from '../../pages/ModbusTemplates';
import ServerTemplates from '../../pages/ServerTemplates';
import Manufacturers from '../../pages/Manufacturers';
import Settings from '../../pages/Settings';
import Users from '../../pages/Users';

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
