
import {
  fetchManufacturers,
  fetchManufacturerById,
  createManufacturer,
  updateManufacturer,
  deleteManufacturer,
  uploadManufacturer,
  setManufacturer,
  setFilter,
  setMode,
} from "../lib/features/manufacturers";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback } from "react";

export const useManufacturer = () => {
  const dispatch = useDispatch();
  const {
    manufacturers,
    manufacturer,
    currentPage,
    totalPages,
    filter,
    mode,
    loading,
  } = useSelector((state) => state.manufacturer);

  const onPageChange = useCallback(
    (skip) => {
      dispatch(fetchManufacturers({ skip, take: 10, filter }));
    },
    [dispatch, filter]
  );

  const setManufacturerCallback = useCallback(
    (manufacturer) => dispatch(setManufacturer(manufacturer)),
    [dispatch]
  );

  const fetchManufacturersCallback = useCallback(
    (params) => dispatch(fetchManufacturers(params)),
    [dispatch]
  );

  const fetchManufacturerByIdCallback = useCallback(
    (id) => dispatch(fetchManufacturerById(id)),
    [dispatch]
  );

  const updateManufacturerCallback = useCallback(
    (payload) => dispatch(updateManufacturer({ manufacturerId: manufacturer.id, data: payload })),
    [dispatch]
  );

  const deleteManufacturerCallback = useCallback(
    (id) => dispatch(deleteManufacturer(id)),
    [dispatch]
  );

  const uploadManufacturerCallback = useCallback(
    (formData) => dispatch(uploadManufacturer(formData)),
    [dispatch]
  );

  const setFilterCallback = useCallback(
    (filter) => dispatch(setFilter(filter)),
    [dispatch]
  );

  const setModeCallback = useCallback(
    (mode) => dispatch(setMode(mode)),
    [dispatch]
  );
  const createManufacturerCallback = useCallback(
    (data) => dispatch(createManufacturer(data)),
    [dispatch]
  );
  return {
    manufacturers,
    manufacturer,
    currentPage,
    totalPages,
    filter,
    loading,
    mode,
    setManufacturer: setManufacturerCallback,
    fetchManufacturers: fetchManufacturersCallback,
    fetchManufacturerById: fetchManufacturerByIdCallback,
    updateManufacturer: updateManufacturerCallback,
    deleteManufacturer: deleteManufacturerCallback,
    uploadManufacturer: uploadManufacturerCallback,
    createManufacturer: createManufacturerCallback,
    setFilter: setFilterCallback,
    onPageChange,
    setMode: setModeCallback,
  };
};
