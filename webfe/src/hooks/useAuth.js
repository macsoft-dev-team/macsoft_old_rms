import { useSelector, useDispatch } from 'react-redux';

import {
  setUser,
  setToken,
  setPermissions,
  setAuthLoading,
  setAuthError,
  login,
  logout,
  clearAuthError
} from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  return {
    ...auth,
    login: (email, password) => dispatch(login({ email, password })),
    setUser: (user) => dispatch(setUser(user)),
    setToken: (token) => dispatch(setToken(token)),
    setPermissions: (permissions) => dispatch(setPermissions(permissions)),
    setLoading: (loading) => dispatch(setAuthLoading(loading)),
    setError: (error) => dispatch(setAuthError(error)),
    logout: () => dispatch(logout()),
    clearError: () => dispatch(clearAuthError()),
    hasPermission: (permission) => auth.permissions.includes(permission),
  };
};

export default useAuth;
