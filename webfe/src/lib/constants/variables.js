import moment from "moment";
export const devicesState = {
  devices: [],
  device: null,
  deviceId: null,
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

export const dateF = (date) => {
  return moment(date).format("DD/MM/YYYY HH:mm:ss");
};
