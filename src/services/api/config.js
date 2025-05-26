import axios from 'axios';

// Ensure we have a valid API URL
const baseURL = process.env.REACT_APP_API_URL || 'https://shaadisetgo-backend.onrender.com';

// Validate the API URL format
if (!baseURL.startsWith('http')) {
  const errorMessage = 'Invalid API URL format. Please check your environment variables.';
  console.error(errorMessage);
  throw new Error(errorMessage);
}

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  },
  withCredentials: true,
  timeout: 30000, // 30 second timeout
  validateStatus: status => status >= 200 && status < 500 // Handle all responses
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor for adding auth token
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

// Response interceptor for handling token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Skip token refresh for auth-related endpoints
      const skipRefreshEndpoints = [
        '/auth/login',
        '/auth/refresh-token',
        '/auth/logout'
      ];

      if (skipRefreshEndpoints.some(endpoint => originalRequest.url.includes(endpoint))) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve: () => resolve(api(originalRequest)), reject });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await api.post('/auth/refresh-token');
        const { token, user } = response.data;
        
        if (token && user) {
          // Update all auth data
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('userRole', user.role);
          api.defaults.headers.common.Authorization = `Bearer ${token}`;
          originalRequest.headers.Authorization = `Bearer ${token}`;
          
          processQueue(null, token);
          return api(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Clear all auth data on refresh failure
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        delete api.defaults.headers.common.Authorization;
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle network errors
    if (!error.response) {
      return Promise.reject(new Error('Network error. Please check your internet connection.'));
    }

    return Promise.reject(error);
  }
);

export default api;