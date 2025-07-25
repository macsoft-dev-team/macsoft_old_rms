import { useState } from 'react';
import ReusableTable from '../components/ui/reusableTable';
import TitleHead from '../components/TitleHead';
import { Button } from '../components/ui/button';
import { Save, Users2 } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import Input from '../components/ui/input';

// Dummy user data
const users = [
  {
    id: 1,
    username: 'john_doe',
    role: 'Admin',
    status: 'Active',
    password: 'password123',
    organisation: 'Org A',
  },
  {
    id: 2,
    username: 'jane_smith',
    role: 'User',
    status: 'Inactive',
    password: 'pass456',
    organisation: 'Org B',
  },
];

function Users() {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [newUser, setNewUser] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);

  const handleCreateUser = () => {
    // Logic to create a new user
    console.log('Creating user:', newUser);
    setIsCreating(false);
    setNewUser({
      username: '',
      role: '',
      status: '',
      password: '',
      organisation: '',
    });
  };

  const handleEditUser = () => {
    // Logic to update user
    console.log('Editing user:', selectedUser);
    setIsEditing(false);
    setSelectedUser(null);
  };

  const handleViewClose = () => {
    setIsViewing(false);
    setSelectedUser(null);
  };

  // Table columns config for ReusableTable
  const columns = [
    { key: 'username', label: 'Username', align: 'left' },
    { key: 'role', label: 'Role', align: 'left' },
    { key: 'status', label: 'Status', align: 'center' },
    { key: 'password', label: 'Password', align: 'center', render: () => '****' },
    { key: 'organisation', label: 'Organisation', align: 'left' },
  ];

  // Mask password for table data
  const tableData = users.map(u => ({ ...u, password: '****' }));

  return (
    <div className="space-y-6">
      <TitleHead title="User Management" description="Manage your application users here.">
        {/* Create User Dialog */}
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="text-base dark:bg-blue-900 dark:text-blue-100">
              <Users2 className="w-5 h-5 mr-2" />
              Create User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md dark:bg-black/10 dark:text-blue-100">
            <DialogHeader>
              <DialogTitle className="text-lg dark:text-blue-100">Create User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-base font-medium text-gray-700 dark:text-blue-100 mb-2 block">Username</label>
                  <Input
                    value={newUser.username}
                    onChange={e => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Enter username..."
                    className="dark:bg-gray-800 dark:text-blue-100 text-base"
                  />
                </div>
                <div>
                  <label className="text-base font-medium text-gray-700 dark:text-blue-100 mb-2 block">Organisation</label>
                  <Input
                    value={newUser.organisation}
                    onChange={e => setNewUser(prev => ({ ...prev, organisation: e.target.value }))}
                    placeholder="Enter organisation..."
                    className="dark:bg-gray-800 dark:text-blue-100 text-base"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-base font-medium text-gray-700 dark:text-blue-100 mb-2 block">Role</label>
                  <Input
                    value={newUser.role}
                    onChange={e => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                    placeholder="Enter role..."
                    className="dark:bg-gray-800 dark:text-blue-100 text-base"
                  />
                </div>
                <div>
                  <label className="text-base font-medium text-gray-700 dark:text-blue-100 mb-2 block">Status</label>
                  <Input
                    value={newUser.status}
                    onChange={e => setNewUser(prev => ({ ...prev, status: e.target.value }))}
                    placeholder="Active/Inactive"
                    className="dark:bg-gray-800 dark:text-blue-100 text-base"
                  />
                </div>
              </div>
              <div>
                <label className="text-base font-medium text-gray-700 dark:text-blue-100 mb-2 block">Password</label>
                <Input
                  type="password"
                  value={newUser.password}
                  onChange={e => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password..."
                  className="dark:bg-gray-800 dark:text-blue-100 text-base"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreating(false)} className="text-base dark:bg-gray-800 dark:text-blue-100">
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateUser}
                  disabled={!newUser.username || !newUser.password}
                  className="text-base dark:bg-blue-900 dark:text-blue-100"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Create User
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="max-w-md dark:bg-black/10 dark:text-blue-100">
            <DialogHeader>
              <DialogTitle className="text-lg dark:text-blue-100">Edit User</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-base font-medium text-gray-700 dark:text-blue-100 mb-2 block">Username</label>
                    <Input
                      value={selectedUser.username}
                      onChange={e => setSelectedUser(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="Enter username..."
                      className="dark:bg-gray-800 dark:text-blue-100 text-base"
                    />
                  </div>
                  <div>
                    <label className="text-base font-medium text-gray-700 dark:text-blue-100 mb-2 block">Organisation</label>
                    <Input
                      value={selectedUser.organisation}
                      onChange={e => setSelectedUser(prev => ({ ...prev, organisation: e.target.value }))}
                      placeholder="Enter organisation..."
                      className="dark:bg-gray-800 dark:text-blue-100 text-base"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-base font-medium text-gray-700 dark:text-blue-100 mb-2 block">Role</label>
                    <Input
                      value={selectedUser.role}
                      onChange={e => setSelectedUser(prev => ({ ...prev, role: e.target.value }))}
                      placeholder="Enter role..."
                      className="dark:bg-gray-800 dark:text-blue-100 text-base"
                    />
                  </div>
                  <div>
                    <label className="text-base font-medium text-gray-700 dark:text-blue-100 mb-2 block">Status</label>
                    <Input
                      value={selectedUser.status}
                      onChange={e => setSelectedUser(prev => ({ ...prev, status: e.target.value }))}
                      placeholder="Active/Inactive"
                      className="dark:bg-gray-800 dark:text-blue-100 text-base"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-base font-medium text-gray-700 dark:text-blue-100 mb-2 block">Password</label>
                  <Input
                    type="password"
                    value={selectedUser.password}
                    onChange={e => setSelectedUser(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter password..."
                    className="dark:bg-gray-800 dark:text-blue-100 text-base"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => { setIsEditing(false); setSelectedUser(null); }} className="text-base dark:bg-gray-800 dark:text-blue-100">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleEditUser}
                    disabled={!selectedUser.username || !selectedUser.password}
                    className="text-base dark:bg-blue-900 dark:text-blue-100"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* View User Dialog */}
        <Dialog open={isViewing} onOpenChange={setIsViewing}>
          <DialogContent className="max-w-md dark:bg-black/10 dark:text-blue-100">
            <DialogHeader>
              <DialogTitle className="text-lg dark:text-blue-100">View User</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-base font-medium text-gray-700 dark:text-blue-100 mb-2 block">Username</label>
                    <Input value={selectedUser.username} disabled className="dark:bg-gray-800 dark:text-blue-100 text-base" />
                  </div>
                  <div>
                    <label className="text-base font-medium text-gray-700 dark:text-blue-100 mb-2 block">Organisation</label>
                    <Input value={selectedUser.organisation} disabled className="dark:bg-gray-800 dark:text-blue-100 text-base" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-base font-medium text-gray-700 dark:text-blue-100 mb-2 block">Role</label>
                    <Input value={selectedUser.role} disabled className="dark:bg-gray-800 dark:text-blue-100 text-base" />
                  </div>
                  <div>
                    <label className="text-base font-medium text-gray-700 dark:text-blue-100 mb-2 block">Status</label>
                    <Input value={selectedUser.status} disabled className="dark:bg-gray-800 dark:text-blue-100 text-base" />
                  </div>
                </div>
                <div>
                  <label className="text-base font-medium text-gray-700 dark:text-blue-100 mb-2 block">Password</label>
                  <Input type="password" value={selectedUser.password} disabled className="dark:bg-gray-800 dark:text-blue-100 text-base" />
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
        headerColor="bg-gray-100 dark:bg-blue-900"
        headerTextColor="text-gray-700 dark:text-gray-200"
        size="sm"
        onEdit={row => { setSelectedUser({ ...row, password: users.find(u => u.id === row.id)?.password || '' }); setIsEditing(true); }}
        onView={row => { setSelectedUser({ ...row, password: users.find(u => u.id === row.id)?.password || '' }); setIsViewing(true); }}
        SNo={false}
        currentPage={1}
        pageSize={10}
        bordered
      />
    </div>
  );
}

export default Users;
