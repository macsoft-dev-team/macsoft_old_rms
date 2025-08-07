import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback } from "react";
import {
  fetchDashboardStats,
  setLastUpdated,
} from "../lib/features/dashboard";

export const useDashboard = () => {
  const dispatch = useDispatch();
  const { dashboard, loading, error } = useSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    dispatch(fetchDashboardStats());
    
    const interval = setInterval(() => {
      dispatch(fetchDashboardStats());
      setLastUpdatedCallback(new Date().toISOString());
    }, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, [dispatch]);

  const fetchStats = useCallback(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const setLastUpdatedCallback = useCallback(
    (timestamp) => dispatch(setLastUpdated(timestamp)),
    [dispatch]
  );

  return {
    dashboard,
    loading,
    error,
    fetchStats,
  };
};
