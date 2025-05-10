import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://shaadisetgo-backend.onrender.com/api',
  timeout: 10000, // 10 second timeout
});

// Automatically attach the token from localStorage to every request
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        response: {
          data: {
            message: 'Network error. Please check your internet connection.'
          }
        }
      });
    }

    // Handle token expiration
    if (error.response.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default instance;
