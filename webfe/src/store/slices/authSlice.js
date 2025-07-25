
import { createSlice } from '@reduxjs/toolkit';

const user = JSON.parse(sessionStorage.getItem('user'));
const token = sessionStorage.getItem('authToken');

const initialState = {
  user: user || null,
  token: token || null,
  isAuthenticated: !!token,
  permissions: [],
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      sessionStorage.setItem('user', JSON.stringify(action.payload));
    },
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
      sessionStorage.setItem('authToken', action.payload);
    },
    setPermissions: (state, action) => {
      state.permissions = action.payload;
    },
    setAuthLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.permissions = [];
      state.error = null;
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('user');
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
});


export const {
  setUser,
  setToken,
  setPermissions,
  setAuthLoading,
  setAuthError,
  logout,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;
