import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../utils/axios';

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

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('/auth/user'); // ✅ CORRECTED ENDPOINT
      if (response.data && response.data.role) {
        setUser(response.data);
      } else {
        console.warn('Unexpected user data:', response.data);
        setUser(null);
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.response?.status === 401
          ? 'Session expired. Please login again.'
          : 'Authentication failed');
      console.error('Auth check failed:', message);
      setError(message);
      logout(); // clear user & token
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data;

      if (!user || !user.role) {
        throw new Error('Login succeeded but user role is missing.');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('userRole', user.role);
      setUser(user);
      return true;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.response?.status === 401
          ? 'Invalid email or password.'
          : 'Login failed. Please try again.');
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (navigate) => {
    try {
      localStorage.clear();
      setUser(null);
      setError(null);
      try {
        await axios.post('/api/auth/logout');
      } catch (err) {
        console.warn('Server logout failed:', err?.message);
      }
      if (navigate) navigate('/login');
    } catch {
      localStorage.clear();
      setUser(null);
      if (navigate) navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
