import axios from 'axios';

// Base URL for API
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instances
export const authAPI = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const carsAPI = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const searchAPI = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const reviewsAPI = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
const addAuthToken = (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// Add request interceptors
authAPI.interceptors.request.use(addAuthToken);
carsAPI.interceptors.request.use(addAuthToken);
searchAPI.interceptors.request.use(addAuthToken);
reviewsAPI.interceptors.request.use(addAuthToken);

// Response interceptor for error handling
const handleResponseError = (error) => {
  if (error.response?.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
};

// Add response interceptors
authAPI.interceptors.response.use((response) => response, handleResponseError);
carsAPI.interceptors.response.use((response) => response, handleResponseError);
searchAPI.interceptors.response.use((response) => response, handleResponseError);
reviewsAPI.interceptors.response.use((response) => response, handleResponseError);

// API service functions
export const apiService = {
  // Auth services
  auth: {
    login: (email, password) => authAPI.post('/auth/login', { email, password }),
    register: (name, email, password) => authAPI.post('/auth/register', { name, email, password }),
    getProfile: () => authAPI.get('/auth/me'),
    updateProfile: (data) => authAPI.put('/auth/profile', data),
    changePassword: (currentPassword, newPassword) => 
      authAPI.put('/auth/password', { currentPassword, newPassword }),
  },

  // Cars services
  cars: {
    getAll: (params = {}) => carsAPI.get('/cars', { params }),
    getById: (id) => carsAPI.get(`/cars/${id}`),
    create: (data) => carsAPI.post('/cars', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, data) => carsAPI.put(`/cars/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    delete: (id) => carsAPI.delete(`/cars/${id}`),
    getFeatured: (limit = 6) => carsAPI.get(`/cars/featured/list?limit=${limit}`),
  },

  // Search services
  search: {
    searchCars: (params = {}) => searchAPI.get('/search', { params }),
    getSuggestions: (query) => searchAPI.get(`/search/suggestions?q=${encodeURIComponent(query)}`),
    getPopular: (limit = 10) => searchAPI.get(`/search/popular?limit=${limit}`),
    getFilters: () => searchAPI.get('/search/filters'),
  },

  // Reviews services
  reviews: {
    getAll: (params = {}) => reviewsAPI.get('/reviews', { params }),
    getById: (id) => reviewsAPI.get(`/reviews/${id}`),
    create: (data) => reviewsAPI.post('/reviews', data),
    update: (id, data) => reviewsAPI.put(`/reviews/${id}`, data),
    delete: (id) => reviewsAPI.delete(`/reviews/${id}`),
    markHelpful: (id) => reviewsAPI.put(`/reviews/${id}/helpful`),
    report: (id) => reviewsAPI.put(`/reviews/${id}/report`),
    getStats: (carId) => reviewsAPI.get(`/reviews/stats/${carId}`),
  },
};

export default apiService;
