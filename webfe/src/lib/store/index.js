import { configureStore } from '@reduxjs/toolkit';
import uiSlice from '../features/uiSlice';
import authSlice from "../features/authSlice";
import devicesSlice from '../features/devices';

export const store = configureStore({
  reducer: {
    ui: uiSlice,
    auth: authSlice,
    device: devicesSlice,
  },
});

export default store;
