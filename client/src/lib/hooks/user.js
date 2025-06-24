import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  fetchUserById,
  updateUser as updateExistingUser,
  createUser as createNewUser,
  deleteUser as deleteExistingUser,
  setUser as setCurrentUser,
  clearSearchQuery,
  setSearchQuery,
  setEdit as setEditUser,
  setCreate as setCreateUser,
  toggleModal,
} from "../reducer/userSlice";
import { toast } from "react-toastify";

function useUsers() {
  const dispatch = useDispatch();
  const {
    users,
    user,
    loading,
    error,
    currentPage,
    totalPages,
    searchQuery,
    isEdit,
    isCreate,
    isModalOpen,
  } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(
      fetchUsers({ page: currentPage, take: 10, filter: searchQuery })
    );
  }, [currentPage, searchQuery, dispatch]);

  const fetchUser = React.useCallback(
    (id) => {
      dispatch(fetchUserById(id));
    },
    [dispatch]
  );

  const createUser = React.useCallback(
    (data) => {
      dispatch(createNewUser(data)).then((res) => {
        if (res.error) {
          toast.error("Error creating user:", res.error);
        } else {
          dispatch(setCreateUser(false));
          toast.success("User created successfully!");
        }
      });
    },
    [dispatch]
  );

  const updateUser = React.useCallback(
    (id, data) => {
      dispatch(updateExistingUser({ id, ...data })).then((res) => {
        if (res.error) {
          toast.error("Error updating user:", res.error);
        } else {
          toast.success("User updated successfully!");
          dispatch(setEditUser(false));
        }
      });
    },
    [dispatch]
  );

  const deleteUser = React.useCallback(
    (id) => {
      dispatch(deleteExistingUser(id)).then((res) => {
        if (res.error) {
          toast.error("Error deleting user:", res.error);
        } else {
          toast.success("User deleted successfully!");
        }
      });
    },
    [dispatch]
  );

  const handlePageChange = (page) => {
    dispatch(fetchUsers({ page, take: 10, filter: searchQuery }));
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

  const setUser = (data) => {
    dispatch(setCurrentUser(data));
  };
  const setEdit = (action) => {
    dispatch(setEditUser(action));
  };
  const setCreate = (action) => {
    dispatch(setCreateUser(action));
  };

  return {
    users,
    user,
    searchQuery,
    loading,
    error,
    currentPage,
    totalPages,
    isModalOpen,
    isEdit,
    isCreate,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
    setUser,
    handlePageChange,
    handleClear,
    handleSearch,
    handleModal,
    setEdit,
    setCreate,
  };
}

export default useUsers;
