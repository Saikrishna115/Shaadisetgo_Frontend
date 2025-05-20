import axios from 'axios';

const api = axios.create({
  baseURL: 'https://shaadisetgo-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true // Enable sending cookies with requests
});

// Request interceptor for handling requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Set cache control headers only for GET requests
    if (config.method === 'get') {
      config.headers['Cache-Control'] = 'no-cache';
      config.headers['Pragma'] = 'no-cache';
    }

    // Ensure the URL starts with a forward slash
    if (!config.url.startsWith('/')) {
      config.url = '/' + config.url;
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
    return response;
  },
  async (error) => {
    // If the error is 401 (Unauthorized)
    if (error.response?.status === 401) {
      // Only clear auth data if we're not already on the login page
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    // Return the error with the backend's error message if available
    return Promise.reject({
      ...error,
      message: error.response?.data?.message || error.message
    });
  }
);

export default api;