import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../utils/axios'; // Axios with interceptors

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
      const response = await axios.get('/auth/me');
      setUser(response.data);
    } catch (err) {
      console.error('Auth check failed:', err.response?.data || err.message);
      let errorMessage = 'Authentication failed';
      
      if (!err.response) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (err.response.status === 401) {
        errorMessage = 'Session expired. Please login again.';
      } else if (err.response.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const response = await axios.post('/auth/login', { email, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userRole', user.role); // Store user role for persistent role checks
      setUser(user);
      return true;
    } catch (err) {
      console.error('Login error:', err.response?.data?.message || err.message);
      let errorMessage = 'Login failed';
      
      if (!err.response) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (err.response.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (err.response.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
      throw err; // Propagate error to handle in component
    } finally {
      setLoading(false);
    }
  };

  const logout = async (navigate) => {
    try {
      // Clear all auth-related state
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      setUser(null);
      setError(null);
      
      // Attempt to notify the server about logout
      try {
        await axios.post('/auth/logout');
      } catch (err) {
        // Silently handle server logout failure
        console.warn('Server logout failed:', err.message);
      }

      // Navigate to login page
      if (navigate) {
        navigate('/login');
      }
      return true;
    } catch (err) {
      console.error('Logout error:', err);
      // Ensure user is logged out locally even if there's an error
      localStorage.removeItem('token');
      setUser(null);
      if (navigate) {
        navigate('/login');
      }
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
