import { useCallback } from "react";
import {
  fetchUserById,
  fetchUsers,
  setUser,
  updateUser,
  createUser,
  deleteUser,
  setMode,
  setFilter,
} from "../lib/features/users";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../components/ui/toast";
import { createErrorHandler } from "../utils/errorUtils";

const useUser = () => {
  const dispatch = useDispatch();
  const { user, users, filter, loading, error, mode, currentPage, totalPages } = useSelector(
    (state) => state.user
  );
  const { addToast } = useToast();

  const setUserCallback = useCallback(
    (user) => dispatch(setUser(user)),
    [dispatch]
  );

  const getUserById = useCallback(
    (id) => {
      dispatch(fetchUserById(id));
    },
    [dispatch]
  );

  const getUsers = useCallback(
    (params) => {
      dispatch(fetchUsers(params));
    },
    [dispatch]
  );

  const updateUserCallback = useCallback(
    (user) => {
      const { id, ...userData } = user;
      return dispatch(updateUser({ id, userData }))
        .unwrap()
        .then((result) => {
          addToast({
            title: "Success!",
            description: `User "${user.name}" has been updated successfully.`,
            variant: "info",
          });
          return result;
        })
        .catch(createErrorHandler(addToast, "update", "user"));
    },
    [dispatch, addToast]
  );

  const createUserCallback = useCallback(
    (user) => {
      return dispatch(createUser(user))
        .unwrap() // This unwraps the promise and throws on rejection
        .then((result) => {
          addToast({
            title: "User Created!",
            description: `Great! Your new user "${user.name}" has been created and is ready to use.`,
            variant: "info",
          });
          return result;
        })
        .catch(createErrorHandler(addToast, "create", "user"));
    },
    [dispatch, addToast]
  );

  const deleteUserCallback = useCallback(
    (id) => {
      return dispatch(deleteUser(id))
        .unwrap() // This unwraps the promise and throws on rejection
        .then((result) => {
          addToast({
            title: "User Deleted",
            description:
              "The user has been permanently removed from your system.",
            variant: "destructive",
          });
          return result;
        })
        .catch(createErrorHandler(addToast, "delete", "user"));
    },
    [dispatch, addToast]
  );

  const setModeCallback = useCallback(
    (modeKey) => dispatch(setMode(modeKey)),
    [dispatch]
  );

  const setFilterCallback = useCallback(
    (filterData) => dispatch(setFilter(filterData)),
    [dispatch]
  );

  const fetchUsersCallback = useCallback(
    (params) => {
      dispatch(fetchUsers(params));
    },
    [dispatch]
  );

  const onPageChange = useCallback(
    (page) => {
       getUsers({ skip: page, take: 10, filter: filter });
    },
    [dispatch, getUsers, filter]
  );

  return {
    mode,
    user,
    users,
    filter,
    currentPage,
    totalPages,
    fetchUsers: fetchUsersCallback,
    loading,
    error,
    setUser: setUserCallback,
    getUserById,
    getUsers,
    updateUser: updateUserCallback,
    createUser: createUserCallback,
    deleteUser: deleteUserCallback,
    setMode: setModeCallback,
    setFilter: setFilterCallback,
    onPageChange,
  };
};

export default useUser;
