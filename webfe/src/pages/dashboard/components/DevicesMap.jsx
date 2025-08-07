import React, { useRef } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import { motion } from 'framer-motion';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card.jsx';

// Fix leaflet default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const DevicesMap = ({ deviceLocations = [] }) => {
  const mapRef = useRef(null);

  const getLocationName = (lat, lng) => {
    // Simple location naming based on coordinates (you can enhance this with reverse geocoding)
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    if (latNum > 40 && lngNum < -70) return 'New York Area';
    if (latNum > 37 && lngNum < -120) return 'California Area';
    if (latNum > 41 && lngNum < -85) return 'Chicago Area';
    if (latNum > 29 && lngNum < -90) return 'Houston Area';
    if (latNum > 32 && lngNum < -95) return 'Dallas Area';
    if (latNum > 47 && lngNum < -120) return 'Seattle Area';
    if (latNum > 25 && lngNum < -80) return 'Miami Area';
    if (latNum > 39 && lngNum < -105) return 'Denver Area';
    if (latNum > 33 && lngNum < -110) return 'Phoenix Area';

    return 'Unknown Location';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'text-green-600';
      case 'offline':
        return 'text-yellow-500';
      case 'fault':
        return 'text-red-600';
      default:
        return 'text-yellow-500';
    }
  };
  const getStatusTextColor = (status) => {
    switch (status) {
      case 'online':
        return 'text-green-600';
      case 'offline':
        return 'text-yellow-500';
      case 'fault':
        return 'text-red-600';
      default:
        return 'text-yellow-500';
    }
  };

  const statusPointerIcon = L.divIcon({
    html: renderToStaticMarkup(
      <MapPin
        className={`${getStatusColor(status)}`}
        fill="#fff"
        width={32}
        height={32}
        strokeWidth={2}
      />
    ),
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  // Don't render the map if we don't have valid coordinates
  if (!deviceLocations.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="pb-10 h-full"
      >
        <Card className="h-full overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle>Device Locations</CardTitle>
          </CardHeader>
          <CardContent className="!p-0 h-full flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapPin className="mx-auto mb-2" size={48} />
              <p>Location data not available</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

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
          <div className="h-80 relative">
            <MapContainer
              center={[deviceLocations[0].lattitude, deviceLocations[0].longitude]}
              zoom={4}
              className="h-full w-full z-0"
              ref={mapRef}
              style={{ zIndex: 0 }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {deviceLocations.map((device, index) => {
                const position = [device.lattitude, device.longitude];
                return (
                  <Marker key={device.imeinumber} position={position} icon={statusPointerIcon}>
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-semibold text-lg">Device Location</h3>
                        <p className="text-sm">Lat: {position[0]}</p>
                        <p className="text-sm">Lng: {position[1]}</p>
                        <span
                          className={`text-xs font-semibold ${getStatusTextColor(
                            device.status
                          )}`}
                        >
                          Status: {device.status}
                        </span>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DevicesMap;
