import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://shaadisetgo-backend.onrender.com/api',
  timeout: 15000, // 15 second timeout
  retries: 2, // Number of retry attempts
  retryDelay: 1000 // Delay between retries in milliseconds
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

// Add response interceptor for error handling and retry logic
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config } = error;
    const token = localStorage.getItem('token');
    
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      // If token exists but is invalid, clear it and refresh auth state
      if (token) {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        window.location.href = '/login';
        return Promise.reject(error);
      }
      localStorage.clear();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Initialize retry count
    config.retryCount = config.retryCount || 0;

    // Check if we should retry the request
    if (config.retryCount < instance.defaults.retries && (!error.response || error.response.status >= 500)) {
      config.retryCount += 1;

      // Delay before retrying
      await new Promise(resolve => setTimeout(resolve, instance.defaults.retryDelay));
      
      try {
        return await instance(config);
      } catch (retryError) {
        if (config.retryCount === instance.defaults.retries) {
          return Promise.reject({
            response: {
              data: {
                message: 'Network error. Please check your internet connection and try again later.'
              }
            }
          });
        }
        throw retryError;
      }
    }

    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        response: {
          data: {
            message: 'Network error. Please check your internet connection and try again later.'
          }
        }
      });
    }

    return Promise.reject(error);
  }
);

export default instance;
