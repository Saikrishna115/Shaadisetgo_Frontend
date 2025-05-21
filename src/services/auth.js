import api from './api/config';

const authService = {
  login: async (credentials) => {
    try {
      // Destructure email and password from credentials
      const { email, password } = credentials;
      
      // Validate credentials
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Make the login request
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        if (response.data.user) {
          localStorage.setItem('userRole', response.data.user.role);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.status === 401) {
        throw { message: 'Invalid email or password' };
      }
      throw error.response?.data || { message: error.message || 'An error occurred during login' };
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        if (response.data.user) {
          localStorage.setItem('userRole', response.data.user.role);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      }
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error.response?.data || { message: 'An error occurred during registration' };
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      // Update local storage with latest user data
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data.user;
    } catch (error) {
      console.error('Get current user error:', error);
      // If the API call fails, fall back to local storage
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default authService;