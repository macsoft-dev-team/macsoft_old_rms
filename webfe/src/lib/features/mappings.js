import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { mappingsState } from "../../lib/constants/variables";
import { API_ENDPOINTS } from "../../lib/constants/api";
import axios from "axios";

export const fetchMappings = createAsyncThunk(
  "mappings/fetchMappings",
  async ({ skip = 0, take = 10, filter = "" }, { rejectWithValue }) => {
    try {
      const params = {};
      if (skip !== 0) params.skip = skip;
      if (take !== 0) params.take = take;
      if (filter) params.filter = filter;
      const response = await axios.get(API_ENDPOINTS.mappings, {
        params,
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMappingById = createAsyncThunk(
  "mappings/fetchMappingById",
  async (mappingId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.mappings}/${mappingId}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateMapping = createAsyncThunk(
  "mappings/updateMapping",
  async ({ mappingId, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_ENDPOINTS.mappings}/${mappingId}`,
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const uploadMapping = createAsyncThunk(
  "mappings/uploadMapping",
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(
        `${API_ENDPOINTS.upload}/mappings`,
        formData,
        { withCredentials: true }
      );
      dispatch(fetchMappings({ skip: 0, take: 12 }));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
 

export const mappingsSlice = createSlice({
  name: "mappings",
  initialState: mappingsState,
  reducers: {
    setMapping: (state, action) => {
      state.mapping = action.payload;
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
      .addCase(fetchMappings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMappings.fulfilled, (state, action) => {
        state.loading = false;
        state.mappings = action.payload.mappings;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchMappings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch mappings";
      })
      .addCase(fetchMappingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMappingById.fulfilled, (state, action) => {
        state.loading = false;
        state.mapping = action.payload;
      })
      .addCase(fetchMappingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch mapping by ID";
      })
      .addCase(updateMapping.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMapping.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.mappings.findIndex(
          (mapping) => mapping.id === action.payload.id
        );
        if (index !== -1) {
          state.mappings[index] = action.payload;
        }
      })
      .addCase(updateMapping.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update mapping";
      })
      .addCase(uploadMapping.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadMapping.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.mappings && Array.isArray(action.payload.mappings)) {
          state.mappings.push(...action.payload.mappings);
        }
      })
      .addCase(uploadMapping.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to upload mapping";
      });
  },
});

export const { setMapping, setFilter, setMode } = mappingsSlice.actions;

export default mappingsSlice.reducer;
