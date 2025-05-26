import axios from 'axios';

// Ensure we have a valid API URL
const baseURL = process.env.REACT_APP_API_URL || 'https://shaadisetgo-backend.onrender.com/api';

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
  timeout: 10000, // 10 second timeout
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
    
    // Ensure URL format is correct
    if (!config.url.startsWith('/')) {
      config.url = '/' + config.url;
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
        '/api/auth/login',
        '/api/auth/refresh-token',
        '/api/auth/logout'
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
        const response = await api.post('/api/auth/refresh-token');
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
        } else {
          throw new Error('Invalid refresh token response');
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        
        // Clear all auth data
        localStorage.clear();
        delete api.defaults.headers.common.Authorization;
        
        // Redirect to login if not already there
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;