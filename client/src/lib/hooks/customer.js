import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCustomers,
  fetchCustomerById,
  updateCustomer as updateExistingCustomer,
  createCustomer as createNewCustomer,
  deleteCustomer as deleteExistingCustomer,
  setCustomer as setCurrentCustomer,
  clearSearchQuery,
  setSearchQuery,
  setEdit as setEditCustomer,
  setCreate as setCreateCustomer,
  toggleModal,
} from "../reducer/customerSlice";
import { toast } from "react-toastify";
import { fetchDevice } from "../reducer/deviceSlice";

function useCustomers() {
  const dispatch = useDispatch();
  const {
    customers,
    customer,
    loading,
    error,
    currentPage,
    totalPages,
    searchQuery,
    isEdit,
    isCreate,
    isModalOpen,
  } = useSelector((state) => state.customer);

  useEffect(() => {
    dispatch(
      fetchCustomers({ page: currentPage, take: 10, filter: searchQuery })
    );
  }, [currentPage, searchQuery, dispatch]);

  const fetchCustomer = React.useCallback(
    (id) => {
      dispatch(fetchCustomerById(id));
    },
    [dispatch]
  );

  const createCustomer = React.useCallback(
    (data) => {
      dispatch(createNewCustomer(data)).then((res) => {
        if (res.error) {
          toast.error("Error creating customer:", res.error);
        } else {
          toast.success("Customer created successfully!");
          dispatch(setCreateCustomer(false));
          dispatch(fetchDevice(data.deviceId));
        }
      });
    },
    [dispatch]
  );

  const updateCustomer = React.useCallback(
    (id, data) => {
      dispatch(updateExistingCustomer({ id, ...data })).then((res) => {
        if (res.error) {
          toast.error("Error updating customer:", res.error);
        } else {
          dispatch(fetchDevice(data.deviceId));
          toast.success("Customer updated successfully!");
          dispatch(setEditCustomer(false));
        }
      });
    },
    [dispatch]
  );

  const deleteCustomer = React.useCallback(
    (id) => {
      dispatch(deleteExistingCustomer(id)).then((res) => {
        if (res.error) {
          toast.error("Error deleting customer:", res.error);
        } else {
          toast.success("Customer deleted successfully!");
        }
      });
    },
    [dispatch]
  );

  const handlePageChange = (page) => {
    dispatch(fetchCustomers({ page, take: 10, filter: searchQuery }));
  };

  const handleClear = () => {
    dispatch(clearSearchQuery());
  };
  const handleSearch = (data) => {
    dispatch(setSearchQuery(data.filter));
  };
  const handleModal = (action) => {
    dispatch(toggleModal(action));
  };

  const setCustomer = (data) => {
    dispatch(setCurrentCustomer(data));
  };
  const setEdit = (action) => {
    dispatch(setEditCustomer(action));
  };
  const setCreate = (action) => {
    dispatch(setCreateCustomer(action));
  };

  return {
    customers,
    customer,
    searchQuery,
    loading,
    error,
    currentPage,
    totalPages,
    isModalOpen,
    isEdit,
    isCreate,
    fetchCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    setCustomer,
    handlePageChange,
    handleClear,
    handleSearch,
    handleModal,
    setEdit,
    setCreate,
  };
}

export default useCustomers;
