import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCustomers = createAsyncThunk(
  "customer/fetchCustomers",
  async ({ page, size, filter }, { rejectWithValue }) => {
    try {
      const params = {};
      if (page !== 0) params.skip = page;
      if (size !== 0) params.take = size;
      if (filter) params.filter = filter;
      const response = await axios.get(`/customers`, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchCustomerById = createAsyncThunk(
  "customer/fetchCustomerById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/customers/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createCustomer = createAsyncThunk(
  "customer/createCustomer",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(`/customers`, data);
      dispatch(fetchCustomers({ page: 1, size: 10, filter: "" }));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateCustomer = createAsyncThunk(
  "customer/updateCustomer",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.put(`/customers/${data.id}`, data);
      dispatch(fetchCustomers({ page: 1, size: 10, filter: "" }));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  "customer/deleteCustomer",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/customers/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const customerSlice = createSlice({
  name: "customer",
  initialState: {
    customers: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    searchQuery: "",
    customer: {},
    isEdit: false,
    isCreate: false,
    isModalOpen: false,
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearSearchQuery: (state) => {
      state.searchQuery = "";
    },
    setCustomer: (state, action) => {
      state.customer = action.payload;
    },
    setEdit: (state, action) => {
      state.isEdit = action.payload;
    },
    setCreate: (state, action) => {
      state.isCreate = action.payload;
    },
    toggleModal: (state, action) => {
      state.isModalOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload.customers || [];
        state.currentPage = action.payload.currentPage || 1;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCustomerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.loading = false;
        state.customer = action.payload || {};
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers.push(action.payload);
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customer = action.payload;
        const index = state.customers.findIndex((customer) => customer.id === action.payload.id);
        if (index !== -1) {
          state.customers[index] = action.payload;
        } else {
          state.customers.push(action.payload);
        }
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = state.customers.filter((customer) => customer.id !== action.payload.id);
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSearchQuery, clearSearchQuery, setCustomer, setEdit, setCreate, toggleModal } = customerSlice.actions;

export default customerSlice.reducer;
