import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { register } from '../store/slices/authSlice';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
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

const Register = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: '',
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

  const [errorMessage, setErrorMessage] = useState('');
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

  const validateEmail = useCallback((email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    setValidations(prev => ({ ...prev, email: isValid }));
    return isValid;
  }, []);

  const validatePhone = useCallback((phone) => {
    const phoneRegex = /^\d{10}$/;
    const isValid = phoneRegex.test(phone);
    setValidations(prev => ({ ...prev, phone: isValid }));
    return isValid;
  }, []);

  const validatePassword = useCallback((password) => {
    const validations = {
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[@$!%*?&]/.test(password),
      hasLength: password.length >= 8
    };
    setValidations(prev => ({ ...prev, password: validations }));
    return Object.values(validations).every(Boolean);
  }, []);

  const handleChange = useCallback((e) => {
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

      if (name === 'email') validateEmail(value);
      if (name === 'phone') validatePhone(value);
      if (name === 'password') validatePassword(value);
    }
  }, [validateEmail, validatePhone, validatePassword]);

  const isStepValid = useMemo(() => {
    switch (activeStep) {
      case 0:
        return formData.fullName && validations.email && validations.phone;
      case 1:
        return Object.values(validations.password).every(Boolean) && formData.password === formData.confirmPassword;
      case 2:
        if (formData.role === 'vendor') {
          return formData.businessName && formData.serviceCategory && formData.location.city && formData.location.state;
        }
        return true;
      default:
        return false;
    }
  }, [activeStep, formData, validations]);

  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      if (!formData.fullName || !formData.email || !formData.password || !formData.role) {
        throw new Error('Please fill in all required fields');
      }

      if (formData.role === 'vendor' && (!formData.businessName || !formData.serviceCategory)) {
        throw new Error('Please complete all business information');
      }

      const result = await dispatch(register(formData)).unwrap();
      if (result.success) {
        navigate('/dashboard');
      } else {
        setErrorMessage(result.message || 'Registration failed');
      }
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  }, [dispatch, formData, navigate]);

  const handleNext = useCallback(() => {
    if (isStepValid) {
      if (activeStep === steps.length - 1) {
        handleSubmit();
      } else {
        setActiveStep(prev => prev + 1);
      }
    }
  }, [isStepValid, activeStep, steps.length, handleSubmit]);

  const handleBack = useCallback(() => {
    setActiveStep(prev => prev - 1);
  }, []);

  // UI rendering logic omitted for brevity
  // (You can reuse the `renderStepContent` and layout from your last working version)

  return (
    <Container>
      {/* Render form, stepper, error messages, and navigation buttons here */}
    </Container>
  );
};

export default Register;
