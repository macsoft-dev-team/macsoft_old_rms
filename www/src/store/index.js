import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import devicesReducer from './devicesSlice';
import alertsReducer from './alertsSlice';

export default configureStore({
  reducer: {
    user: userReducer,
    devices: devicesReducer,
    alerts: alertsReducer,
  },
});
