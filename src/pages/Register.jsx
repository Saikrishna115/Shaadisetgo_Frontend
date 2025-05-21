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
import api from '../services/api/config';

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
      hasSpecial: /[^a-zA-Z0-9]/.test(password),
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

      // Validate required fields
      const requiredFields = ['fullName', 'email', 'password', 'phone'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      // Validate password match
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Validate password strength
      if (!validatePassword(formData.password)) {
        throw new Error('Password must be at least 8 characters long and contain uppercase, lowercase, number and special character');
      }

      // Validate email format
      if (!validateEmail(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Validate phone format
      if (!validatePhone(formData.phone)) {
        throw new Error('Please enter a valid 10-digit phone number');
      }

      // Split fullName into firstName and lastName
      const [firstName, ...lastNameParts] = formData.fullName.trim().split(' ');
      const lastName = lastNameParts.join(' ');

      if (!firstName || !lastName) {
        throw new Error('Please enter both first name and last name');
      }

      // Format the registration data
      const userData = {
        firstName,
        lastName,
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: formData.role
      };

      console.log('Sending registration data:', userData);

      const response = await api.post('/api/auth/register', userData);
      console.log('Registration response:', response.data);

      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', formData.role);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

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

          const vendorResponse = await api.post('/api/vendors', vendorData);
          localStorage.setItem('user', JSON.stringify({
            ...response.data.user,
            vendorProfile: vendorResponse.data.vendor
          }));
          navigate('/vendor/dashboard');
        } else {
          localStorage.setItem('user', JSON.stringify(response.data.user));
          navigate('/dashboard');
        }
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    const commonBoxStyles = {
      p: { xs: 1.5, sm: 2 },
      bgcolor: theme.palette.background.default,
      borderRadius: 1,
      mb: { xs: 2, sm: 3 }
    };

    const commonTypographyStyles = {
      fontSize: { xs: '0.875rem', sm: '1rem' }
    };

    const commonInputProps = {
      sx: { 
        bgcolor: 'white',
        '& .MuiInputLabel-root': {
          fontSize: { xs: '0.875rem', sm: '1rem' }
        },
        '& .MuiInputBase-input': {
          fontSize: { xs: '0.875rem', sm: '1rem' }
        }
      }
    };

    switch (step) {
      case 0:
        return (
          <Fade in={true}>
            <Box>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  mb: { xs: 2, sm: 3 }, 
                  color: theme.palette.primary.main,
                  fontSize: { xs: '1.125rem', sm: '1.25rem' }
                }}
              >
                Tell us about yourself
              </Typography>
              
              <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
                <Grid item xs={12}>
                  <Box sx={commonBoxStyles}>
                    <Typography 
                      variant="subtitle1" 
                      gutterBottom 
                      sx={{ 
                        color: theme.palette.text.secondary,
                        ...commonTypographyStyles
                      }}
                    >
                      Personal Information
                    </Typography>
                    <Grid container spacing={{ xs: 1.5, sm: 2 }}>
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
                          InputProps={commonInputProps}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
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
                          InputProps={commonInputProps}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
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
                          InputProps={commonInputProps}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={commonBoxStyles}>
                    <Typography 
                      variant="subtitle1" 
                      gutterBottom 
                      sx={{ 
                        color: theme.palette.text.secondary,
                        ...commonTypographyStyles
                      }}
                    >
                      Account Type
                    </Typography>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel sx={commonTypographyStyles}>I am a</InputLabel>
                      <Select
                        value={formData.role}
                        onChange={handleChange}
                        name="role"
                        label="I am a"
                        sx={{ 
                          bgcolor: 'white',
                          '& .MuiSelect-select': {
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                          }
                        }}
                      >
                        <MenuItem value="customer">
                          <Box sx={{ py: { xs: 0.5, sm: 1 } }}>
                            <Typography variant="subtitle2" sx={commonTypographyStyles}>
                              Customer
                            </Typography>
                            <Typography 
                              variant="caption" 
                              color="text.secondary"
                              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                            >
                              Looking to book wedding services
                            </Typography>
                          </Box>
                        </MenuItem>
                        <MenuItem value="vendor">
                          <Box sx={{ py: { xs: 0.5, sm: 1 } }}>
                            <Typography variant="subtitle2" sx={commonTypographyStyles}>
                              Vendor
                            </Typography>
                            <Typography 
                              variant="caption" 
                              color="text.secondary"
                              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                            >
                              Offering wedding services
                            </Typography>
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        );

      case 1:
        return (
          <Fade in={true}>
            <Box>
              <Typography variant="h6" gutterBottom sx={{ mb: 3, color: theme.palette.primary.main }}>
                Secure your account
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box sx={{ 
                    p: 2, 
                    bgcolor: theme.palette.background.default,
                    borderRadius: 1
                  }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ color: theme.palette.text.secondary }}>
                      Password Setup
                    </Typography>
                    <Grid container spacing={2}>
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
                          InputProps={{
                            sx: { bgcolor: 'white' }
                          }}
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
                          InputProps={{
                            sx: { bgcolor: 'white' }
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ bgcolor: theme.palette.background.default }}>
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom sx={{ color: theme.palette.text.secondary }}>
                        Password Requirements
                      </Typography>
                      <Grid container spacing={1}>
                        {Object.entries(validations.password).map(([key, valid]) => (
                          <Grid item xs={12} sm={6} key={key}>
                            <Box display="flex" alignItems="center">
                              <Chip
                                size="small"
                                icon={valid ? <CheckIcon /> : undefined}
                                label={key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                color={valid ? 'success' : 'default'}
                                variant={valid ? 'filled' : 'outlined'}
                                sx={{ width: '100%', justifyContent: 'flex-start' }}
                              />
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        );

      case 2:
        return formData.role === 'vendor' ? (
          <Fade in={true}>
            <Box>
              <Typography variant="h6" gutterBottom sx={{ mb: 3, color: theme.palette.primary.main }}>
                Tell us about your business
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box sx={{ 
                    p: 2, 
                    bgcolor: theme.palette.background.default,
                    borderRadius: 1
                  }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ color: theme.palette.text.secondary }}>
                      Business Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Business Name"
                          name="businessName"
                          value={formData.businessName}
                          onChange={handleChange}
                          required
                          variant="outlined"
                          placeholder="Enter your business name"
                          InputProps={{
                            sx: { bgcolor: 'white' }
                          }}
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
                            sx={{ bgcolor: 'white' }}
                          >
                            {serviceCategories.map((category) => (
                              <MenuItem key={category} value={category}>
                                {category}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ 
                    p: 2, 
                    bgcolor: theme.palette.background.default,
                    borderRadius: 1
                  }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ color: theme.palette.text.secondary }}>
                      Location Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="City"
                          name="location.city"
                          value={formData.location.city}
                          onChange={handleChange}
                          required
                          variant="outlined"
                          placeholder="Enter city"
                          InputProps={{
                            sx: { bgcolor: 'white' }
                          }}
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
                          placeholder="Enter state"
                          InputProps={{
                            sx: { bgcolor: 'white' }
                          }}
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
                          placeholder="Enter complete business address"
                          InputProps={{
                            sx: { bgcolor: 'white' }
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ 
                    p: 2, 
                    bgcolor: theme.palette.background.default,
                    borderRadius: 1
                  }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ color: theme.palette.text.secondary }}>
                      Service Details
                    </Typography>
                    <TextField
                      fullWidth
                      label="Service Description"
                      name="serviceDescription"
                      value={formData.serviceDescription}
                      onChange={handleChange}
                      variant="outlined"
                      multiline
                      rows={4}
                      placeholder="Describe your services, experience, and what makes your business unique..."
                      InputProps={{
                        sx: { bgcolor: 'white' }
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        ) : (
          <Fade in={true}>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" gutterBottom color="primary">
                🎉 Almost there!
              </Typography>
              <Typography variant="body1" gutterBottom>
                Your account is ready to be created. Click 'Complete' to finish registration and start planning your dream wedding!
              </Typography>
            </Box>
          </Fade>
        );

      default:
        return null;
    }
  };

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        py: { xs: 8, sm: 12 },  // Add padding top and bottom
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <Card 
        elevation={8}
        sx={{
          borderRadius: 2,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography 
            variant="h4" 
            align="center" 
            gutterBottom 
            sx={{ 
              fontWeight: 600,
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
            }}
          >
            Create Your Account
          </Typography>
          
          <Stepper 
            activeStep={activeStep} 
            sx={{ 
              mt: { xs: 2, sm: 3, md: 4 }, 
              mb: { xs: 2, sm: 3, md: 4 },
              '& .MuiStepLabel-root .Mui-completed': {
                color: theme.palette.success.main
              },
              '& .MuiStepLabel-root .Mui-active': {
                color: theme.palette.primary.main
              },
              // Mobile stepper adjustments
              '& .MuiStepLabel-label': {
                fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
              },
              // Hide step numbers on mobile, show only labels
              '& .MuiStepIcon-root': {
                display: { xs: 'none', sm: 'block' }
              }
            }}
            alternativeLabel  // Better for mobile
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: { xs: 2, sm: 3 },
                borderRadius: 1,
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              {error}
            </Alert>
          )}

          <Box sx={{ mt: { xs: 2, sm: 3, md: 4 } }}>
            {renderStepContent(activeStep)}
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              mt: { xs: 2, sm: 3, md: 4 },
              px: { xs: 0, sm: 2 }
            }}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0 || loading}
                sx={{
                  px: { xs: 2, sm: 3, md: 4 },
                  '&.Mui-disabled': {
                    opacity: 0
                  }
                }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!validateStep() || loading}
                endIcon={loading && <CircularProgress size={20} />}
                sx={{ 
                  px: { xs: 2, sm: 3, md: 4 },
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                {activeStep === steps.length - 1 ? 'Complete' : 'Next'}
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: { xs: 2, sm: 3, md: 4 } }} />

          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="body2" 
              color="textSecondary"
              sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
            >
              Already have an account?{' '}
              <Link 
                to="/login" 
                style={{ 
                  textDecoration: 'none', 
                  color: theme.palette.primary.main,
                  fontWeight: 500
                }}
              >
                Login here
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Register; 