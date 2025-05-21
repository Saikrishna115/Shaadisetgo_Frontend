import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'https://shaadisetgo-backend.onrender.com';

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true,
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
    
    // Ensure URL starts with /api
    if (!config.url.startsWith('/api/')) {
      config.url = '/api' + (config.url.startsWith('/') ? config.url : '/' + config.url);
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
      // Don't try to refresh if this is a login request
      if (originalRequest.url.includes('/api/auth/login')) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        try {
          const token = await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await api.post('/api/auth/refresh-token');
        const { token } = response.data;
        
        if (token) {
          localStorage.setItem('token', token);
          api.defaults.headers.common.Authorization = `Bearer ${token}`;
          originalRequest.headers.Authorization = `Bearer ${token}`;
          
          processQueue(null, token);
          return api(originalRequest);
        } else {
          processQueue(new Error('No token received'), null);
          throw new Error('No token received');
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // Clear auth data if refresh token is invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        
        // Only redirect to login if we're not already there
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