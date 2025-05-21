import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react';
import api from '../services/api';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  const handleLogout = (errorMessage = null) => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    if (errorMessage) setError(errorMessage);
  };

  const checkAuthStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (!token || !storedUser) {
        handleLogout();
        return;
      }

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const userData = JSON.parse(storedUser);

      try {
        const response = await api.get('/auth/me');
        if (response.data?.success) {
          const updatedUser = { ...userData, ...response.data.user };
          setUser(updatedUser);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(updatedUser));
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

  const login = async (token, userData) => {
    try {
      if (lockUntil && new Date(lockUntil) > new Date()) {
        const timeLeft = Math.ceil((new Date(lockUntil) - new Date()) / 60000);
        throw new Error(`Account is temporarily locked. Please try again in ${timeLeft} minutes.`);
      }

      setError(null);
      setLoading(true);

      const requiredFields = ['email', 'password', 'role'];
      const missingFields = requiredFields.filter(field => !userData?.[field]);
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      if (!emailRegex.test(userData.email)) {
        throw new Error('Invalid email format');
      }

      if (userData.password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      const response = await api.post('/auth/login', {
        email: userData.email,
        password: userData.password
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Login failed');
      }

      setLoginAttempts(0);
      setLockUntil(null);

      localStorage.setItem('token', token);
      localStorage.setItem('userRole', userData.role);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return { success: true, role: userData.role };
    } catch (err) {
      console.error('Login error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });

      if (err.response?.data?.message?.includes('locked')) {
        setLockUntil(new Date(Date.now() + 60 * 60 * 1000));
      } else {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);

        if (newAttempts >= 5) {
          setLockUntil(new Date(Date.now() + 60 * 60 * 1000));
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
