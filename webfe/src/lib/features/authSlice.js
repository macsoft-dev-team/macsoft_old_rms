import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_ENDPOINTS } from "../../lib/constants/api";

const user = JSON.parse(sessionStorage.getItem("user"));

const initialState = {
  user: user || null,
  isAuthenticated: !!user,
  permissions: [],
  loading: false,
  error: null,
  menuItems: [],
};

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(API_ENDPOINTS.login, { email, password }, { withCredentials: true });
      const { user, success } = response.data;
      if (!success) throw new Error("Login failed");
      dispatch(setUser(user));
      sessionStorage.setItem("user", JSON.stringify(user));
      return { user };
    } catch (error) {
      dispatch(setAuthError(error.message));
      return rejectWithValue(error.message);
    }
  }
);

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.get(API_ENDPOINTS.login.replace("/login", "/check"), { withCredentials: true });
      const { user, isAuthenticated } = response.data;
      if (isAuthenticated) {
        dispatch(setUser(user));
        sessionStorage.setItem("user", JSON.stringify(user));
        return { user };
      } else {
        dispatch(logout());
        return rejectWithValue("Not authenticated");
      }
    } catch (error) {
      dispatch(logout());
      return rejectWithValue(error.message);
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
    setToken: (state, action) => {}, // No-op, token is not handled client-side
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
      state.isAuthenticated = false;
      state.permissions = [];
      state.error = null;
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
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
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
