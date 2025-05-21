import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../store/slices/authSlice';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  useTheme,
  Fade,
  Card,
  CardContent
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Login as LoginIcon
} from '@mui/icons-material';
import './Login.css';
import api from '../services/api/config';

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user && user.role) {
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
          setError(`Invalid user role: ${user.role}`);
          console.error('Invalid user role:', user.role);
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || loading) return;
    
    setIsSubmitting(true);
    setError(''); // Clear any previous errors
    
    try {
      // Use the login action from authSlice
      const result = await dispatch(login({ email, password })).unwrap();
      
      if (!result.user || !result.user.role) {
        throw new Error('Invalid user data received');
      }

      // Role-based navigation will be handled by the useEffect above
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
      // Clear any stored data in case of error
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('user');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container 
      maxWidth="xs" 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center',
        mt: { xs: 8, sm: 12 }, // Add top margin to prevent navbar overlap
        mb: { xs: 4, sm: 6 }   // Add bottom margin for better spacing
      }}
    >
      <Fade in timeout={800}>
        <Card 
          elevation={8}
          sx={{
            width: '100%',
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 600,
                  color: theme.palette.primary.main,
                  letterSpacing: '0.5px',
                  mb: 2
                }}
              >
                ShaadiSetGo
              </Typography>

              <Typography
                component="h1"
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  mb: 1,
                  textAlign: 'center'
                }}
              >
                Welcome Back
              </Typography>
              
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 3, textAlign: 'center' }}
              >
                Sign in to continue to your account
              </Typography>

              {errorMessage && (
                <Fade in>
                  <Alert 
                    severity="error" 
                    sx={{ 
                      width: '100%',
                      borderRadius: 2,
                      '& .MuiAlert-message': { width: '100%' }
                    }}
                  >
                    {errorMessage}
                  </Alert>
                </Fade>
              )}

              <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
                
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading || isSubmitting}
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    borderRadius: 2,
                    position: 'relative'
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : (
                    <>
                      Sign In
                      <LoginIcon sx={{ ml: 1 }} />
                    </>
                  )}
                </Button>

                <Box sx={{ width: '100%', my: 2 }}>
                  <Divider>
                    <Typography variant="body2" color="text.secondary">
                      OR
                    </Typography>
                  </Divider>
                </Box>

                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Link 
                    to="/forgot-password" 
                    style={{ 
                      textDecoration: 'none',
                      color: theme.palette.primary.main
                    }}
                  >
                    <Typography variant="body2">
                      Forgot password?
                    </Typography>
                  </Link>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      Don't have an account?
                    </Typography>
                    <Link
                      to="/register"
                      style={{
                        textDecoration: 'none',
                        color: theme.palette.primary.main,
                        fontWeight: 600
                      }}
                    >
                      Sign Up
                    </Link>
                  </Box>
                </Box>
              </form>
            </Box>
          </CardContent>
        </Card>
      </Fade>
    </Container>
  );
};

export default Login;
