import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
  LinearProgress
} from '@mui/material';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, user, loading: authLoading, error: authError, loginAttempts, lockUntil } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      // Ensure proper role-based navigation
      switch (user.role) {
        case 'vendor':
          navigate('/vendor/dashboard', { replace: true });
          break;
        case 'admin':
          navigate('/admin', { replace: true });
          break;
        case 'customer':
          navigate('/dashboard', { replace: true });
          break;
        default:
          console.error('Unknown user role:', user.role);
          navigate('/');
      }
    }
  }, [user, authLoading, navigate]);

  // Calculate remaining lock time
  const getRemainingLockTime = () => {
    if (!lockUntil) return null;
    const now = new Date();
    const lockTime = new Date(lockUntil);
    if (lockTime <= now) return null;
    
    const minutes = Math.ceil((lockTime - now) / 1000 / 60);
    return `Account is locked. Please try again in ${minutes} minute${minutes !== 1 ? 's' : ''}.`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || authLoading) return;
    
    // Check if account is locked
    const lockMessage = getRemainingLockTime();
    if (lockMessage) {
      setError(lockMessage);
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      // Basic validation
      if (!email || !password) {
        throw new Error('Please fill in all fields');
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      await login(email, password);
      // Navigation is handled by useEffect
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container d-flex">
      <div className="login-image-section d-flex align-items-center justify-content-center"></div>
      
      <div className="login-form-wrapper d-flex flex-column justify-content-center">
        <Typography variant="h4" className="text-center mb-4">
          Login
        </Typography>

        {(error || authError) && (
          <div className="message message-error mb-3">
            {error || authError}
          </div>
        )}

        {loginAttempts > 0 && loginAttempts < 5 && (
          <div className="message message-warning mb-3">
            Failed login attempts: {loginAttempts}/5
            {loginAttempts === 4 && ' - Next failed attempt will lock your account for 1 hour'}
          </div>
        )}

        {lockUntil && (
          <Box className="mb-3">
            <div className="message message-error">
              {getRemainingLockTime()}
            </div>
            <LinearProgress className="mt-2" />
          </Box>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              required
              autoComplete="username"
              disabled={isSubmitting || authLoading || !!lockUntil}
              autoCapitalize="none"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={isSubmitting || authLoading || !!lockUntil}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 mt-4 mb-3"
            disabled={isSubmitting || authLoading || !!lockUntil}
          >
            {(isSubmitting || authLoading) ? <CircularProgress size={24} /> : 'Login'}
          </button>

          <div className="text-center mt-3">
            <Link to="/forgot-password" className="d-block mb-2">
              Forgot Password?
            </Link>
            <Link to="/register">
              Don't have an account? Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
