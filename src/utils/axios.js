import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://shaadisetgo-backend.onrender.com/api',
  withCredentials: true, // ✅ FIXED: Required for CORS with auth headers
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

    // Log request details
    console.log('Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      hasToken: !!token
    });

    // Prevent caching
    config.headers['Cache-Control'] = 'no-cache';
    config.headers['Pragma'] = 'no-cache';
    config.headers['Expires'] = '0';

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// ✅ Response interceptor: handle auth failures and retry
instance.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  async (error) => {
    const { config, response } = error;
    console.error('Response error:', {
      url: config?.url,
      status: response?.status,
      data: response?.data,
      error: error.message,
      stack: error.stack
    });

    const token = localStorage.getItem('token');

    if (response && response.status === 401) {
      if (token) {
        console.log('Unauthorized access, clearing tokens');
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    config.retryCount = config.retryCount || 0;

    if (
      config.retryCount < instance.defaults.retries &&
      (!response || response.status >= 500)
    ) {
      config.retryCount += 1;
      console.log(`Retrying request (${config.retryCount}/${instance.defaults.retries})`);
      await new Promise((resolve) => setTimeout(resolve, instance.defaults.retryDelay));
      return instance(config);
    }

    if (!response) {
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
