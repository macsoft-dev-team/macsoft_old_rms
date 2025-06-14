import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../lib/reducer/authSlice';
import deviceReducer from '../lib/reducer/deviceSlice';
const store = configureStore({
  reducer: {
    auth: authReducer,
    device: deviceReducer,
   },
 });

export default store;
