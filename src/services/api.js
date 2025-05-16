import axios from 'axios';

const api = axios.create({
  baseURL: 'https://shaadisetgo-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for handling requests
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

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If the error is 401 (Unauthorized)
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      window.location.href = '/login';
    }
    
    // Return the error with the backend's error message if available
    return Promise.reject({
      ...error,
      message: error.response?.data?.message || error.message
    });
  }
);

export default api;