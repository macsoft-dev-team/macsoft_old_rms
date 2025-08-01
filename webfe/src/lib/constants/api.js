export const API_URL = import.meta.env.VITE_API_URL;
export const APP_TITLE = import.meta.env.VITE_APP_TITLE;

export const API_ENDPOINTS = {
    login: `${API_URL}/auth/login`,
    logout: `${API_URL}/auth/logout`,
    devices: `${API_URL}/devices`,
 };
