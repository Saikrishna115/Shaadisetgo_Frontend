import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (!token || !storedUser) {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      // Parse stored user data
      const userData = JSON.parse(storedUser);

      try {
        const response = await api.get('/auth/me');
        if (response.data && response.data.role) {
          setUser({ ...response.data, ...userData });
          setIsAuthenticated(true);
        } else {
          console.warn('Unexpected user data:', response.data);
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          localStorage.removeItem('user');
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('user');
        setError(
          err.response?.data?.message ||
          (err.response?.status === 401
            ? 'Session expired. Please login again.'
            : 'Authentication failed')
        );
      }
    } catch (err) {
      console.error('Auth check error:', err);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      console.log('Attempting login:', { email });
      
      const response = await api.post('/auth/login', { email, password });
      console.log('Login response:', response.data);
      
      if (!response.data.success) {
        console.error('Login failed:', response.data.message);
        throw new Error(response.data.message || 'Login failed');
      }

      const { token, user: userData } = response.data;

      if (!userData || !userData.role) {
        console.error('Invalid user data:', userData);
        throw new Error('Login succeeded but user role is missing.');
      }

      // Store all necessary data
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', userData.role);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update auth state
      setUser(userData);
      setIsAuthenticated(true);
      
      // Update API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return { success: true, role: userData.role };
    } catch (err) {
      console.error('Login error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      setError(err.response?.data?.message || err.message || 'Login failed. Please try again.');
      setIsAuthenticated(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (navigate) => {
    try {
      setLoading(true);
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('Server logout failed:', err?.message);
    } finally {
      // Clear all auth data
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      setLoading(false);
      if (navigate) navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      login, 
      logout,
      isAuthenticated,
      checkAuthStatus 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
