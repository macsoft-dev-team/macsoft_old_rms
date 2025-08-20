
import { useState } from 'react';
import { Users } from 'lucide-react';
import { Button } from '../../components/ui/button';
import TitleHead from '../../components/TitleHead';
import ManufacturerList from './components/ManufacturerList';
import ManufacturerForm from './components/ManufacturerForm';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { useManufacturer } from '../../hooks/useManufacturer';
import { useDevice } from '../../hooks/useDevice';



const Manufacturers = () => {
  const {
    manufacturers,
    manufacturer,
    mode,
    setManufacturer,
    fetchManufacturers,
    updateManufacturer,
    loading,
    setMode
  } = useManufacturer();
  const { setFilter: setDeviceFilter } = useDevice();
  const [formLoading, setFormLoading] = useState(false);

  // Handler for opening the modal for create
  const handleAdd = () => {
    setManufacturer(null);
    setMode('create');
  };

  // Handler for opening the modal for edit
  const handleEdit = (manufacturerObj) => {
    setManufacturer(manufacturerObj);
    setMode('edit');
  };

  // Handler for form submit (create or update)
  const handleSubmit = async (data) => {
    setFormLoading(true);
    try {
      if (mode.edit && manufacturer && manufacturer.id) {
        await updateManufacturer({ manufacturerId: manufacturer.id, data });
      } else if (mode.create) {
        // Uncomment and implement createManufacturer in the slice/hook if needed
        // await createManufacturer(data);
      }
      setMode(''); // Reset all modes
      fetchManufacturers({ skip: 0, take: 10 });
    } finally {
      setFormLoading(false);
    }
  };
  

  return (
    <div className="space-y-6">
      <Dialog open={(mode.edit || mode.create)} onOpenChange={() => setMode('')}>
        <TitleHead title="Manufacturers" description="Manage pump manufacturer access and devices">
          <DialogTrigger asChild>
            <Button onClick={handleAdd}>
              <Users className="w-4 h-4 mr-2" />
              Add Manufacturer
            </Button>
          </DialogTrigger>
        </TitleHead>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{mode.edit ? 'Edit Manufacturer' : 'Add Manufacturer'}</DialogTitle>
          </DialogHeader>
          <ManufacturerForm
            initialData={mode.edit ? manufacturer : null}
            onSubmit={handleSubmit}
            loading={formLoading || loading}
          />
          <DialogFooter />
        </DialogContent>
      </Dialog>
      <ManufacturerList
        manufacturers={manufacturers}
        setDeviceFilter={setDeviceFilter}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default Manufacturers;
