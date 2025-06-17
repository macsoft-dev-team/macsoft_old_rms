import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
  deviceLogs: [],
  loading: false,
    currentPage: null,
    totalPages: 0,
  error: null,
};

export const fetchDeviceLogs = createAsyncThunk(
  "deviceLogs/fetchDeviceLogs",
  async ({ skip, take, filter }, { rejectWithValue }) => {
    try {
      const params = {};
      if (skip) params.skip = skip;
      if (take) params.take = take;
      if (filter) params.filter = filter;
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
  reducers: {},
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

 export default deviceLogSlice.reducer; 