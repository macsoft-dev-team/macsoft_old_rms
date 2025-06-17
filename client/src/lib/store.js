import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../lib/reducer/authSlice';
import deviceReducer from '../lib/reducer/deviceSlice';
import deviceLogReducer from '../lib/reducer/deviceLogSlice';
const store = configureStore({
  reducer: {
    auth: authReducer,
    device: deviceReducer,
    deviceLog: deviceLogReducer,
  },
});

export default store;
