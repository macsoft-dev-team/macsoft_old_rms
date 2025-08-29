import {
  fetchDevices,
  fetchDeviceById,
  setDevice,
  setFilter,
  uploadDevice,
  fetchDeviceLogs,
  setDeviceLogFilters
} from "../lib/features/devices";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback } from "react";

export const useDevice = () => {
  const dispatch = useDispatch();
  const { devices, device, deviceId, deviceLog, currentPage, totalPages, filter, loading } =
    useSelector((state) => state.device);
  

  const onPageChange = useCallback(
    (skip) => {
      dispatch(fetchDevices({ skip, take: 12, filter }));
    },
    [dispatch, filter]
  );

  const onDeviceLogPageChange = useCallback(
    (skip) => {
      if (device && device.imeinumber) {
        dispatch(fetchDeviceLogs({skip, take: 10, imeinumber: device.imeinumber}));
      }
    },
    [dispatch, device]
  );

  const fetchDeviceLogsCallback = useCallback(
    (params) => dispatch(fetchDeviceLogs(params)),
    [dispatch]
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
  
  const setDeviceLogFiltersCallback = useCallback(
    (filters) => dispatch(setDeviceLogFilters(filters)),
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
    deviceLog,
    currentPage,
    totalPages,
    filter,
    loading,
    setDevice: setDeviceCallback,
    fetchDevices: fetchDevicesCallback,
    fetchDeviceLogs: fetchDeviceLogsCallback,
    setFilter: setFilterCallback,
    setDeviceLogFilters: setDeviceLogFiltersCallback,
    onPageChange,
    onDeviceLogPageChange,
    uploadDevice: uploadDeviceCallback,
    fetchDeviceById: fetchDeviceByIdCallback,
  };
};
