// mockData.js
// Mock statistics for dashboard

export const mockStats = {
  totalDevices: 1234,
  onlineDevices: 1180,
  faultDevices: 23,
  offlineDevices: 54,
  activeManufacturers: 8,
  todayComplaints: 5,
};

export const activities = [
  { id: 1, message: 'Device MAC-001 came online', time: '2 minutes ago' },
  { id: 2, message: 'Temperature fault detected on MAC-045', time: '15 minutes ago' },
  { id: 3, message: 'New user John Doe added to system', time: '1 hour ago' },
  { id: 4, message: 'Device MAC-023 went offline', time: '2 hours ago' },
];

// Mock device data for Devices page
export const mockDevices = [
  {
    id: 'MAC-001',
    name: 'MAC-001',
    manufacturer: 'Macsoft',
    status: 'online',
    lastUpdate: '2025-07-25T10:00:00Z',
  },
  {
    id: 'MAC-002',
    name: 'MAC-002',
    manufacturer: 'Macsoft',
    status: 'offline',
    lastUpdate: '2025-07-25T08:30:00Z',
  },
  {
    id: 'MAC-003',
    name: 'MAC-003',
    manufacturer: 'Acme',
    status: 'fault',
    lastUpdate: '2025-07-25T09:15:00Z',
  },
  {
    id: 'MAC-004',
    name: 'MAC-004',
    manufacturer: 'Acme',
    status: 'online',
    lastUpdate: '2025-07-25T11:20:00Z',
  },
];

// Mock manufacturers for dropdown filters

export const mockManufacturers = [
  { value: 'all', label: 'All Manufacturers' },
  { value: 'macsoft', label: 'Macsoft' },
  { value: 'acme', label: 'Acme' },
];
export const mockTemplates = [
  { id: 'template1', name: 'Template 1' },
  { id: 'template2', name: 'Template 2' },
];
export const mockServerTemplates = [
  { id: 'serverTemplate1', name: 'Server Template 1' },
  { id: 'serverTemplate2', name: 'Server Template 2' },
];

export const _mockManufacturers = [
  { id: 'macsoft', name: 'Macsoft' },
  { id: 'acme', name: 'Acme' },
];

export const mockCommands = [
  { id: 'cmd1', name: 'Command 1', type: 'SET_FREQ', description: 'Set frequency of device' },
  { id: 'cmd2', name: 'Command 2', type: 'GET_STATUS', description: 'Get current status of device' },
  { id: 'cmd3', name: 'Command 3', type: 'REBOOT', description: 'Reboot the device' },
];
export const commandTypes = [
  { value: 'SET_FREQ', label: 'Set Frequency' },
  { value: 'GET_STATUS', label: 'Get Status' },
  { value: 'REBOOT', label: 'Reboot Device' },
  { value: 'CUSTOM', label: 'Custom Command' },
];