import { configureStore } from "@reduxjs/toolkit";
import uiSlice from "../features/uiSlice";
import authSlice from "../features/authSlice";
import devicesSlice from "../features/devices";
import manufacturersSlice from "../features/manufacturers";
import commandSlice from "../features/commands";
import templatesSlice from "../features/template";
import dashboardSlice from "../features/dashboard";
import mappingsSlice from "../features/mappings";
import userSlice from "../features/users";
import notificationSlice from "../features/notifications";
export const store = configureStore({
  reducer: {
    ui: uiSlice,
    auth: authSlice,
    device: devicesSlice,
    template: templatesSlice,
    manufacturer: manufacturersSlice,
    command: commandSlice,
    template: templatesSlice,
    dashboard: dashboardSlice,
    mapping: mappingsSlice,
    user: userSlice,
    notification: notificationSlice,
  },
});

export default store;
