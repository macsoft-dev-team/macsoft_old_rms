import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  devices: [],
  device: {},
  currentPage: null,
    totalPages: 0,
  error: null,
  loading: false,
  searchQuery: "",
};

export const fetchDevices = createAsyncThunk(
  "devices/fetchDevices",
  async ({ page, size, filter }, { rejectWithValue }) => {
    try {
        const params={};
        if(page!==0) params.skip=page
        if(size!==0) params.take=size
        if(filter) params.filter=filter
      const response = await axios.get("/devices", { params });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch devices");
    }
  }
);

const deviceSlice = createSlice({
  name: "devices",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearSearchQuery: (state) => {
      state.searchQuery = "";
    },
    setDevice: (state, action) => {
      state.device = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDevices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.loading = false;
        state.devices = action.payload.devices || [];
        state.currentPage = action.payload.currentPage || 0;
        state.totalPages = action.payload.totalPages || 0;
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchQuery, clearSearchQuery, setDevice } = deviceSlice.actions;

export default deviceSlice.reducer;
