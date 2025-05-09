import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../utils/axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');
      
      if (!token || !userRole) {
        setLoading(false);
        return;
      }

      const response = await axios.get('/auth/me');

      if (response.data) {
        setUser({ ...response.data, role: userRole });
      }
    } catch (err) {
      console.error('Auth status check failed:', err);
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await axios.post('/auth/login', {
        email,
        password
      });

      if (response.data.token && response.data.user) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', response.data.user.role);
        setUser({ ...response.data.user, role: response.data.user.role });
        return true;
      }
      return false;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};