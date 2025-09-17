import { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import Input from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Save, Edit, Lock } from 'lucide-react';
import useUser from '../../../hooks/useUser';
import Select from '../../../components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
import { useManufacturer } from '../../../hooks/useManufacturer';

export default function UserFormDialog({
  open,
  onOpenChange,
  onSubmit,
  onCancel,
  mode: dialogMode,
}) {
  const { user, setUser, updateUser, createUser } = useUser();
  const { user: loginUser } = useAuth();
  const { manufacturers = [], fetchManufacturers } = useManufacturer();
  const isEdit = dialogMode === 'edit';
  const formUser = isEdit ? user : null;
  
  const isEndUser = formUser?.role === 'END_USER';
  
  const canEditEndUser = isEndUser && formUser?.customerId === loginUser?.customerId;
  
  const shouldDisableForm = isEdit && isEndUser && !canEditEndUser;
  
  const [isPasswordEditable, setIsPasswordEditable] = useState(!isEdit);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      customerId: '',
      role: '',
      isActive: '',
      password: '',
    },
  });

  useEffect(() => {
    if (open) {
      setIsPasswordEditable(!isEdit);
      
      if (isEdit && formUser) {
        reset({
          name: formUser.name ?? '',
          email: formUser.email ?? '',
          customerId: formUser.customerId != null ? String(formUser.customerId) : '',
          role: formUser.role ?? '',
          isActive:
            formUser.isActive === true ? 'true'
              : formUser.isActive === false ? 'false'
                : '',
          password: '',
        });
      } else {
        reset({
          name: '',
          email: '',
          customerId: '',
          role: '',
          isActive: '',
          password: '',
        });
      }
    }
  }, [open, reset, formUser, isEdit]);

  const internalSubmit = (data) => {
    const next = {
      ...data,
      customerId: data.customerId || null,
      isActive:
        data.isActive === 'true' ? true
          : data.isActive === 'false' ? false
            : null,
    };

    if (loginUser?.role === 'CUSTOMER_ADMIN' || loginUser?.role === 'CUSTOMER_USER') {
      next.customerId = loginUser.customerId;
    }

    if (isEdit && (!isPasswordEditable || !data.password.trim())) {
      delete next.password;
    }

    if (isEdit) {
      next.id = user?.id
      updateUser(next);
    } else {
      setUser(next);
      createUser(next);
    }

    onSubmit && onSubmit();
  };

  const manufacturerOptions = useMemo(
    () => [
      { value: '', label: 'Select Manufacturer' },
      ...manufacturers.map((m) => ({ value: String(m.id), label: m.name })),
    ],
    [manufacturers]
  );

  const macsoftRoleOptions = useMemo(
    () => [
      { value: 'MACSOFT_ADMIN', label: 'Macsoft Admin' },
      { value: 'MACSOFT_USER', label: 'Macsoft User' },
      { value: 'CUSTOMER_ADMIN', label: 'Customer Admin' },
      { value: 'CUSTOMER_USER', label: 'Customer User' },
      { value: 'END_USER', label: 'End User' },
    ],
    []
  );

  const customerRoleOptions = useMemo(
    () => [
      { value: 'CUSTOMER_ADMIN', label: 'Admin' },
      { value: 'CUSTOMER_USER', label: 'User' },
      { value: 'END_USER', label: 'End User' },
    ],
    []
  );

  useEffect(() => {
    if ((loginUser?.role === 'MACSOFT_ADMIN' || loginUser?.role === 'MACSOFT_USER') && open) {
      fetchManufacturers({ skip: 0, take: 1000, filter: '' });
    }
  }, [loginUser, fetchManufacturers, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md dark:bg-black/10 dark:text-blue-100">
        <DialogHeader>
          <DialogTitle className="text-lg dark:text-blue-100">
            {isEdit ? 'Edit User' : 'Create User'}
          </DialogTitle>
          {isEdit && isEndUser && !canEditEndUser && (
            <div className="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-400 dark:border-yellow-600 text-yellow-800 dark:text-yellow-200 px-3 py-2 rounded mt-2">
              <p className="text-sm font-medium">⚠️ END_USER role cannot be edited</p>
              <p className="text-xs">This user type is protected and cannot be modified.</p>
            </div>
          )}
          {isEdit && isEndUser && canEditEndUser && (
            <div className="bg-green-100 dark:bg-green-900/20 border border-green-400 dark:border-green-600 text-green-800 dark:text-green-200 px-3 py-2 rounded mt-2">
              <p className="text-sm font-medium">✓ END_USER editing allowed</p>
              <p className="text-xs">You can edit this user because they belong to your organization.</p>
            </div>
          )}
        </DialogHeader>

        <form autoComplete="off" className="space-y-4" onSubmit={handleSubmit(internalSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="text-base font-medium text-gray-700 dark:text-blue-100 mb-2 block">
                Name
              </label>
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Name is required' }}
                render={({ field }) => (
                  <Input
                    {...field}
                    autoComplete="off"
                    placeholder="Enter name..."
                    disabled={shouldDisableForm}
                    className="dark:bg-gray-800 dark:text-blue-100 text-base disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                )}
              />
              {errors.name && (
                <span className="text-red-500 text-xs">{errors.name.message}</span>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-base font-medium text-gray-700 dark:text-blue-100 mb-2 block">
                Email
              </label>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email address',
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    autoComplete="off"
                    placeholder="Enter email..."
                    disabled={shouldDisableForm}
                    className="dark:bg-gray-800 dark:text-blue-100 text-base disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                )}
              />
              {errors.email && (
                <span className="text-red-500 text-xs">{errors.email.message}</span>
              )}
            </div>

            {/* Manufacturer (customerId) */}
            {(loginUser?.role === 'MACSOFT_ADMIN' || loginUser?.role === 'MACSOFT_USER') && (
              <div>
                <label className="text-base font-medium text-gray-700 dark:text-blue-100 mb-2 block">
                  Manufacturer
                </label>
                <Controller
                  name="customerId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={manufacturerOptions}
                      name={field.name}
                      value={field.value}                           
                      onChange={(e) => field.onChange(e?.target ? e.target.value : e)}
                      onBlur={field.onBlur}
                      placeholder="All Manufacturers"
                      disabled={shouldDisableForm}
                      className="w-full dark:bg-gray-800 dark:text-white dark:border-gray-600 disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  )}
                />
              </div>
            )}
            {(loginUser?.role === 'MACSOFT_ADMIN') ? (


              <div>
                <label className="text-base font-medium text-gray-700 dark:text-blue-100 mb-2 block">
                  Role
                </label>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={macsoftRoleOptions}
                      name={field.name}
                      value={field.value}
                      onChange={(e) => field.onChange(e?.target ? e.target.value : e)}
                      onBlur={field.onBlur}
                      placeholder="Select Role"
                      disabled={shouldDisableForm}
                      className="w-full dark:bg-gray-800 dark:text-white dark:border-gray-600 disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  )}
                />
              </div>) : <div>
              <label className="text-base font-medium text-gray-700 dark:text-blue-100 mb-2 block">
                Role
              </label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select
                    options={customerRoleOptions}
                    name={field.name}
                    value={field.value}
                    onChange={(e) => field.onChange(e?.target ? e.target.value : e)}
                    onBlur={field.onBlur}
                    placeholder="Select Role"
                    disabled={shouldDisableForm}
                    className="w-full dark:bg-gray-800 dark:text-white dark:border-gray-600 disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                )}
              />
            </div>}


            {/* Status */}
            <div>
              <label className="text-base font-medium text-gray-700 dark:text-blue-100 mb-2 block">
                Status
              </label>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <Select
                    options={[
                      { value: '', label: 'Select Status' },
                      { value: 'true', label: 'Active' },
                      { value: 'false', label: 'Inactive' },
                    ]}
                    name={field.name}
                    value={field.value}
                    onChange={(e) => field.onChange(e?.target ? e.target.value : e)}
                    onBlur={field.onBlur}
                    placeholder="Select Status"
                    disabled={shouldDisableForm}
                    className="w-full dark:bg-gray-800 dark:text-white dark:border-gray-600 disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                )}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-base font-medium text-gray-700 dark:text-blue-100">
                Password
              </label>
              {isEdit && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPasswordEditable(!isPasswordEditable)}
                  disabled={shouldDisableForm}
                  className="text-xs dark:bg-gray-800 dark:text-blue-100 dark:border-gray-600 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isPasswordEditable ? (
                    <>
                      <Lock className="w-3 h-3 mr-1" />
                      Keep Current
                    </>
                  ) : (
                    <>
                      <Edit className="w-3 h-3 mr-1" />
                      Change Password
                    </>
                  )}
                </Button>
              )}
            </div>
            <Controller
              name="password"
              control={control}
              rules={{ 
                required: !isEdit ? 'Password is required' : (isPasswordEditable ? 'Password is required when changing' : false)
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="password"
                  autoComplete="new-password"
                  placeholder={isEdit && !isPasswordEditable ? "Password unchanged" : "Enter password..."}
                  disabled={(isEdit && !isPasswordEditable) || shouldDisableForm}
                  className="dark:bg-gray-800 dark:text-blue-100 text-base disabled:opacity-60 disabled:cursor-not-allowed"
                />
              )}
            />
            {errors.password && (
              <span className="text-red-500 text-xs">{errors.password.message}</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              type="button"
              onClick={onCancel}
              className="text-base dark:bg-gray-800 dark:text-blue-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!!Object.keys(errors).length || shouldDisableForm}
              className="text-base dark:bg-blue-900 dark:text-blue-100 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5 mr-2" />
              {isEdit ? 'Save Changes' : 'Create User'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
