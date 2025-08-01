import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_ENDPOINTS } from "../../lib/constants/api";
import { switchMenuItems } from "../../lib/constants/navData";
const user = JSON.parse(sessionStorage.getItem("user"));
const token = sessionStorage.getItem("authToken");

const initialState = {
  user: user || null,
  token: token || null,
  isAuthenticated: !!token,
  permissions: [],
  loading: false,
  error: null,
  menuItems: [],
};

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { dispatch }) => {
    try {
      const response = await axios.post(API_ENDPOINTS.login, {
        email,
        password,
      });
      const { user, token, permissions } = response.data;
      dispatch(setUser(user));
      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("authToken", token);
      dispatch(setToken(token));
      dispatch(setPermissions(permissions));
    } catch (error) {
      dispatch(setAuthError(error.message));
      throw error;
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
      sessionStorage.setItem("authToken", action.payload);
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
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("user");
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.permissions = action.payload.permissions;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
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
