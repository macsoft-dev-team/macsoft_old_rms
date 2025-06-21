import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [
    { id: 1, name: 'Device A', status: 'Online', type: 'Sensor', lastSeen: '2024-06-01 10:00' },
    { id: 2, name: 'Device B', status: 'Offline', type: 'Controller', lastSeen: '2024-06-01 09:30' },
    // ...more mock devices...
  ],
  selectedDevice: null,
};

const devicesSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    selectDevice(state, action) {
      state.selectedDevice = action.payload;
    },
    // ...other reducers...
  },
});

export const { selectDevice } = devicesSlice.actions;
export default devicesSlice.reducer;
