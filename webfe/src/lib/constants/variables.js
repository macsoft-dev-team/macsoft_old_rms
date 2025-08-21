import moment from "moment";
export const devicesState = {
  devices: [],
  device: null,
  deviceId: null,
  deviceLog: {
    logs: [],
    totalPages: 0,
    currentPage: 0,
    totalCount: 0,
    loading: false,
    error: null,
    fromDate: "",
    toDate: "",
  },
  filter: {
    search: "",
    status: "",
    manufacturer: "",
  },
  totalPages: 0,
  currentPage: 0,
  loading: false,
  error: null,
};

export const manufacturersState = {
  manufacturers: [],
  manufacturer: null,
  filter: {
    search: "",
  },
  mode: {
    create: false,
    edit: false,
    view: false,
    confirmDelete: false,
  },
  totalPages: 0,
  currentPage: 0,
  loading: false,
  error: null,
};
export const commandsState = {
  commands: [],
  command:null,
  filter: {
    search: "",
    fromDate: "",
    toDate: "",
  },
  totalPages: 0,
  currentPage: 0,
  loading: false,
  error: null,
};

export const templatesState = {
  templates: [],
  template: null,
  mode:{
    create: false,
    edit: false,
    view: false,
    confirmDelete: false,
  },
  filter: {
    search: "",
  },
  totalPages: 0,
  currentPage: 0,
  loading: false,
  error: null,
};

export const dashboardState = {
  dashboard: {
    totalDevices: 0,
    onlineDevices: 0,
    faultDevices: 0,
    offlineDevices: 0,
    activeManufacturers: 0,
    todaysComplaints: 0,
    deviceLocations: [],
    recentActivity: [],
  },
  lastUpdated: null,
  loading: false,
  error: null,
};

export const mappingsState = {
  mappings: [],
  mapping: null,
  mappingId: null,
  mode: "",
  filter: {
    search: "",
    status: "",
    manufacturer: "",
  },
  totalPages: 0,
  currentPage: 0,
  loading: false,
  error: null,
};

export const dateF = (date) => {
  return moment(date).format("DD/MM/YYYY HH:mm:ss");
};
