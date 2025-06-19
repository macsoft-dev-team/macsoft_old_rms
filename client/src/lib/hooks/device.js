import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDevices,
  fetchDevice,
  clearSearchQuery,
  setSearchQuery,
  setDevice,
} from "../reducer/deviceSlice";

function useDevices() {
  const dispatch = useDispatch();
  const { devices, loading, error, currentPage, totalPages, searchQuery, device } =
    useSelector((state) => state.device);

  useEffect(() => {
    dispatch(
      fetchDevices({ page: currentPage, size: 10, filter: searchQuery })
    );
  }, [currentPage, searchQuery, dispatch]);

  const fetchDeviceById = React.useCallback(
    (id) => {
      dispatch(fetchDevice(id));
    },
    [dispatch]
  );
  const handleClear = () => {
    dispatch(clearSearchQuery());
  };
  const handleSearch = (data) => {
    dispatch(setSearchQuery(data.filter));
  };

  return {
    devices,
    device,
    searchQuery,
    loading,
    error,
    currentPage,
    totalPages,
    fetchDeviceById,
    handleClear,
    handleSearch,
  };
}

export default useDevices;
