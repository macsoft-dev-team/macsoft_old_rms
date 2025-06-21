import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [
    { id: 1, type: 'Warning', message: 'High temperature', time: '2024-06-01 10:05' },
    { id: 2, type: 'Error', message: 'Device offline', time: '2024-06-01 09:45' },
    // ...more mock alerts...
  ],
};

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    // ...reducers...
  },
});

export default alertsSlice.reducer;
