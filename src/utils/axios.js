import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://shaadisetgo-backend.onrender.com/api',
  withCredentials: true, // ✅ FIXED: Required for CORS with auth headers
  retries: 1,
  retryDelay: 1000,
  timeout: 10000, // Add timeout
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
      headers: {
        ...config.headers,
        Authorization: config.headers.Authorization ? 'Bearer [REDACTED]' : undefined
      },
      hasToken: !!token
    });

    // Prevent caching
    config.headers['Cache-Control'] = 'no-cache';
    config.headers['Pragma'] = 'no-cache';
    config.headers['Expires'] = '0';

    return config;
  },
  (error) => {
    console.error('Request error:', {
      message: error.message,
      config: error.config,
      stack: error.stack
    });
    return Promise.reject(error);
  }
);

// ✅ Response interceptor: handle auth failures and retry
instance.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      url: response.config.url,
      status: response.status,
      statusText: response.statusText,
      data: response.data
    });
    return response;
  },
  async (error) => {
    const { config, response } = error;

    // Log detailed error information
    console.error('Response error:', {
      url: config?.url,
      status: response?.status,
      statusText: response?.statusText,
      data: response?.data,
      error: error.message,
      stack: error.stack,
      headers: response?.headers,
      errorName: error.name,
      errorCode: error.code
    });

    const token = localStorage.getItem('token');

    if (response?.status === 401) {
      if (token) {
        console.log('Unauthorized access, clearing tokens');
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout:', config.url);
      return Promise.reject({
        response: {
          status: 408,
          data: {
            message: 'Request timeout. Please try again.',
          },
        },
      });
    }

    config.retryCount = config.retryCount || 0;

    if (
      config.retryCount < instance.defaults.retries &&
      (!response || response.status >= 500)
    ) {
      config.retryCount += 1;
      console.log(`Retrying request (${config.retryCount}/${instance.defaults.retries}):`, config.url);
      
      // Add exponential backoff
      const delay = instance.defaults.retryDelay * Math.pow(2, config.retryCount - 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
      
      return instance(config);
    }

    if (!response) {
      return Promise.reject({
        response: {
          status: 0,
          data: {
            message: 'Network error. Please check your internet connection and try again later.',
          },
        },
      });
    }

    // Enhance error object with more details
    const enhancedError = {
      ...error,
      response: {
        ...response,
        data: {
          ...response.data,
          timestamp: new Date().toISOString(),
          path: config.url,
          method: config.method
        }
      }
    };

    return Promise.reject(enhancedError);
  }
);

export default instance;
