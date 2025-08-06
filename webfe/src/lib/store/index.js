import { configureStore } from "@reduxjs/toolkit";
import uiSlice from "../features/uiSlice";
import authSlice from "../features/authSlice";
import devicesSlice from "../features/devices";
import manufacturersSlice from "../features/manufacturers";
import commandSlice from "../features/commands";
import templatesSlice from "../features/template";
export const store = configureStore({
  reducer: {
    ui: uiSlice,
    auth: authSlice,
    device: devicesSlice,
    template: templatesSlice,
    manufacturer: manufacturersSlice,
    command: commandSlice,
    template: templatesSlice,
  },
});

export default store;
