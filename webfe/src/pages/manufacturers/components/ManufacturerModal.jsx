import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import ManufacturerForm from "./ManufacturerForm";

const ManufacturerModal = ({ triggerLabel = "Add Manufacturer", initialData, onSubmit, loading, children }) => {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(initialData || null);

  // Open for create
  const handleOpen = () => {
    setEditData(null);
    setOpen(true);
  };

  // Open for edit
  const handleEdit = (data) => {
    setEditData(data);
    setOpen(true);
  };

  // Pass this to children for edit action
  const childProps = { onEdit: handleEdit };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={handleOpen}>{triggerLabel}</Button>
      </DialogTrigger>
      {children && React.cloneElement(children, childProps)}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Manufacturer" : "Add Manufacturer"}</DialogTitle>
        </DialogHeader>
        <ManufacturerForm
          initialData={editData}
          onSubmit={(data) => {
            onSubmit(data, editData);
            setOpen(false);
          }}
          loading={loading}
        />
        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
};

export default ManufacturerModal;
