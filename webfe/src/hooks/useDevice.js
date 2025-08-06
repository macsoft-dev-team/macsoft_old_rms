import {
  fetchDevices,
  fetchDeviceById,
  setDevice,
  setFilter,
  uploadDevice,
} from "../lib/features/devices";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback } from "react";

export const useDevice = () => {
  const dispatch = useDispatch();
  const { devices, device,deviceId, currentPage, totalPages, filter, loading } =
    useSelector((state) => state.device);

  useEffect(() => {
    dispatch(fetchDevices({ skip: 0, take: 12, filter }));
  }, [dispatch, filter]);

  const onPageChange = useCallback(
    (skip) => {
      console.log("onPageChange", skip, filter);

      dispatch(fetchDevices({ skip, take: 12, filter }));
    },
    [dispatch, filter]
  );

  const setDeviceCallback = useCallback(
    (device) => dispatch(setDevice(device)),
    [dispatch]
  );
  const fetchDevicesCallback = useCallback(
    (params) => dispatch(fetchDevices(params)),
    [dispatch]
  );
  const fetchDeviceByIdCallback = useCallback(
    (id) => dispatch(fetchDeviceById(id)),
    [dispatch]
  );
  const setFilterCallback = useCallback(
    (filter) => dispatch(setFilter(filter)),
    [dispatch]
  );
  const uploadDeviceCallback = useCallback(
    (file) => dispatch(uploadDevice(file)),
    [dispatch]
  );

  return {
    devices,
    device,
    currentPage,
    totalPages,
    filter,
    loading,
    setDevice: setDeviceCallback,
    fetchDevices: fetchDevicesCallback,
    setFilter: setFilterCallback,
    onPageChange,
    uploadDevice: uploadDeviceCallback,
    fetchDeviceById: fetchDeviceByIdCallback,
  };
};
