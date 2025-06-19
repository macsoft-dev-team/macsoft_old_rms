import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchTemplates = createAsyncThunk(
  "template/fetchTemplates",
  async ({ page, size, filter }, { rejectWithValue }) => {
    try {
      const params = {};
      if (page !== 0) params.skip = page;
      if (size !== 0) params.take = size;
      if (filter) params.filter = filter;
      const response = await axios.get(`/templates`, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchTemplateById = createAsyncThunk(
  "template/fetchTemplateById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/templates/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const uploadTemplateFile = createAsyncThunk(
  "template/uploadTemplateFile",
  async (data, { rejectWithValue,dispatch }) => {
    try {
      const response = await axios.post(`/templates/upload`, data);
      dispatch(fetchTemplates({ page: 1, size: 10, filter: "" }));  
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createTemplate = createAsyncThunk(
  "template/createTemplate",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/templates`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateTemplate = createAsyncThunk(
  "template/updateTemplate",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/templates/${data.id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteTemplate = createAsyncThunk(
  "template/deleteTemplate",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/templates/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const templateSlice = createSlice({
  name: "template",
  initialState: {
    templates: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    searchQuery: "",
    template: {},
    isModalOpen: false,
    isUploadModalOpen: false,
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearSearchQuery: (state) => {
      state.searchQuery = "";
    },
    setTemplate: (state, action) => {
      state.template = action.payload;
    },
    toggleModal: (state,action) => {
      state.isModalOpen =  action.payload
    },
    toggleUploadModal: (state, action) => {
      state.isUploadModalOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload.templates || [];
        state.currentPage = action.payload.currentPage || 1;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchTemplateById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplateById.fulfilled, (state, action) => {
        state.loading = false;
        state.template = action.payload || {};
      })
      .addCase(fetchTemplateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(uploadTemplateFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadTemplateFile.fulfilled, (state, action) => {
        state.loading = false;
       })
      .addCase(uploadTemplateFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.templates.push(action.payload);
      })
      .addCase(createTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTemplate.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.templates.findIndex((template) => template.id === action.payload.id);
        if (index !== -1) {
          state.templates[index] = action.payload;
        }
      })
      .addCase(updateTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = state.templates.filter((template) => template.id !== action.payload.id);
      })
      .addCase(deleteTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSearchQuery, clearSearchQuery, setTemplate ,toggleModal, toggleUploadModal} = templateSlice.actions;

export default templateSlice.reducer;
