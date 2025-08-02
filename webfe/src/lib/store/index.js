import { configureStore } from '@reduxjs/toolkit';
import uiSlice from '../features/uiSlice';
import authSlice from "../features/authSlice";
import devicesSlice from '../features/devices';
import manufacturersSlice from '../features/manufacturers';

export const store = configureStore({
  reducer: {
    ui: uiSlice,
    auth: authSlice,
    device: devicesSlice,
    manufacturer: manufacturersSlice,
  },
});

export default store;
