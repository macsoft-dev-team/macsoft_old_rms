

import { useRef } from 'react';
import { MapPin } from 'lucide-react';
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






const DeviceMap = ({ latitude = 11.0395392, longitude = 76.9818624, status = 'online' }) => {
  const mapRef = useRef(null);
  
  // Ensure we have valid numeric coordinates
  const validLatitude = typeof latitude === 'number' && !isNaN(latitude) ? latitude : 11.0395392;
  const validLongitude = typeof longitude === 'number' && !isNaN(longitude) ? longitude : 76.9818624;
  
  const center = [validLatitude, validLongitude];
  const hasLocation = typeof latitude === 'number' && !isNaN(latitude) && 
                     typeof longitude === 'number' && !isNaN(longitude);

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'text-green-600';
      case 'offline': return 'text-yellow-500';
      case 'fault': return 'text-red-600';
      default: return 'text-yellow-500';
    }
  };
  const getStatusTextColor = (status) => {
    switch (status) {
      case 'online': return 'text-green-600';
      case 'offline': return 'text-yellow-500';
      case 'fault': return 'text-red-600';
      default: return 'text-yellow-500';
    }
  };

  const statusPointerIcon = L.divIcon({
    html: renderToStaticMarkup(
      <MapPin className={`${getStatusColor(status)}`} fill="#fff" width={32} height={32} strokeWidth={2} />
    ),
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  // Don't render the map if we don't have valid coordinates
  if (!hasLocation || !center || center.some(coord => coord === null || coord === undefined || isNaN(coord))) {
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
              center={center}
              zoom={15}
              className="h-full w-full z-0"
              ref={mapRef}
              style={{ zIndex: 0 }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker
                position={center}
                icon={statusPointerIcon}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold text-lg">Device Location</h3>
                    <p className="text-sm">Lat: {center[0]}</p>
                    <p className="text-sm">Lng: {center[1]}</p>
                    <span className={`text-xs font-semibold ${getStatusTextColor(status)}`}>Status: {status}</span>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DeviceMap;
