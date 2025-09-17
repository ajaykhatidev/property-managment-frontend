// api-client.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://property', // Replace with your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  addProperty: (data) => apiClient.post('/properties', data),
  getSoldProperties: () => apiClient.get('/properties/sold'),
  getAvailableProperties: () => apiClient.get('/properties/available'),
//   login: (data) => apiClient.post('/auth/login', data),
//   logout: () => apiClient.post('/auth/logout'),
};

export default apiClient;
