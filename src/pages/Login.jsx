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
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Login
          </Typography>

          {(error || authError) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error || authError}
            </Alert>
          )}

          {loginAttempts > 0 && loginAttempts < 5 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Failed login attempts: {loginAttempts}/5
              {loginAttempts === 4 && ' - Next failed attempt will lock your account for 1 hour'}
            </Alert>
          )}

          {lockUntil && (
            <Box sx={{ mb: 2 }}>
              <Alert severity="error">
                {getRemainingLockTime()}
              </Alert>
              <LinearProgress sx={{ mt: 1 }} />
            </Box>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              margin="normal"
              required
              autoComplete="username"
              disabled={isSubmitting || authLoading || !!lockUntil}
              error={!!error && !email}
              helperText={!!error && !email ? 'Email is required' : ''}
              InputProps={{
                autoCapitalize: 'none'
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              autoComplete="current-password"
              disabled={isSubmitting || authLoading || !!lockUntil}
              error={!!error && !password}
              helperText={!!error && !password ? 'Password is required' : ''}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting || authLoading || !!lockUntil}
            >
              {(isSubmitting || authLoading) ? <CircularProgress size={24} /> : 'Login'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button
                component={Link}
                to="/forgot-password"
                color="primary"
                disabled={isSubmitting || authLoading}
                sx={{ mb: 1 }}
              >
                Forgot Password?
              </Button>
              <br />
              <Button
                component={Link}
                to="/register"
                color="primary"
                disabled={isSubmitting || authLoading}
              >
                Don't have an account? Register
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
