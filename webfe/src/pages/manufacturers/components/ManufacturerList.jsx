import ManufacturerCard from './ManufacturerCard';


const ManufacturerList = ({ manufacturers, setDeviceFilter }) => {
  const safeManufacturers = Array.isArray(manufacturers) ? manufacturers : [];
    const getDeviceStatusCounts = (devices) => {
        return {
            online: devices.filter(d => d.status === 'ONLINE').length,
            offline: devices.filter(d => d.status === 'OFFLINE').length,
            fault: devices.filter(d => d.status === 'FAULT').length
        };
    };
    const handleDeviceFilter = (manufacturerId) => {
        setDeviceFilter({ manufacturer: manufacturerId });
    };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {safeManufacturers.map((manufacturer, index) => {
        // Ensure devices is always an array
        const devices = Array.isArray(manufacturer.devices) ? manufacturer.devices : [];
        const statusCounts = getDeviceStatusCounts(devices);
        return (
          <ManufacturerCard
            key={manufacturer.id}
            manufacturer={manufacturer}
            devices={devices.length}
            statusCounts={statusCounts}
            index={index}
                handleDeviceFilter={handleDeviceFilter}
          />
        );
      })}
    </div>
  );
};


export default ManufacturerList;
