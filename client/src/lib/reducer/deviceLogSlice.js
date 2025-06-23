import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
  deviceLogs: [],
  loading: false,
  currentPage: null,
  totalPages: 0,
  error: null,
  searchQuery: "",
  deviceLog: {},
};

export const fetchDeviceLogs = createAsyncThunk(
  "deviceLogs/fetchDeviceLogs",
  async ({ skip, take, filter }, { rejectWithValue }) => {
    try {
      const params = {};
      if (skip) params.skip = skip;
      if (take) params.take = take;
      if (filter) {
        // Flatten filter for query params
        if (filter.text) params.filter = filter.text;
        if (filter.startDate) params.startDate = filter.startDate;
        if (filter.endDate) params.endDate = filter.endDate;
      }
      const response = await axios.get("/device-logs", { params });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch device logs");
    }
  }
);

const deviceLogSlice = createSlice({
  name: "deviceLogs",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearSearchQuery: (state) => {
      state.searchQuery = "";
    },
    setDeviceLog: (state, action) => {
      state.deviceLog = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeviceLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeviceLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.deviceLogs = action.payload.deviceLogs;
        state.currentPage = action.payload.currentPage || 1;
        state.totalPages = action.payload.totalPages || 0;
      })
      .addCase(fetchDeviceLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch device logs";
      });
  },
});

export const { setSearchQuery, clearSearchQuery, setDeviceLog } = deviceLogSlice.actions;

export default deviceLogSlice.reducer;