export const API_URL = import.meta.env.VITE_API_URL;
export const APP_TITLE = import.meta.env.VITE_APP_TITLE;

export const API_ENDPOINTS = {
  login: `${API_URL}/auth/login`,
  logout: `${API_URL}/auth/logout`,
  upload: `${API_URL}/upload`,
  devices: `${API_URL}/devices`,
  users: `${API_URL}/users`,
  manufacturers: `${API_URL}/customers`,
  commands: `${API_URL}/commands`,
  templates: `${API_URL}/templates/modbus`,
  dashboard: `${API_URL}/dashboard`,
  mappings: `${API_URL}/mappings`,
};
