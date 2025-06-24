import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async ({ page, size, filter }, { rejectWithValue }) => {
    try {
      const params = {};
      if (page !== 0) params.skip = page;
      if (size !== 0) params.take = size;
      if (filter) params.filter = filter;
      const response = await axios.get(`/users`, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "user/fetchUserById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createUser = createAsyncThunk(
  "user/createUser",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(`/users`, data);
      dispatch(fetchUsers({ page: 1, size: 10, filter: "" }));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.put(`/users/${data.id}`, data);
      dispatch(fetchUsers({ page: 1, size: 10, filter: "" }));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    searchQuery: "",
    user: {},
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
    setUser: (state, action) => {
      state.user = action.payload;
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
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users || [];
        state.currentPage = action.payload.currentPage || 1;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload || {};
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        const index = state.users.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        } else {
          state.users.push(action.payload);
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user.id !== action.payload.id);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSearchQuery, clearSearchQuery, setUser, setEdit, setCreate, toggleModal } = userSlice.actions;

export default userSlice.reducer;
