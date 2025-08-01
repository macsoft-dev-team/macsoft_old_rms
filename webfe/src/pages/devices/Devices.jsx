import TitleHead from '../../components/TitleHead';
import useAuth from '../../hooks/useAuth';
import { useDevice } from '../../hooks/useDevice';
import {
  DevicesHeader,
  DevicesFilters,
  DevicesBadge,
  DevicesGrid,
  DevicesEmpty
} from './components';

const Devices = () => {
    const { user } = useAuth();
    const { devices, setFilter } = useDevice();
    const safeDevices = Array.isArray(devices) ? devices : [];
    return (
        <div className="space-y-5">
            <TitleHead title="Device Management" description="Monitor and manage all solar pump devices">
                <DevicesHeader />
            </TitleHead>
            <DevicesFilters
                setFilter={setFilter}
                manufacturers={[]}
                user={user}
            />
            <DevicesBadge count={safeDevices.length} />
            {safeDevices.length > 0 ? (
                <DevicesGrid devices={safeDevices} />
            ) : (
                <DevicesEmpty />
            )}
        </div>
    );
};

export default Devices;
