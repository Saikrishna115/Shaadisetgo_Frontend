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
import Logo from '../components/Logo';
import './Login.css';

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
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
    try {
      await dispatch(login({ email, password })).unwrap();
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
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
              <Box sx={{ mb: 4, transform: 'scale(1.2)' }}>
                <Logo />
              </Box>

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

              {error && (
                <Fade in>
                  <Alert 
                    severity="error" 
                    sx={{ 
                      width: '100%',
                      borderRadius: 2,
                      '& .MuiAlert-message': { width: '100%' }
                    }}
                  >
                    {error}
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
