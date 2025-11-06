import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { devicesState } from "../../lib/constants/variables";
import { API_ENDPOINTS } from "../../lib/constants/api";
import axios from "axios";

export const fetchDevices = createAsyncThunk(
  "devices/fetchDevices",
  async ({ skip = 0, take = 10, filter = "" }, { rejectWithValue }) => {
    try {
        
    const params = {};
    if (skip !== 0) params.skip = skip;
    if (take !== 0) params.take = take;
    if (filter) params.filter = filter;
    const response = await axios.get(API_ENDPOINTS.devices, { params, withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDeviceById = createAsyncThunk(
  "devices/fetchDeviceById",
  async (deviceId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.devices}/${deviceId}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateDevice = createAsyncThunk(
  "devices/updateDevice",
  async ({ deviceId, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_ENDPOINTS.devices}/${deviceId}`, data, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteDevice = createAsyncThunk(
  "devices/deleteDevice",
  async (deviceId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_ENDPOINTS.devices}/${deviceId}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const uploadDevice= createAsyncThunk(
  "devices/uploadDevice",
  async (formData, { rejectWithValue ,dispatch}) => {
    try {
      const response = await axios.post(
        `${API_ENDPOINTS.upload}/devices`,
        formData,
        { withCredentials: true }
      );
      dispatch(fetchDevices({ skip: 0, take: 12 }));  
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDeviceLogs = createAsyncThunk(
  "devices/fetchDeviceLogs",
  async ({skip,take,fromDate,toDate,imeinumber,tablename}, { rejectWithValue }) => {
    try {
       const params = {tablename};
      if (skip !== 0) params.skip = skip;
      if (take !== 0) params.take = take;
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;
       const response = await axios.get(`${API_ENDPOINTS.devices}/logs/${imeinumber}`, { params, withCredentials: true });
       return response.data;
    } catch (error) {
       return rejectWithValue(error.message);
    }
  }
);

export const devicesSlice = createSlice({
  name: "devices",
  initialState: devicesState,
  reducers: {
    setDevice: (state, action) => {
      state.device = action.payload;
    },
    setFilter : (state, action) => {
      state.filter = action.payload;
    },
    setDeviceLogFilters: (state, action) => {
      state.deviceLog.fromDate = action.payload.fromDate || "";
      state.deviceLog.toDate = action.payload.toDate || "";
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
        state.devices = action.payload.devices;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch devices";
      })
      .addCase(fetchDeviceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeviceById.fulfilled, (state, action) => {
        state.loading = false;
        state.device = action.payload;
      })
      .addCase(fetchDeviceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch device by ID";
      })
      .addCase(updateDevice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDevice.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.devices.findIndex(device => device.id === action.payload.id);
        if (index !== -1) {
          state.devices[index] = action.payload;
        }
      })
      .addCase(updateDevice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update device";
      })
      .addCase(deleteDevice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDevice.fulfilled, (state, action) => {
        state.loading = false;
        state.devices = state.devices.filter(device => device.id !== action.payload.id);
      })
      .addCase(deleteDevice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete device";
      })
      .addCase(uploadDevice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadDevice.fulfilled, (state, action) => {
        state.loading = false;
         if (action.payload.devices && Array.isArray(action.payload.devices)) {
          state.devices.push(...action.payload.devices);
        }
      })
      .addCase(uploadDevice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to upload device";
      })
      .addCase(fetchDeviceLogs.pending, (state) => {
        state.deviceLog.loading = true;
        state.deviceLog.error = null;
      })
      .addCase(fetchDeviceLogs.fulfilled, (state, action) => {
         state.deviceLog.loading = false;
        state.deviceLog.logs = action.payload.devicelog; 
        state.deviceLog.totalPages = action.payload.totalPages;
        state.deviceLog.currentPage = action.payload.currentPage;
        state.deviceLog.totalCount = action.payload.totalCount; 
       })
      .addCase(fetchDeviceLogs.rejected, (state, action) => {
        state.deviceLog.loading = false;
        state.deviceLog.error = action.payload || "Failed to fetch device logs";
      });
  },
});

export const { setDevice,setFilter,setDeviceLogFilters } = devicesSlice.actions;

export default devicesSlice.reducer;
