import './App.css'
import LoginPage from './pages/LoginPage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import axios from 'axios';
import Layout from './components/Layout';
import Devices from './pages/Devices/Devices';
import DeviceLog from './pages/DeviceLog/DeviceLog';
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
        path: 'device-log',
        element: <DeviceLog />,
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
