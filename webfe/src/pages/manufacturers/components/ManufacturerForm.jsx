import { useForm } from "react-hook-form";
import Input from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { useEffect } from "react";
import { useManufacturer } from "../../../hooks/useManufacturer";


const ManufacturerForm = () => {

  const { manufacturer, updateManufacturer, createManufacturer, setMode, setManufacturer, loading } = useManufacturer();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: manufacturer?.email || "",
      name: manufacturer?.name || "",
    },
  });

  useEffect(() => {
    reset({
      email: manufacturer?.email || "",
      name: manufacturer?.name || "",
    });
  }, [manufacturer, reset]);

  const submitForm = (data) => {
    console.log(data);

    if (manufacturer?.id) {
      updateManufacturer(data);
    } else {
      createManufacturer(data);
     }
  };
  const onCancel = () => {
    setMode({ create: false, edit: false, view: false, confirmDelete: false });
    setManufacturer(null);
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-4 pt-2">
      <Input
        id="email"
        label="Email"
        {...register("email", { required: "Email is required" })}
        error={errors.email?.message}
      />
      <Input
        id="name"
        label="Manufacturer Name"
        {...register("name")}
        error={errors.name?.message}
      />
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ManufacturerForm;
