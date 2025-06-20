import './App.css'
import LoginPage from './pages/LoginPage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import axios from 'axios';
import Layout from './components/Layout';
import Devices from './pages/Devices/Devices';
import DeviceLog from './pages/DeviceLog/DeviceLog';
import UploadModal from './pages/Devices/UploadModal';
import DeviceDashboard from './pages/DeviceDashboard/DeviceDashboard';
import ConfigurationRequest from './pages/ConfigurationRequest/ConfigurationRequest';
import Template from './pages/Template/Template';
import Faults from './pages/Faults/Faults';
import Customers from './pages/Customers/Customers';
import Dashboard from './pages/Dashboard/Dashboard';
  const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'devices',
        element: <Devices />,
      },
      {
        path: 'devices/upload',
        element: <UploadModal />,
      },
      {
        path: 'device/device-dashboard/:deviceId',
        element: <DeviceDashboard />,
      },
      {
        path: 'device/device-configuration/:deviceId/configuration-request',
        element: <ConfigurationRequest />,
      },
      {
        path: 'device-log',
        element: <DeviceLog />,
      },
      {
        path: 'templates',
        element: <Template />,
      }, 
      {
        path: 'faults',
        element: <Faults />,
      },
      {
        path: 'customers',
        element: <Customers />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      }
    ],
  },
]);

function App() {
  const authToken = sessionStorage.getItem("authToken");
  if (authToken) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
  axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  return (
    <RouterProvider router={router} />
  )
}

export default App
