import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../lib/reducer/authSlice';
import deviceReducer from '../lib/reducer/deviceSlice';
import deviceLogReducer from '../lib/reducer/deviceLogSlice';
import templateReducer from '../lib/reducer/templateSlice';
import userReducer from '../lib/reducer/userSlice';
import customerReducer from '../lib/reducer/customerSlice';
const store = configureStore({
  reducer: {
    auth: authReducer,
    device: deviceReducer,
    deviceLog: deviceLogReducer,
    template: templateReducer,
    user: userReducer,
    customer: customerReducer,
  },
});

export default store;
