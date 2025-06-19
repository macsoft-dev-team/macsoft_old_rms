import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDeviceLogs,
  clearSearchQuery,
  setSearchQuery,
} from "../reducer/deviceLogSlice";

function useDeviceLogs() {
  const dispatch = useDispatch();
  const { deviceLogs, loading, error, currentPage, totalPages, searchQuery } =
    useSelector((state) => state.deviceLog);

  useEffect(() => {
    dispatch(
      fetchDeviceLogs({ page: currentPage, take: 10, filter: searchQuery })
    );
  }, [currentPage, searchQuery, dispatch]);

  const handleClear = () => {
    dispatch(clearSearchQuery());
  };
  const handleSearch = (data) => {
    dispatch(setSearchQuery(data.filter));
  };

  return {
    deviceLogs,
    searchQuery,
    loading,
    error,
    currentPage,
    totalPages,
    handleClear,
    handleSearch,
  };
}

export default useDeviceLogs;
