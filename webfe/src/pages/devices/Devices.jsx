import { useParams } from 'react-router-dom';
import TitleHead from '../../components/TitleHead';
import useAuth from '../../hooks/useAuth';
import { useDevice } from '../../hooks/useDevice';
import { useManufacturer } from '../../hooks/useManufacturer';
import {
    DevicesHeader,
    DevicesFilters,
    DevicesBadge,
    DevicesGrid,
    DevicesEmpty
} from './components';
import { useEffect } from 'react';

const Devices = () => {
    const { manufacturerId } = useParams();
    const { user } = useAuth();
    const { devices, loading, filter, setFilter, setDevice, fetchDeviceById, uploadDevice, fetchDevices } = useDevice();
    const { manufacturers } = useManufacturer();
    const safeDevices = Array.isArray(devices) ? devices : [];
    const safeManufacturers = Array.isArray(manufacturers) ? manufacturers : [];
    useEffect(() => {
        fetchDevices({ skip: 0, take: 12, filter: filter });
    }, [fetchDevices, filter]);
    useEffect(() => {
        if (manufacturerId) {
            setFilter({ manufacturer: manufacturerId });
        }
        return () => {
            setFilter({ manufacturer: '' });
        };
    }, [manufacturerId, setFilter]);
    return (
        <div className="space-y-5">
            <TitleHead title="Device Management" description="Monitor and manage all solar pump devices">
                <DevicesHeader uploadDevice={uploadDevice} loading={loading} manufacturerId={manufacturerId} user={user} />
            </TitleHead>
            <DevicesFilters
                setFilter={setFilter}
                manufacturers={safeManufacturers}
                user={user}
            />
            <DevicesBadge count={safeDevices.length} />
            {safeDevices.length > 0 ? (
                <DevicesGrid devices={safeDevices} setDevice={setDevice} fetchDeviceById={fetchDeviceById} />
            ) : (
                <DevicesEmpty />
            )}
        </div>
    );
};

export default Devices;
