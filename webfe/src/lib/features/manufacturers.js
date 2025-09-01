import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { manufacturersState } from "../../lib/constants/variables";
import { API_ENDPOINTS } from "../../lib/constants/api";
import axios from "axios";

export const fetchManufacturers = createAsyncThunk(
  "manufacturers/fetchManufacturers",
  async ({ skip = 0, take = 10, filter = "" }, { rejectWithValue }) => {
    try {
      const params = {};
      if (skip !== 0) params.skip = skip;
      if (take !== 0) params.take = take;
      if (filter) params.filter = filter;
      const response = await axios.get(API_ENDPOINTS.manufacturers, {
        params,
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchManufacturerById = createAsyncThunk(
  "manufacturers/fetchManufacturerById",
  async (manufacturerId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.manufacturers}/${manufacturerId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createManufacturer = createAsyncThunk(
  "manufacturers/createManufacturer",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_ENDPOINTS.manufacturers, data, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateManufacturer = createAsyncThunk(
  "manufacturers/updateManufacturer",
  async ({ manufacturerId, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_ENDPOINTS.manufacturers}/${manufacturerId}`,
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteManufacturer = createAsyncThunk(
  "manufacturers/deleteManufacturer",
  async (manufacturerId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_ENDPOINTS.manufacturers}/${manufacturerId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const uploadManufacturer = createAsyncThunk(
  "manufacturers/uploadManufacturer",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_ENDPOINTS.manufacturers}/upload`,
        formData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const manufacturersSlice = createSlice({
  name: "manufacturers",
  initialState: manufacturersState,
  reducers: {
    setManufacturer: (state, action) => {
      state.manufacturer = action.payload;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setMode: (state, action) => {
      state.mode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchManufacturers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchManufacturers.fulfilled, (state, action) => {
        state.loading = false;
        state.manufacturers = action.payload.customers;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchManufacturers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch manufacturers";
      })
      .addCase(fetchManufacturerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchManufacturerById.fulfilled, (state, action) => {
        state.loading = false;
        state.manufacturer = action.payload;
        state.error = null;
      })
      .addCase(fetchManufacturerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch manufacturers";
      })
      .addCase(createManufacturer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createManufacturer.fulfilled, (state, action) => {
        state.loading = false;
        state.manufacturers.push(action.payload);
        state.error = null;
        state.mode = { create: false, edit: false, view: false, confirmDelete: false };
      })
      .addCase(createManufacturer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create manufacturer";
      })
      .addCase(updateManufacturer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateManufacturer.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.manufacturers.findIndex((m) => m.id === action.payload.id);
        if (index !== -1) {
          state.manufacturers[index] = action.payload;
        }
        state.error = null;
        state.mode = { create: false, edit: false, view: false, confirmDelete: false };
      })
      .addCase(updateManufacturer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update manufacturer";
      })
      .addCase(deleteManufacturer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteManufacturer.fulfilled, (state, action) => {
        state.loading = false;
        state.manufacturers = state.manufacturers.filter((m) => m.id !== action.payload.id);
        state.error = null;
      })
      .addCase(deleteManufacturer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete manufacturer";
      })
      .addCase(uploadManufacturer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadManufacturer.fulfilled, (state, action) => {
        state.loading = false;
        state.manufacturer = action.payload;
        state.error = null;
      })
      .addCase(uploadManufacturer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to upload manufacturer";
      });
  },
});

export const { setManufacturer, setFilter, setMode } = manufacturersSlice.actions;

export default manufacturersSlice.reducer;
