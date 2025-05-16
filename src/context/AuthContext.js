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
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      const response = await api.get('/auth/me');
      if (response.data && response.data.role) {
        setUser(response.data);
        setIsAuthenticated(true);
      } else {
        console.warn('Unexpected user data:', response.data);
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      setError(
        err.response?.data?.message ||
        (err.response?.status === 401
          ? 'Session expired. Please login again.'
          : 'Authentication failed')
      );
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const response = await api.post('/auth/login', { email, password });
      
      // Check if the response has the expected structure
      if (!response.data.success) {
        throw new Error(response.data.message || 'Login failed');
      }

      const { token, user: userData } = response.data;

      if (!userData || !userData.role) {
        throw new Error('Login succeeded but user role is missing.');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('userRole', userData.role);
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true, role: userData.role };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed. Please try again.';
      setError(message);
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
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
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
