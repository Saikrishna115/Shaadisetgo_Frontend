import api from './config';

class AuthService {
  async login(credentials) {
    try {
      const response = await api.post('/api/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
          if (response.data.user.role) {
            localStorage.setItem('userRole', response.data.user.role);
          }
        }
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async register(userData) {
    try {
      // Log the request data for debugging
      console.log('Registration request data:', userData);

      // Ensure required fields are present
      const requiredFields = ['firstName', 'lastName', 'email', 'password', 'role'];
      const missingFields = requiredFields.filter(field => !userData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Format the request data
      const formattedData = {
        firstName: userData.firstName.trim(),
        lastName: userData.lastName.trim(),
        email: userData.email.toLowerCase().trim(),
        password: userData.password,
        role: userData.role,
        phone: userData.phone || ''
      };

      const response = await api.post('/api/auth/register', formattedData);
      console.log('Registration response:', response.data);

      if (response.data.success && response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        if (response.data.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.data.user));
          if (response.data.data.user.role) {
            localStorage.setItem('userRole', response.data.data.user.role);
          }
        }
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error details:', error.response?.data || error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('An unexpected error occurred during registration');
      }
    }
  }

  async logout() {
    try {
      await api.post('/api/auth/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
    }
  }

  async getCurrentUser() {
    try {
      const response = await api.get('/api/auth/me');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async refreshToken() {
    try {
      const response = await api.post('/api/auth/refresh-token');
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
          if (response.data.user.role) {
            localStorage.setItem('userRole', response.data.user.role);
          }
        }
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProfile(userData) {
    try {
      const response = await api.put('/api/auth/profile', userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response?.status === 401) {
      // Don't remove token here as it's handled by the API interceptor
      return {
        message: error.response?.data?.message || 'Authentication failed',
        status: error.response?.status,
        data: error.response?.data
      };
    }
    return {
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status,
      data: error.response?.data
    };
  }
}

export default new AuthService(); 