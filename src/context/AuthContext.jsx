import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(response.data);
      setError(null);
    } catch (err) {
      console.error('Auth check failed:', err);
      setError('Authentication failed');
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      setUser(userData);
      setError(null);
      return true;
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', userData);
      const { token, user: newUser } = response.data;
      localStorage.setItem('token', token);
      setUser(newUser);
      setError(null);
      return true;
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const value = useMemo(() => ({
    user,
    loading,
    error,
    login,
    logout,
    register,
    checkAuthStatus
  }), [user, loading, error]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
