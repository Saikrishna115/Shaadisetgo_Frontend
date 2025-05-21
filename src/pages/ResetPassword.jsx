import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import api from '../services/api/config';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const passwordRequirements = [
    {
      label: 'At least 8 characters long',
      test: (pass) => pass.length >= 8
    },
    {
      label: 'Contains an uppercase letter',
      test: (pass) => /[A-Z]/.test(pass)
    },
    {
      label: 'Contains a lowercase letter',
      test: (pass) => /[a-z]/.test(pass)
    },
    {
      label: 'Contains a number',
      test: (pass) => /\d/.test(pass)
    },
    {
      label: 'Contains a special character (@$!%*?&)',
      test: (pass) => /[@$!%*?&]/.test(pass)
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validate password
    if (!passwordRequirements.every(req => req.test(password))) {
      setError('Please ensure your password meets all requirements.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/users/reset-password', {
        token,
        password
      });
      
      setSuccess(response.data.message || 'Password has been reset successfully.');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Reset Password
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />
            
            <List dense sx={{ mb: 2 }}>
              {passwordRequirements.map((req, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    {req.test(password) ? (
                      <CheckIcon color="success" />
                    ) : (
                      <CloseIcon color="error" />
                    )}
                  </ListItemIcon>
                  <ListItemText primary={req.label} />
                </ListItem>
              ))}
            </List>

            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
              required
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'Reset Password'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default ResetPassword; 