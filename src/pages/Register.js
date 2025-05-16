import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Register.css';
import { CircularProgress } from '@mui/material';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    // Vendor specific fields
    businessName: '',
    serviceCategory: '',
    location: {
      city: '',
      state: '',
      address: ''
    },
    serviceDescription: ''
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
    }
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (!/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }
    
    // Updated password validation to match backend requirements
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    // Validate vendor-specific fields if role is vendor
    if (formData.role === 'vendor') {
      if (!formData.businessName.trim()) {
        setError('Business name is required for vendors');
        return false;
      }
      if (!formData.serviceCategory) {
        setError('Service category is required for vendors');
        return false;
      }
      if (!formData.location.city.trim()) {
        setError('City is required for vendors');
        return false;
      }
      if (!formData.location.state.trim()) {
        setError('State is required for vendors');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // Create the registration data
      const userData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role
      };

      console.log('Registering user:', { 
        ...userData, 
        password: '[REDACTED]',
        validation: {
          emailValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email),
          phoneValid: /^\d{10}$/.test(userData.phone.replace(/[^0-9]/g, '')),
          passwordValid: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(userData.password)
        }
      });
      
      // Register the user
      const response = await api.post('/auth/register', userData);
      console.log('Registration response:', {
        success: response.data?.success,
        hasToken: !!response.data?.data?.token,
        role: formData.role
      });
      
      if (response.data && response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('userRole', formData.role);
        
        // If registering as a vendor, create vendor profile
        if (formData.role === 'vendor') {
          try {
            // Set authorization header with the new token
            api.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
            
            const vendorData = {
              businessName: formData.businessName,
              ownerName: formData.fullName,
              email: formData.email,
              phone: formData.phone,
              serviceCategory: formData.serviceCategory,
              location: {
                city: formData.location.city,
                state: formData.location.state,
                address: formData.location.address || ''
              },
              serviceDescription: formData.serviceDescription || ''
            };

            console.log('Creating vendor profile:', vendorData);

            // Create vendor profile
            const vendorResponse = await api.post('/vendors', vendorData);
            console.log('Vendor profile created:', vendorResponse.data);

            if (!vendorResponse.data.success) {
              throw new Error(vendorResponse.data.message || 'Failed to create vendor profile');
            }

            // Redirect to vendor dashboard
            navigate('/vendor/dashboard');
          } catch (vendorError) {
            console.error('Error creating vendor profile:', vendorError);
            
            // Clean up if vendor profile creation fails
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            
            setError(
              vendorError.response?.data?.message || 
              vendorError.message || 
              'Failed to create vendor profile. Please try again.'
            );
            setLoading(false);
            return;
          }
        } else {
          // Redirect customer to dashboard
          navigate('/dashboard');
        }
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Registration failed. Please try again.'
      );
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-image-section"></div>
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="8"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength="8"
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">I am a</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="customer">Customer</option>
            <option value="vendor">Vendor</option>
          </select>
        </div>

        {formData.role === 'vendor' && (
          <>
            <div className="form-group">
              <label htmlFor="businessName">Business Name</label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="serviceCategory">Service Category</label>
              <select
                id="serviceCategory"
                name="serviceCategory"
                value={formData.serviceCategory}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {serviceCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="location.city">City</label>
              <input
                type="text"
                id="location.city"
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
                required
                placeholder="e.g., Mumbai"
              />
            </div>

            <div className="form-group">
              <label htmlFor="location.state">State</label>
              <input
                type="text"
                id="location.state"
                name="location.state"
                value={formData.location.state}
                onChange={handleChange}
                required
                placeholder="e.g., Maharashtra"
              />
            </div>

            <div className="form-group">
              <label htmlFor="location.address">Address (Optional)</label>
              <input
                type="text"
                id="location.address"
                name="location.address"
                value={formData.location.address}
                onChange={handleChange}
                placeholder="Enter your business address"
              />
            </div>

            <div className="form-group">
              <label htmlFor="serviceDescription">Business Description (Optional)</label>
              <textarea
                id="serviceDescription"
                name="serviceDescription"
                value={formData.serviceDescription}
                onChange={handleChange}
                placeholder="Tell us about your business and services"
                rows="4"
              />
            </div>
          </>
        )}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;
