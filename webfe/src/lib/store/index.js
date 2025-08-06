import { configureStore } from "@reduxjs/toolkit";
import uiSlice from "../features/uiSlice";
import authSlice from "../features/authSlice";
import devicesSlice from "../features/devices";
import manufacturersSlice from "../features/manufacturers";
import commandSlice from "../features/commands";
export const store = configureStore({
  reducer: {
    ui: uiSlice,
    auth: authSlice,
    device: devicesSlice,
    manufacturer: manufacturersSlice,
    command: commandSlice,
  },
});

export default store;
