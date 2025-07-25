import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const user = JSON.parse(sessionStorage.getItem("user"));
const token = sessionStorage.getItem("authToken");

export const login = createAsyncThunk(
  "login/fetchLogin",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/auth/login`, credentials);
      const token = response.data.token;
      sessionStorage.setItem("authToken", token);
      sessionStorage.setItem("user", JSON.stringify(response.data.user));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return response.data;
    } catch (err) {
      const status = err.response?.status;
      const error = err.response?.data?.error;
      if (error) {
        error.code = status;
      }
      return rejectWithValue(error || "Login failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    token: token || null,
    isAuthenticated: !!token,
    error: null,
    user: user || null,
  },
  reducers: {
    logout: (state) => {
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("user");
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        const token = action.payload.token;
        state.token = token;
        state.isAuthenticated = true;
        state.error = null;
        state.loading = false;
        state.user = action.payload.user;
        sessionStorage.setItem("authToken", token);
        sessionStorage.setItem("user", JSON.stringify(action.payload.user));
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
