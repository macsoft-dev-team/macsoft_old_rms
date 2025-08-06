import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { commandsState } from "../../lib/constants/variables";
import { API_ENDPOINTS } from "../../lib/constants/api";
import axios from "axios";

export const fetchCommands = createAsyncThunk(
  "commands/fetchCommands",
  async (
    { skip = 0, take = 10, filter = "", deviceId },
    { rejectWithValue }
  ) => {
    try {
      const params = {};
      if (skip !== 0) params.skip = skip;
      if (take !== 0) params.take = take;
      if (filter) params.filter = filter;
      const response = await axios.get(
        `${API_ENDPOINTS.commands}/${deviceId}`,
        {
          params,
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const postCommand = createAsyncThunk(
  "commands/postCommands",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(API_ENDPOINTS.commands, data, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const commandsSlice = createSlice({
  name: "commands",
  initialState: commandsState,
  reducers: {
    setCommands: (state, action) => {
      state.commands = action.payload;
    },
    setCommand: (state, action) => {
      state.command = action.payload;
    },
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommands.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCommands.fulfilled, (state, action) => {
        state.loading = false;
        state.commands = action.payload.commands;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchCommands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(postCommand.pending, (state) => {
        state.loading = true;
      })
      .addCase(postCommand.fulfilled, (state, action) => {
        state.loading = false;
        state.commands.push(action.payload);
      })
      .addCase(postCommand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setCommands, setCommand } = commandsSlice.actions;

export default commandsSlice.reducer;
