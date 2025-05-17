import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Card,
  CardContent,
  Fade,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Divider,
  useTheme,
  Chip
} from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';
import api from '../services/api';

const Register = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    businessName: '',
    serviceCategory: '',
    location: {
      city: '',
      state: '',
      address: ''
    },
    serviceDescription: ''
  });

  const [validations, setValidations] = useState({
    password: {
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumber: false,
      hasSpecial: false,
      hasLength: false
    },
    email: false,
    phone: false
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const serviceCategories = [
    'Venue',
    'Catering',
    'Photography',
    'DJ',
    'Decor',
    'Other'
  ];

  const steps = ['Basic Information', 'Account Setup', formData.role === 'vendor' ? 'Business Details' : 'Preferences'];

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setValidations(prev => ({ ...prev, email: emailRegex.test(email) }));
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    setValidations(prev => ({ ...prev, phone: phoneRegex.test(phone) }));
    return phoneRegex.test(phone);
  };

  const validatePassword = (password) => {
    const validations = {
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[@$!%*?&]/.test(password),
      hasLength: password.length >= 8
    };
    setValidations(prev => ({ ...prev, password: validations }));
    return Object.values(validations).every(Boolean);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));

      // Validate fields as they change
      if (name === 'email') validateEmail(value);
      if (name === 'phone') validatePhone(value);
      if (name === 'password') validatePassword(value);
    }
  };

  const validateStep = () => {
    switch (activeStep) {
      case 0:
        return formData.fullName && validateEmail(formData.email) && validatePhone(formData.phone);
      case 1:
        return validatePassword(formData.password) && formData.password === formData.confirmPassword;
      case 2:
        if (formData.role === 'vendor') {
          return formData.businessName && formData.serviceCategory && formData.location.city && formData.location.state;
        }
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      if (activeStep === steps.length - 1) {
        handleSubmit();
      } else {
        setActiveStep(prev => prev + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      setError('');
      setLoading(true);

      const userData = {
        fullName: formData.fullName,
        email: formData.email.toLowerCase(),
        phone: formData.phone,
        password: formData.password,
        role: formData.role
      };

      const response = await api.post('/auth/register', userData);

      if (response.data && response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('userRole', formData.role);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;

        if (formData.role === 'vendor') {
          const vendorData = {
            businessName: formData.businessName,
            ownerName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            serviceCategory: formData.serviceCategory,
            location: formData.location,
            serviceDescription: formData.serviceDescription
          };

          const vendorResponse = await api.post('/vendors', vendorData);
          localStorage.setItem('user', JSON.stringify({
            ...response.data.data.user,
            vendorProfile: vendorResponse.data.vendor
          }));
          navigate('/vendor/dashboard');
        } else {
          localStorage.setItem('user', JSON.stringify(response.data.data.user));
          navigate('/dashboard');
        }
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Fade in={true}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  placeholder="Enter your full name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  placeholder="Enter your email address"
                  error={formData.email && !validations.email}
                  helperText={formData.email && !validations.email ? 'Please enter a valid email address' : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  placeholder="Enter your 10-digit phone number"
                  error={formData.phone && !validations.phone}
                  helperText={formData.phone && !validations.phone ? 'Please enter a valid 10-digit phone number' : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>I am a</InputLabel>
                  <Select
                    value={formData.role}
                    onChange={handleChange}
                    name="role"
                    label="I am a"
                  >
                    <MenuItem value="customer">Customer</MenuItem>
                    <MenuItem value="vendor">Vendor</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Fade>
        );

      case 1:
        return (
          <Fade in={true}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  error={formData.confirmPassword && formData.password !== formData.confirmPassword}
                  helperText={formData.confirmPassword && formData.password !== formData.confirmPassword ? 'Passwords do not match' : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      Password Requirements:
                    </Typography>
                    <Grid container spacing={1}>
                      {Object.entries(validations.password).map(([key, valid]) => (
                        <Grid item xs={12} key={key}>
                          <Box display="flex" alignItems="center">
                            <Chip
                              size="small"
                              icon={valid ? <CheckIcon /> : undefined}
                              label={key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                              color={valid ? 'success' : 'default'}
                              variant={valid ? 'filled' : 'outlined'}
                            />
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Fade>
        );

      case 2:
        return formData.role === 'vendor' ? (
          <Fade in={true}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Business Name"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Service Category</InputLabel>
                  <Select
                    value={formData.serviceCategory}
                    onChange={handleChange}
                    name="serviceCategory"
                    label="Service Category"
                    required
                  >
                    {serviceCategories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Business Address"
                  name="location.address"
                  value={formData.location.address}
                  onChange={handleChange}
                  variant="outlined"
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Service Description"
                  name="serviceDescription"
                  value={formData.serviceDescription}
                  onChange={handleChange}
                  variant="outlined"
                  multiline
                  rows={4}
                  placeholder="Tell us about your services..."
                />
              </Grid>
            </Grid>
          </Fade>
        ) : (
          <Fade in={true}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="body1" gutterBottom>
                  Your account is ready! Click 'Complete' to finish registration.
                </Typography>
              </Grid>
            </Grid>
          </Fade>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Create Your Account
          </Typography>
          
          <Stepper activeStep={activeStep} sx={{ mt: 4, mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mt: 4 }}>
            {renderStepContent(activeStep)}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0 || loading}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!validateStep() || loading}
                endIcon={loading && <CircularProgress size={20} />}
              >
                {activeStep === steps.length - 1 ? 'Complete' : 'Next'}
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              Already have an account?{' '}
              <Link to="/login" style={{ textDecoration: 'none', color: theme.palette.primary.main }}>
                Login here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register; 