import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DevicesList from './pages/DevicesList';
import DeviceDetail from './pages/DeviceDetail';
import HistoricalData from './pages/HistoricalData';
import ConfigTemplates from './pages/ConfigTemplates';
import SendCommand from './pages/SendCommand';
import Alerts from './pages/Alerts';
import UserProfile from './pages/UserProfile';

function PrivateRoute({ children }) {
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/devices" element={<PrivateRoute><DevicesList /></PrivateRoute>} />
      <Route path="/devices/:id" element={<PrivateRoute><DeviceDetail /></PrivateRoute>} />
      <Route path="/historical" element={<PrivateRoute><HistoricalData /></PrivateRoute>} />
      <Route path="/templates" element={<PrivateRoute><ConfigTemplates /></PrivateRoute>} />
      <Route path="/send-command" element={<PrivateRoute><SendCommand /></PrivateRoute>} />
      <Route path="/alerts" element={<PrivateRoute><Alerts /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
