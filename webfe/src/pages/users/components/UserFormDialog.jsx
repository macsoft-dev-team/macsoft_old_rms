import { useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import Input from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Save } from 'lucide-react';
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
}) {
  const { user, mode, setUser, updateUser, createUser } = useUser();
  const { user: loginUser } = useAuth();
  const { manufacturers = [] } = useManufacturer();
  const isEdit = mode.edit;
  const formUser = isEdit ? user : {};

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: formUser?.name ?? '',
      email: formUser?.email ?? '',
      // keep as string for stable Select matching
      customerId: formUser?.customerId != null ? String(formUser.customerId) : '',
      role: formUser?.role ?? '',
      // store '', 'true', 'false' -> convert on submit
      isActive:
        formUser?.isActive === true ? 'true'
          : formUser?.isActive === false ? 'false'
            : '',
      password: formUser?.password ?? '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: formUser?.name ?? '',
        email: formUser?.email ?? '',
        customerId: formUser?.customerId != null ? String(formUser.customerId) : '',
        role: formUser?.role ?? '',
        isActive:
          formUser?.isActive === true ? 'true'
            : formUser?.isActive === false ? 'false'
              : '',
        password: formUser?.password ?? '',
      });
    }
  }, [open, reset]);

  const internalSubmit = (data) => {
    const next = {
      ...data,
      customerId: data.customerId ? Number(data.customerId) : null,
      isActive:
        data.isActive === 'true' ? true
          : data.isActive === 'false' ? false
            : null,
    };

    if (isEdit) {
      next.id = user?.id
      updateUser(next);
    } else {
      setUser((prev) => ({ ...prev, ...next }));
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
    ],
    []
  );

  const customerRoleOptions = useMemo(
    () => [
      { value: 'CUSTOMER_ADMIN', label: 'Admin' },
      { value: 'CUSTOMER_USER', label: 'User' },
    ],
    []
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md dark:bg-black/10 dark:text-blue-100">
        <DialogHeader>
          <DialogTitle className="text-lg dark:text-blue-100">
            {isEdit ? 'Edit User' : 'Create User'}
          </DialogTitle>
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
                    className="dark:bg-gray-800 dark:text-blue-100 text-base"
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
                    className="dark:bg-gray-800 dark:text-blue-100 text-base"
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
                      value={field.value}                          // '' or '123'
                      onChange={(e) => field.onChange(e?.target ? e.target.value : e)}
                      onBlur={field.onBlur}
                      placeholder="All Manufacturers"
                      className="w-full dark:bg-gray-800 dark:text-white dark:border-gray-600"
                      disablePortal                                  // avoids dialog stacking issues
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
                      className="w-full dark:bg-gray-800 dark:text-white dark:border-gray-600"
                      disablePortal
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
                    className="w-full dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    disablePortal
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
                    value={field.value}                              // '', 'true', 'false'
                    onChange={(e) => field.onChange(e?.target ? e.target.value : e)}
                    onBlur={field.onBlur}
                    placeholder="Select Status"
                    className="w-full dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    disablePortal
                  />
                )}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-base font-medium text-gray-700 dark:text-blue-100 mb-2 block">
              Password
            </label>
            <Controller
              name="password"
              control={control}
              rules={{ required: 'Password is required' }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="password"
                  autoComplete="new-password"
                  placeholder="Enter password..."
                  className="dark:bg-gray-800 dark:text-blue-100 text-base"
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
              disabled={!!Object.keys(errors).length}
              className="text-base dark:bg-blue-900 dark:text-blue-100"
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
