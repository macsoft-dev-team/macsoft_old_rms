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
      // Step 1: upload file
      const res = await axios.post(
        `${API_ENDPOINTS.upload}/mappings`,
        formData,
        { withCredentials: true }
      );
      const { jobId } = res.data;

      // Step 2: open SSE
      dispatch(uploadStarted());
      const evtSource = new EventSource(
        `${API_ENDPOINTS.upload}/mappings/stream?jobId=${jobId}`,
        { withCredentials: true }
      );

      evtSource.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.error) {
          dispatch(uploadError(data.error));
          evtSource.close();
        } else if (data.done) {
          dispatch(uploadSuccess());
          evtSource.close();
        } else {
          // 👇 includes updated items
          dispatch(uploadProgress(data));
        }
      };

      evtSource.onerror = () => {
        dispatch(uploadError("Upload stream failed"));
        evtSource.close();
      };

      return { jobId };
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
    uploadStarted(state) {
      state.upload = {
        inProgress: true,
        progress: 0,
        batchNumber: 0,
        totalBatches: 0,
        error: null,
        success: false,
      };
    },
    uploadProgress(state, action) {
      const { batchNumber, totalBatches, updated } = action.payload;
      state.upload.batchNumber = batchNumber;
      state.upload.totalBatches = totalBatches;
      state.upload.progress = Math.round((batchNumber / totalBatches) * 100);
      if (Array.isArray(updated)) {
        updated.forEach((item) => {
          const idx = state.mappings.findIndex(
            (m) => m.imeinumber === item.imeinumber
          );
          if (idx !== -1) {
            state.mappings[idx] = { ...state.mappings[idx], ...item };  
          } else {
            state.mappings.push(item);  
          }
        });
      }
    },
    uploadSuccess(state) {
      state.upload.inProgress = false;
      state.upload.success = true;
    },
    uploadError(state, action) {
      state.upload.inProgress = false;
      state.upload.error = action.payload;
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
      })
      .addCase(uploadMapping.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to upload mapping";
      });
  },
});

export const { setMapping, setFilter, setMode } = mappingsSlice.actions;

export default mappingsSlice.reducer;
