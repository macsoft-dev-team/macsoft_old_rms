import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTemplates,
  fetchTemplateById,
  updateTemplate as updateExistingTemplate,
  createTemplate as createNewTemplate,
  uploadTemplateFile,
  deleteTemplate as deleteExistingTemplate,
  setTemplate as setCurrentTemplate,
  clearSearchQuery,
  setSearchQuery,
  setEdit as setEditTemplate,
  setCreate as setCreateTemplate,
  toggleUploadModal,
} from "../reducer/templateSlice";
import { toast } from "react-toastify";

function useTemplates() {
  const dispatch = useDispatch();
  const {
    templates,
    template,
    loading,
    error,
    currentPage,
    totalPages,
    searchQuery,
    isEdit,
    isCreate,
    isUploadModalOpen,
  } = useSelector((state) => state.template);

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
  const uploadTemplate = React.useCallback(
    (file) => {
      dispatch(uploadTemplateFile(file)).then((res) => {
        if (res.error) {
          toast.error("Error uploading template:", res.error);
        } else {
          toast.success("Template uploaded successfully!");
          dispatch(toggleUploadModal(false));
        }
      });
    },
    [dispatch]
  );
  const createTemplate = React.useCallback(
    (data) => {
      dispatch(createNewTemplate(data)).then((res) => {
        if (res.error) {
          toast.error("Error creating template:", res.error);
        } else {
          dispatch(setCreateTemplate(false));
          toast.success("Template created successfully!");
        }
      });
    },
    [dispatch]
  );
  const updateTemplate = React.useCallback(
    (id, data) => {
      dispatch(updateExistingTemplate({ id, data })).then((res) => {
        if (res.error) {
          toast.error("Error updating template:", res.error);
        } else {
          toast.success("Template updated successfully!");
          dispatch(setEditTemplate(false));
        }
      });
    },
    [dispatch]
  );
  const deleteTemplate = React.useCallback(
    (id) => {
      dispatch(deleteExistingTemplate(id)).then((res) => {
        if (res.error) {
          toast.error("Error deleting template:", res.error);
        } else {
          toast.success("Template deleted successfully!");
        }
      });
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
  const handleUploadModal = (action) => {
    dispatch(toggleUploadModal(action));
  };

  const setTemplate = (data) => {
    dispatch(setCurrentTemplate(data));
  };
  const setEdit = (action) => {
    dispatch(setEditTemplate(action));
  };
  const setCreate = (action) => {
    dispatch(setCreateTemplate(action));
  };

  return {
    templates,
    template,
    searchQuery,
    loading,
    error,
    currentPage,
    totalPages,
    isUpload: isUploadModalOpen,
    isEdit,
    isCreate,
    fetchTemplate,
    uploadTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    setTemplate,
    handlePageChange,
    handleClear,
    handleSearch,
    handleUploadModal,
    setEdit,
    setCreate,
  };
}

export default useTemplates;
