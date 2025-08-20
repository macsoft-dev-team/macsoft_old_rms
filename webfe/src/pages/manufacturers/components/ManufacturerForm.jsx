import React, { useState, useEffect } from "react";
import Input from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

const ManufacturerForm = ({ initialData, onSubmit, loading }) => {
  const [form, setForm] = useState({
    name: "",
    username: "",
    ...initialData,
  });

  useEffect(() => {
    setForm({
      name: initialData?.name || "",
      username: initialData?.username || "",
    });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="name"
        name="name"
        label="Manufacturer Name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <Input
        id="username"
        name="username"
        label="Username"
        value={form.username}
        onChange={handleChange}
        required
      />
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
};

export default ManufacturerForm;
