import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { _mockManufacturers, mockDevices } from '../../data/mockData';
import TitleHead from '../../components/TitleHead';
import ManufacturerList from './components/ManufacturerList';
import { useManufacturer } from '../../hooks/useManufacturer';
import { useDevice } from '../../hooks/useDevice';

const Manufacturers = () => {
  const { manufacturers } = useManufacturer();
  const { setFilter: setDeviceFilter } = useDevice();

  return (
    <div className="space-y-6">
      <TitleHead title="Manufacturers" description="Manage pump manufacturer access and devices">
        <Button>
          <Users className="w-4 h-4 mr-2" />
          Add Manufacturer
        </Button>
      </TitleHead>
      <ManufacturerList
        manufacturers={manufacturers}
        setDeviceFilter={setDeviceFilter}
       />
    </div>
  );
};

export default Manufacturers;
