import { useState } from 'react';
import TitleHead from '../../components/TitleHead';
import { Button } from '../../components/ui/button';
import { Save, Users2 } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import Input from '../../components/ui/input';
import useUser from '../../hooks/useUser';
import { useEffect } from 'react';
import ReusableTable from '../../components/ui/reusableTable';

import UserFormDialog from './components/UserFormDialog';

// Dummy user data


export default function Users() {
  const { users, user, setUser, currentPage, totalPages, filter, mode, setMode, getUsers, onPageChange } = useUser();
  const [newUser, setNewUser] = useState({});


  const handleCreateUser = () => {
    // Logic to create a new user
    console.log('Creating user:', newUser);
    setMode({ ...mode, create: false });
    setNewUser({
      name: '',
      role: '',
      isActive: '',
      password: '',
      customerId: '',
    });
  };

  const handleEditUser = () => {
    console.log('Editing user:', user);
    setMode({ ...mode, edit: false });
    setUser(null);
  };

  const handleViewClose = () => {
    setMode({ ...mode, view: false });
    setUser(null);
  };

  // Table columns config for ReusableTable
  const columns = [
    { key: 'name', label: 'Name', align: 'left' },
    { key: 'role', label: 'Role', align: 'left' },
    { key: 'status', label: 'Status', align: 'center' },
    { key: 'password', label: 'Password', align: 'center', render: () => '****' },
    { key: 'organisation', label: 'Organisation', align: 'left' },
  ];

  // Mask password for table data
  const tableData = users.map(u => ({ ...u, password: '****', status: u.isActive ? <div className='text-green-500'>Active</div> : <div className='text-red-500'>Inactive</div> }));


  useEffect(() => {
    getUsers({ skip: currentPage, take: 10, filter: filter });
  }, [getUsers, filter]);

  return (
    <div className="space-y-6">
      <TitleHead title="User Management" description="Manage your application users here.">
        <Button
          className="text-base dark:bg-blue-900 dark:text-blue-100"
          onClick={() => setMode({ ...mode, create: true })}
        >
          <Users2 className="w-5 h-5 mr-2" />
          Create User
        </Button>
        <UserFormDialog
          open={mode.create}
          onOpenChange={open => setMode({ ...mode, create: open })}
          user={user}
          setUser={setUser}
          newUser={newUser}
          setNewUser={setNewUser}
          mode="create"
          onSubmit={handleCreateUser}
          onCancel={() => setMode({ ...mode, create: false })}
        />
        <UserFormDialog
          open={mode.edit}
          onOpenChange={open => setMode({ ...mode, edit: open })}
          user={user}
          setUser={setUser}
          newUser={newUser}
          setNewUser={setNewUser}
          mode="edit"
          onSubmit={handleEditUser}
          onCancel={() => { setMode({ ...mode, edit: false }); setUser(null); }}
        />

        {/* View User Dialog */}
        <Dialog open={mode.view} onOpenChange={open => setMode({ ...mode, view: open })}>
          <DialogContent className="max-w-md dark:bg-black/10 dark:text-blue-100">
            <DialogHeader>
              <DialogTitle className="text-lg dark:text-blue-100">View User</DialogTitle>
            </DialogHeader>
            {user && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-base font-medium text-gray-700 dark:text-blue-100 mb-2 block">name</label>
                    <Input value={user.name} disabled className="dark:bg-gray-800 dark:text-blue-100 text-base" />
                  </div>
                  <div>
                    <label className="text-base font-medium text-gray-700 dark:text-blue-100 mb-2 block">Organisation</label>
                    <Input value={user.organisation} disabled className="dark:bg-gray-800 dark:text-blue-100 text-base" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-base font-medium text-gray-700 dark:text-blue-100 mb-2 block">Role</label>
                    <Input value={user.role} disabled className="dark:bg-gray-800 dark:text-blue-100 text-base" />
                  </div>
                  <div>
                    <label className="text-base font-medium text-gray-700 dark:text-blue-100 mb-2 block">isActive</label>
                    <Input value={user.isActive ? "Active" : "Inactive"} disabled className="dark:bg-gray-800 dark:text-blue-100 text-base" />
                  </div>
                </div>
                <div>
                  <label className="text-base font-medium text-gray-700 dark:text-blue-100 mb-2 block">Password</label>
                  <Input type="password" value={user.password} disabled className="dark:bg-gray-800 dark:text-blue-100 text-base" />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={handleViewClose} className="text-base dark:bg-gray-800 dark:text-blue-100">
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </TitleHead>
      <ReusableTable
        columns={columns}
        data={tableData}
        headerColor="bg-gray-100 dark:bg-blue-900 "
        headerTextColor="text-gray-700 dark:text-gray-200"
        size="sm"
        onEdit={row => { setUser({ ...row, status: undefined, password: users.find(u => u.id === row.id)?.password || '' }); setMode({ ...mode, edit: true }); }}
        onView={row => { setUser({ ...row, status: undefined, password: users.find(u => u.id === row.id)?.password || '' }); setMode({ ...mode, view: true }); }}
        SNo={false}
        currentPage={currentPage}
        pageSize={totalPages}
        bordered
        onPageChange={onPageChange}
      />
    </div>
  );
}


