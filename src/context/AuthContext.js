import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState(null);

  const checkAuthStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (!token || !storedUser) {
        handleLogout();
        return;
      }

      // Set token in API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Parse stored user data
      const userData = JSON.parse(storedUser);

      try {
        const response = await api.get('/auth/me');
        if (response.data && response.data.success) {
          const updatedUser = { ...userData, ...response.data.user };
          setUser(updatedUser);
          setIsAuthenticated(true);
          // Update stored user data
          localStorage.setItem('user', JSON.stringify(updatedUser));
          // Reset login attempts on successful auth check
          setLoginAttempts(0);
          setLockUntil(null);
        } else {
          handleLogout('Session expired. Please login again.');
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        if (err.response?.status === 401) {
          handleLogout('Session expired. Please login again.');
        } else {
          // For other errors, keep the user logged in but show error
          setError(err.response?.data?.message || 'Authentication check failed');
        }
      }
    } catch (err) {
      console.error('Auth check error:', err);
      handleLogout('Authentication check failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const handleLogout = (errorMessage = null) => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    if (errorMessage) {
      setError(errorMessage);
    }
  };

  const login = async (email, password) => {
    try {
      // Check if account is locked
      if (lockUntil && new Date(lockUntil) > new Date()) {
        const timeLeft = Math.ceil((new Date(lockUntil) - new Date()) / 1000 / 60);
        throw new Error(`Account is temporarily locked. Please try again in ${timeLeft} minutes.`);
      }

      setError(null);
      setLoading(true);
      
      const response = await api.post('/auth/login', { email, password });
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Login failed');
      }

      const { token, user: userData } = response.data;

      if (!userData || !userData.role) {
        throw new Error('Invalid user data received');
      }

      // Reset login attempts on successful login
      setLoginAttempts(0);
      setLockUntil(null);

      // Store auth data
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

      // Handle account locking
      if (err.response?.data?.message?.includes('locked')) {
        setLockUntil(new Date(Date.now() + 60 * 60 * 1000)); // 1 hour lock
      } else {
        // Increment login attempts
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        
        // Lock account after 5 failed attempts
        if (newAttempts >= 5) {
          setLockUntil(new Date(Date.now() + 60 * 60 * 1000)); // 1 hour lock
          setError('Too many failed attempts. Account is locked for 1 hour.');
          throw new Error('Too many failed attempts. Account is locked for 1 hour.');
        }
      }
      
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
      handleLogout();
      if (navigate) navigate('/login');
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
    checkAuthStatus,
    loginAttempts,
    lockUntil,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
