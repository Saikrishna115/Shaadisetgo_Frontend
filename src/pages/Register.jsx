import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { register } from '../store/slices/authSlice';
import { Container } from '@mui/material';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (password) => {
    return [
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /\d/.test(password),
      /[@$!%*?&]/.test(password),
      password.length >= 8
    ].every(Boolean);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    try {
      if (!formData.fullName || !formData.email || !formData.password || !formData.role) {
        throw new Error('Please fill in all required fields');
      }

      if (!validateEmail(formData.email)) {
        throw new Error('Invalid email');
      }

      if (!validatePhone(formData.phone)) {
        throw new Error('Invalid phone number');
      }

      if (!validatePassword(formData.password)) {
        throw new Error('Password does not meet requirements');
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (formData.role === 'vendor' && (!formData.businessName || !formData.serviceCategory)) {
        throw new Error('Please complete all business information');
      }

      const result = await dispatch(register(formData)).unwrap();
      if (result.success) {
        navigate('/dashboard');
      } else {
        console.error(result.message || 'Registration failed');
      }
    } catch (err) {
      console.error(err.message || 'An error occurred during registration');
    }
  };

  return (
    <Container>
      {/* Registration form JSX goes here */}
    </Container>
  );
};

export default Register;
