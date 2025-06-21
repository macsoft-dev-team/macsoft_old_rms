import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  info: {
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'Administrator',
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.info = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.info = {};
    },
    updateProfile(state, action) {
      state.info = { ...state.info, ...action.payload };
    },
  },
});

export const { login, logout, updateProfile } = userSlice.actions;
export default userSlice.reducer;
