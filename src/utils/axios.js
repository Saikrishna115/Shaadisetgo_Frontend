import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://shaadisetgo-backend.onrender.com/api',
  withCredentials: false,
  retries: 1,
  retryDelay: 1000,
});

// ✅ Request interceptor: attach token & disable caching
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Prevent caching
    config.headers['Cache-Control'] = 'no-cache';
    config.headers['Pragma'] = 'no-cache';
    config.headers['Expires'] = '0';

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor: handle auth failures and retry
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config } = error;
    const token = localStorage.getItem('token');

    if (error.response && error.response.status === 401) {
      if (token) {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    config.retryCount = config.retryCount || 0;

    if (
      config.retryCount < instance.defaults.retries &&
      (!error.response || error.response.status >= 500)
    ) {
      config.retryCount += 1;
      await new Promise((resolve) => setTimeout(resolve, instance.defaults.retryDelay));
      return instance(config);
    }

    if (!error.response) {
      return Promise.reject({
        response: {
          data: {
            message: 'Network error. Please check your internet connection and try again later.',
          },
        },
      });
    }

    return Promise.reject(error);
  }
);

export default instance;
