// api-client.js
import axios from 'axios';

// URL Configuration - Easy to switch between environments
const API_URLS = {
  local: 'http://localhost:3000/api',
  production: 'https://property-managment-x0d8.onrender.com/api'
};

// Change this to switch between local and production
const CURRENT_ENV = 'production'; // Change to 'local' for development

const apiClient = axios.create({
  baseURL: API_URLS[CURRENT_ENV],
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Log current API URL

export const api = {
  addProperty: (data) => apiClient.post('/properties', data),
  getProperties: (params) => apiClient.get('/properties', { params }),
  getSoldProperties: () => apiClient.get('/properties/sold'),
  getAvailableProperties: () => apiClient.get('/properties/available'),
  updateProperty: (id, data) => apiClient.put(`/properties/${id}`, data),
  deleteProperty: (id) => apiClient.delete(`/properties/${id}`),
  
  // Client endpoints
  addClient: (data) => apiClient.post('/clients', data),
  getClients: (params) => apiClient.get('/clients', { params }),
  getClient: (id) => apiClient.get(`/clients/${id}`),
  updateClient: (id, data) => apiClient.put(`/clients/${id}`, data),
  deleteClient: (id) => apiClient.delete(`/clients/${id}`),
  
//   login: (data) => apiClient.post('/auth/login', data),
//   logout: () => apiClient.post('/auth/logout'),
};

// Export URL configuration for easy switching
export { API_URLS, CURRENT_ENV };

export default apiClient;
