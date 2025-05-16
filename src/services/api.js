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
    console.log('API Request:', {
      method: config.method,
      url: config.url,
      hasToken: !!localStorage.getItem('token')
    });
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      status: response.status,
      url: response.config.url,
      success: response.data?.success
    });
    return response;
  },
  async (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    });

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