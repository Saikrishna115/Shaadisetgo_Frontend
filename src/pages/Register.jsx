import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register } from '../store/slices/authSlice';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Box,
} from '@mui/material';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    businessName: '',
    businessType: '',
    businessAddress: '',
  });

  const [validationErrors, setValidationErrors] = useState({});

  const steps = ['Personal Information', 'Contact Details', 'Account Setup', 'Business Details'];

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^[0-9]{10}$/;
    return re.test(phone);
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setValidationErrors({ ...validationErrors, [name]: '' });
  };

  const validateStep = (step) => {
    const errors = {};

    switch (step) {
      case 0:
        if (!formData.firstName.trim()) errors.firstName = 'First name is required';
        if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
        break;
      case 1:
        if (!formData.email) errors.email = 'Email is required';
        else if (!validateEmail(formData.email)) errors.email = 'Invalid email format';
        if (!formData.phone) errors.phone = 'Phone number is required';
        else if (!validatePhone(formData.phone)) errors.phone = 'Invalid phone number';
        break;
      case 2:
        if (!formData.password) errors.password = 'Password is required';
        else if (!validatePassword(formData.password)) {
          errors.password =
            'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character (@$!%*?&)';
        }
        if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm your password';
        else if (formData.password !== formData.confirmPassword) {
          errors.confirmPassword = 'Passwords do not match';
        }
        if (!formData.role) errors.role = 'Please select a role';
        break;
      case 3:
        if (formData.role === 'vendor') {
          if (!formData.businessName) errors.businessName = 'Business name is required';
          if (!formData.businessType) errors.businessType = 'Business type is required';
          if (!formData.businessAddress) errors.businessAddress = 'Business address is required';
        }
        break;
      default:
        break;
    }

    return errors;
  };

  const isStepValid = (step) => {
    const errors = validateStep(step);
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (isStepValid(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isStepValid(activeStep)) return;

    try {
      const result = await dispatch(register(formData)).unwrap();
      if (result) {
        navigate('/login');
      }
    } catch (err) {
      const errorMessage = err.message || 'Registration failed';
      setValidationErrors({ submit: errorMessage });
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                error={!!validationErrors.firstName}
                helperText={validationErrors.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                error={!!validationErrors.lastName}
                helperText={validationErrors.lastName}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={!!validationErrors.email}
                helperText={validationErrors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                error={!!validationErrors.phone}
                helperText={validationErrors.phone}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                error={!!validationErrors.password}
                helperText={validationErrors.password}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={!!validationErrors.confirmPassword}
                helperText={validationErrors.confirmPassword}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!validationErrors.role}>
                <InputLabel>Role</InputLabel>
                <Select name="role" value={formData.role} onChange={handleInputChange}>
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="vendor">Vendor</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
      case 3:
        return formData.role === 'vendor' ? (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Business Name"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                error={!!validationErrors.businessName}
                helperText={validationErrors.businessName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Business Type"
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
                error={!!validationErrors.businessType}
                helperText={validationErrors.businessType}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Business Address"
                name="businessAddress"
                value={formData.businessAddress}
                onChange={handleInputChange}
                error={!!validationErrors.businessAddress}
                helperText={validationErrors.businessAddress}
              />
            </Grid>
          </Grid>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Register
        </Typography>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <form onSubmit={handleSubmit}>
          {renderStepContent(activeStep)}
          {validationErrors.submit && (
            <Typography color="error" align="center" sx={{ mt: 2 }}>
              {validationErrors.submit}
            </Typography>
          )}
          {error && (
            <Typography color="error" align="center" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button onClick={handleBack} disabled={activeStep === 0}>
              Back
            </Button>
            <div>
              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  endIcon={loading && <CircularProgress size={20} />}
                >
                  Register
                </Button>
              ) : (
                <Button variant="contained" color="primary" onClick={handleNext}>
                  Next
                </Button>
              )}
            </div>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Register;