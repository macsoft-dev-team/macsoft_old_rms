import {
  fetchMappings,
  setFilter,
  uploadMapping,
  setMapping,
  setMode
} from "../lib/features/mappings";
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";

export const useMapping = () => {
  const dispatch = useDispatch();
  const {
    mappings,
    mode,
    mapping,
    mappingId,
    currentPage,
    totalPages,
    filter,
    loading,
  } = useSelector((state) => state.mapping);

  const onPageChange = useCallback(
    (skip) => {
      dispatch(fetchMappings({ skip, take: 12, filter }));
    },
    [dispatch, filter]
  );

  const fetchMappingCallback = useCallback(
    (params) => dispatch(fetchMappings(params)),
    [dispatch]
  );

  const setFilterCallback = useCallback(
    (filter) => dispatch(setFilter(filter)),
    [dispatch]
  );

  const uploadMappingCallback = useCallback(
    (file) => dispatch(uploadMapping(file)),
    [dispatch]
  );

  const setMappingCallback = useCallback(
    (mapping) => dispatch(setMapping(mapping)),
    [dispatch]
  );

  const setModeCallback = useCallback(
    (mode) => dispatch(setMode(mode)),
    [dispatch]
  );

  return {
    mappings,
    mode,
    mapping,
    mappingId,
    currentPage,
    totalPages,
    filter,
    loading,
    setMapping: setMappingCallback,
    fetchMappings: fetchMappingCallback,
    setFilter: setFilterCallback,
    onPageChange,
    uploadMapping: uploadMappingCallback,
    setMode: setModeCallback,
  };
};
