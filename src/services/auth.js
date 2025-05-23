import api from './api/config';

export const login = async (credentials) => {
  try {
    const response = await api.post('/api/auth/login', credentials);
    const { token, user } = response.data;

    if (!token || !user) {
      throw new Error('Invalid response from server');
    }

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return { success: true, user };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/api/auth/register', userData);
    const { token, user } = response.data;

    if (!token || !user) {
      throw new Error('Invalid response from server');
    }

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return { success: true, user };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const logout = async () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    return { success: true };
  } catch (error) {
    throw new Error('Failed to logout');
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/api/auth/me');
    // Update local storage with latest user data
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data.user;
  } catch (error) {
    // If the API call fails, fall back to local storage
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const refreshToken = async () => {
  try {
    const response = await api.post('/api/auth/refresh-token');
    const { token, user } = response.data;

    if (!token || !user) {
      throw new Error('Invalid response from server');
    }

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return { success: true, user };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to refresh token');
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/api/auth/profile', profileData);
    const { user } = response.data;

    if (!user) {
      throw new Error('Invalid response from server');
    }

    localStorage.setItem('user', JSON.stringify(user));
    return { success: true, user };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};