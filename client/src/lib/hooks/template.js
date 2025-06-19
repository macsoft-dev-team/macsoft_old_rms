import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTemplates,
  fetchTemplateById,
  uploadTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  clearSearchQuery,
  setSearchQuery,
} from "../reducer/templateSlice";

function useTemplates() {
  const dispatch = useDispatch();
  const { templates, loading, error, currentPage, totalPages, searchQuery } =
    useSelector((state) => state.template);

  useEffect(() => {
    dispatch(
      fetchTemplates({ page: currentPage, take: 10, filter: searchQuery })
    );
  }, [currentPage, searchQuery, dispatch]);

  const fetchTemplate = React.useCallback(
    (id) => {
      dispatch(fetchTemplateById(id));
    },
    [dispatch]
  );
  const uploadTemplateFile = React.useCallback(
    (file) => {
      dispatch(uploadTemplate(file));
    },
    [dispatch]
  );
  const createNewTemplate = React.useCallback(
    (data) => {
      dispatch(createTemplate(data));
    },
    [dispatch]
  );
  const updateExistingTemplate = React.useCallback(
    (id, data) => {
      dispatch(updateTemplate({ id, data }));
    },
    [dispatch]
  );
  const deleteExistingTemplate = React.useCallback(
    (id) => {
      dispatch(deleteTemplate(id));
    },
    [dispatch]
  );
  const handlePageChange = (page) => {
    dispatch(fetchTemplates({ page, take: 10, filter: searchQuery }));
  };

  const handleClear = () => {
    dispatch(clearSearchQuery());
  };
  const handleSearch = (data) => {
    dispatch(setSearchQuery(data.filter));
  };

  return {
    templates,
    fetchTemplate,
    uploadTemplateFile,
    createNewTemplate,
    updateExistingTemplate,
    deleteExistingTemplate,
    searchQuery,
    loading,
    error,
    currentPage,
    totalPages,
    handleClear,
    handleSearch,
  };
}

export default useTemplates;
