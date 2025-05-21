import api from './config';

class AuthService {
  async login(credentials) {
    try {
      const response = await api.post('/api/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
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
      const requiredFields = ['fullName', 'email', 'password', 'role'];
      const missingFields = requiredFields.filter(field => !userData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Format the request data
      const formattedData = {
        fullName: userData.fullName,
        email: userData.email.toLowerCase(),
        password: userData.password,
        role: userData.role,
        phone: userData.phone || ''
      };

      const response = await api.post('/api/auth/register', formattedData);
      console.log('Registration response:', response.data);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Registration error details:', error.response?.data);
      throw this.handleError(error);
    }
  }

  async logout() {
    try {
      await api.post('/api/auth/logout');
      localStorage.removeItem('token');
    } catch (error) {
      localStorage.removeItem('token');
      throw this.handleError(error);
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
      localStorage.removeItem('token');
    }
    return {
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status,
      data: error.response?.data
    };
  }
}

export default new AuthService(); 