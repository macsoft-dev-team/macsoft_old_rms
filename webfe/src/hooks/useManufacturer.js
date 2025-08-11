import {
  fetchManufacturers,
  setManufacturer,
  setFilter,
  fetchManufacturerById,
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
    loading,
  } = useSelector((state) => state.manufacturer);

  useEffect(() => {
    dispatch(fetchManufacturers({ skip: 0, take: 10, filter }));
  }, [dispatch, filter]);

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
  const setFilterCallback = useCallback(
    (filter) => dispatch(setFilter(filter)),
    [dispatch]
  );

  const fetchManufacturerByIdCallback = useCallback(
    (id) => dispatch(fetchManufacturerById(id)),
    [dispatch]
  );

  return {
    manufacturers,
    manufacturer,
    currentPage,
    totalPages,
    filter,
    loading,
    setManufacturer: setManufacturerCallback,
    fetchManufacturers: fetchManufacturersCallback,
    fetchManufacturerById: fetchManufacturerByIdCallback,
    setFilter: setFilterCallback,
    onPageChange,
  };
};
