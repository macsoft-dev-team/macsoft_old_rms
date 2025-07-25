 

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.jsx';
import { mockDevices } from '../../data/mockData.js';

// Fix leaflet default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different device statuses
const createStatusIcon = (status) => {
  const colors = {
    online: '#10b981',
    offline: '#6b7280',
    fault: '#ef4444'
  };
  
  return L.divIcon({
    html: `
      <div style="
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: ${colors[status]};
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        animation: pulse 2s infinite;
      "></div>
      <style>
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
      </style>
    `,
    className: '',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10]
  });
};

const DeviceMap = () => {
  const mapRef = useRef(null);
  
  // Center of India for initial view
  const center = [20.5937, 78.9629];

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'text-green-600';
      case 'offline': return 'text-gray-600';
      case 'fault': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
      className="pb-10"
    >
      <Card className="h-96 overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle>Device Locations</CardTitle>
        </CardHeader>
        <CardContent className="!p-0 h-full">
          <div className="h-80">
            <MapContainer
              center={center}
              zoom={5}
              className="h-full w-full"
              ref={mapRef}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {mockDevices.map((device) => (
                device.location && typeof device.location.lat === 'number' && typeof device.location.lng === 'number' ? (
                  <Marker
                    key={device.id}
                    position={[device.location.lat, device.location.lng]}
                    icon={createStatusIcon(device.status)}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-semibold text-lg">{device.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{device.location.address}</p>
                        <div className="space-y-1">
                          <p className={`text-sm font-medium ${getStatusColor(device.status)}`}>
                            Status: {device.status.toUpperCase()}
                          </p>
                          <p className="text-sm">IMEI: {device.imei}</p>
                          <p className="text-sm">Manufacturer: {device.manufacturer}</p>
                          {device.status === 'online' && (
                            <div className="mt-2 text-xs">
                              <p>Motor Voltage: {device.data.outputMotorVoltage}V</p>
                              <p>Motor Current: {device.data.outputMotorCurrent}A</p>
                              <p>Temperature: {device.data.temperature}°C</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ) : null
              ))}
            </MapContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DeviceMap;
