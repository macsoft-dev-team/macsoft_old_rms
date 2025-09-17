import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { notificationsState } from "../../lib/constants/variables";
import { API_ENDPOINTS } from "../../lib/constants/api";
import axios from "axios";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async ({ skip = 0, take = 10, filter = "" }, { rejectWithValue }) => {
    try {
      const params = {};
      if (skip !== 0) params.skip = skip;
      if (take !== 0) params.take = take;
      if (filter) params.filter = filter;
      const response = await axios.get(API_ENDPOINTS.notifications, {
        params,
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchNotificationById = createAsyncThunk(
  "notifications/fetchNotificationById",
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.notifications}/${notificationId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createNotification = createAsyncThunk(
  "notifications/createNotification",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_ENDPOINTS.notifications, data, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateNotification = createAsyncThunk(
  "notifications/updateNotification",
  async ({ notificationId, data }, { rejectWithValue ,dispatch }) => {
    try {
      const response = await axios.put(
        `${API_ENDPOINTS.notifications}/${notificationId}/read`,
        data,
        { withCredentials: true }
      );
      dispatch(fetchNotifications({ skip: 0, take: 10, filter: "" }));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState: notificationsState,
  reducers: {
    setNotification: (state, action) => {
      state.notification = action.payload;
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
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.notifications;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch notifications";
      })
      .addCase(fetchNotificationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotificationById.fulfilled, (state, action) => {
        state.loading = false;
        state.notification = action.payload;
        state.error = null;
      })
      .addCase(fetchNotificationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch notifications";
      })
      .addCase(createNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications.push(action.payload);
        state.error = null;
        state.mode = {
          create: false,
          edit: false,
          view: false,
          confirmDelete: false,
        };
      })
      .addCase(createNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create notification";
      })
      .addCase(updateNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNotification.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.notifications.findIndex(
          (m) => m.id === action.payload.id
        );
        if (index !== -1) {
          state.notifications[index] = action.payload;
        }
        state.error = null;
        state.mode = {
          create: false,
          edit: false,
          view: false,
          confirmDelete: false,
        };
      })
      .addCase(updateNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update notification";
      });
  },
});

export const { setNotification, setFilter, setMode } =
  notificationsSlice.actions;

export default notificationsSlice.reducer;
