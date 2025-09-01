
import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { Button } from '../../components/ui/button';
import TitleHead from '../../components/TitleHead';
 import ManufacturerForm from './components/ManufacturerForm';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { useManufacturer } from '../../hooks/useManufacturer';
import { useDevice } from '../../hooks/useDevice';
import ReusableTable from '../../components/ui/reusableTable';


const Manufacturers = () => {
  const {
    manufacturers,
    manufacturer,
    mode,
    currentPage,
    totalPages,
    filter,
    onPageChange,
    setManufacturer,
    fetchManufacturers,
    updateManufacturer,
    loading,
    setMode
  } = useManufacturer();
  const { setFilter: setDeviceFilter } = useDevice();
  const [formLoading, setFormLoading] = useState(false);

  const handleAdd = () => {
    setMode({ create: true, edit: false, view: false, confirmDelete: false });
  };
  const handleEdit = (manufacturerObj) => {
    setManufacturer(manufacturerObj);
    setMode({ create: false, edit: true, view: false, confirmDelete: false });
  };

  const columns = [
    { key: 'name', label: 'Name', minWidth: 170 },
    { key: 'email', label: 'Email', minWidth: 100 },
    { key: 'userCount', label: 'No. of Users', minWidth: 80 },
    { key: 'deviceOnline', label: 'Online', minWidth: 60 },
    { key: 'deviceOffline', label: 'Offline', minWidth: 60 },
    { key: 'deviceFault', label: 'Fault', minWidth: 60 },
    { key: 'actions', label: 'Actions', minWidth: 160 },
  ];

  useEffect(() => {
    fetchManufacturers({ skip: currentPage, take: 10, filter });
  }, [filter]);

  const tableData = manufacturers.map((manufacturer) => {
    let online = 0, offline = 0, fault = 0;
    if (Array.isArray(manufacturer.devices)) {
      manufacturer.devices.forEach(device => {
        if (device.status === 1) online++;
        else if (device.status === 0) offline++;
        else if (device.status === 2) fault++;
      });
    }
    return {
      id: manufacturer.id,
      name: manufacturer.name,
      email: manufacturer.email,
      userCount: manufacturer.users ? manufacturer.users.length : 0,
      deviceOnline: online,
      deviceOffline: offline,
      deviceFault: fault,
      actions: manufacturer.id,
    };
  });

  const onOpenChange = (open) => {
    if (mode.edit) {
      setMode({ ...mode, edit: open });
      setManufacturer(null);
    } else if (mode.create) {
      setMode({ ...mode, create: open });
      setManufacturer(null);
    }
  };

  return (
    <div className="space-y-6">
      <Dialog open={(mode.edit || mode.create)} onOpenChange={onOpenChange}>
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
            loading={formLoading || loading}
           />
          <DialogFooter />
        </DialogContent>
      </Dialog> 
      <ReusableTable
        columns={columns}
        data={tableData}
        headerColor="bg-gray-100 dark:bg-blue-900 "
        headerTextColor="text-gray-700 dark:text-gray-200"
        size="sm"
        SNo={false}
        currentPage={currentPage}
        totalPages={totalPages}
        bordered
        onPageChange={onPageChange}
        renderCell={(col, row) => {
          if (col.key === 'actions') {
            return (
              <div className="flex gap-2">
                <Button
                  size="small"
                  variant="outline"
                  onClick={() => {
                    window.location.href = `/manufacturer/${row.id}`;
                  }}
                >
                  Users
                </Button>
                <Button
                  size="small"
                  variant="outline"
                  onClick={() => {
                    window.location.href = `/manufacturer/${row.id}`;
                  }}
                >
                  Devices
                </Button>
                <Button
                  size="small"
                  variant="ghost"
                  onClick={() => handleEdit(row)}
                >
                  Edit
                </Button>
              </div>
            );
          }
          return row[col.key];
        }}
      />
    </div>
  );
};

export default Manufacturers;
