import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// Vendor API
export const vendorAPI = {
  getAll: () => api.get('/vendors'),
  getById: (id) => api.get(`/vendors/${id}`),
  getProfile: () => api.get('/vendors/me/profile'),
  update: (id, data) => api.put(`/vendors/${id}`, data),
  getLocations: (id) => api.get(`/vendors/${id}/locations`),
};

// Location API
export const locationAPI = {
  getActive: () => api.get('/locations/active'),
  getNearby: (latitude, longitude, radius = 10) =>
    api.get('/locations/nearby', {
      params: { latitude, longitude, radius },
    }),
  create: (data) => api.post('/locations', data),
  update: (id, data) => api.put(`/locations/${id}`, data),
  delete: (id) => api.delete(`/locations/${id}`),
  getMyLocations: () => api.get('/locations/vendor/me'),
};

export default api;
