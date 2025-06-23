import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDeviceLogs,
  clearSearchQuery,
  setSearchQuery,
} from "../reducer/deviceLogSlice";

function useDeviceLogs({ fromDate, toDate, page } = {}) {
  const dispatch = useDispatch();
  const { deviceLogs, loading, error, currentPage, totalPages, searchQuery } =
    useSelector((state) => state.deviceLog);

  useEffect(() => {
    dispatch(
      fetchDeviceLogs({
        skip: page || currentPage || 1,
        take: 10,
        filter: {
          text: searchQuery,
          startDate: fromDate,
          endDate: toDate,
        },
      })
    );
  }, [page, currentPage, searchQuery, fromDate, toDate, dispatch]);

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
