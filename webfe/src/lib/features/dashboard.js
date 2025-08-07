import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_ENDPOINTS } from "../constants/api";
import { dashboardState } from "../constants/variables";
export const fetchDashboardStats = createAsyncThunk(
  "dashboardStats/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_ENDPOINTS.dashboard, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const dashboardSlice = createSlice({
  name: "dashboardStats",
  initialState: dashboardState,
  reducers: {
    setLastUpdated: (state, action) => {
      state.lastUpdated = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
        state.error = null;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch dashboard stats";
      });
  },
});

export const { setLastUpdated } = dashboardSlice.actions;

export default dashboardSlice.reducer;
