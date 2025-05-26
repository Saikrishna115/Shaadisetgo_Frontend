import api from './api/config';

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { token, user, role } = response.data;

    // Clear any existing auth data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');

    // Store new auth data
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userRole', role);

    // Set auth header for future requests
    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (userData) => {
  try {
    // Transform firstName and lastName into name for backend
    const transformedData = {
      ...userData,
      name: `${userData.firstName} ${userData.lastName}`,
    };

    const response = await api.post('/auth/register', transformedData);
    const { token, user, role } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userRole', role);

    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    // Continue with local cleanup even if server logout fails
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    delete api.defaults.headers.common.Authorization;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    // If API call fails, try to get user from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user);
    }
    throw error;
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!token && !!user;
};