import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';
import './Register.css';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('customer');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    businessName: '',
    ownerName: '',
    serviceCategory: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role
      };

      if (role === 'vendor') {
        payload.businessName = formData.businessName;
        payload.ownerName = formData.ownerName;
        payload.serviceCategory = formData.serviceCategory;
        payload.address = formData.address;
        payload.city = formData.city;
        payload.state = formData.state;
        payload.zipCode = formData.zipCode;
      }

      const response = await api.post('/auth/register', payload);
      login(response.data.token, response.data.user);
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || err.response?.data?.fields?.join(', ') || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Register
        </Typography>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Role</InputLabel>
          <Select
            value={role}
            label="Role"
            onChange={handleRoleChange}
          >
            <MenuItem value="customer">Customer</MenuItem>
            <MenuItem value="vendor">Vendor</MenuItem>
          </Select>
        </FormControl>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            margin="normal"
            required
          />

          {role === 'vendor' && (
            <>
              <TextField
                fullWidth
                label="Business Name"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                margin="normal"
                required
              />

              <TextField
                fullWidth
                label="Owner Name"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                margin="normal"
                required
              />

              <TextField
                fullWidth
                label="Service Category"
                name="serviceCategory"
                value={formData.serviceCategory}
                onChange={handleChange}
                margin="normal"
                required
              />

              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                margin="normal"
                required
              />

              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                margin="normal"
                required
              />

              <TextField
                fullWidth
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                margin="normal"
                required
              />

              <TextField
                fullWidth
                label="Zip Code"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                margin="normal"
                required
              />
            </>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Register'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
