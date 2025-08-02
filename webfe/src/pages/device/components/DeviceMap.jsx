

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
  const center = [latitude, longitude];
  const hasLocation = latitude !== undefined && longitude !== undefined;

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
              zoom={hasLocation ? 30 : 20}
              className="h-full w-full z-0"
              ref={mapRef}
              style={{ zIndex: 0 }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {hasLocation && (
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
              )}
            </MapContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DeviceMap;
