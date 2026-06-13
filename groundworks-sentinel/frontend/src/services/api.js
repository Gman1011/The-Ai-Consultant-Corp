import axios from 'axios';

// Same-origin by default: in production the Express server serves this build
// and the API from one origin; in dev the CRA "proxy" forwards /api to :5050.
const API_URL = process.env.REACT_APP_API_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Property API
export const propertyAPI = {
  getAll: () => api.get('/properties'),
  getById: (id) => api.get(`/properties/${id}`),
};

// Stats API
export const statsAPI = {
  get: () => api.get('/stats'),
};

export default api;
