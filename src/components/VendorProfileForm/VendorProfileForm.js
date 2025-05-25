import React, { useState, useCallback } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText
} from '@mui/material';

const VendorProfileForm = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState(initialData || {
    businessName: '',
    serviceCategory: '',
    description: '',
    location: {
      city: '',
      state: '',
      country: ''
    },
    priceRange: '',
    email: '',
    phone: '',
    services: [],
    experience: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.businessName) newErrors.businessName = 'Business name is required';
    if (!formData.serviceCategory) newErrors.serviceCategory = 'Service category is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.location.city) newErrors['location.city'] = 'City is required';
    if (!formData.location.state) newErrors['location.state'] = 'State is required';
    if (!formData.location.country) newErrors['location.country'] = 'Country is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    // Handle nested location fields
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
      return;
    }

    // Handle services field as array
    if (name === 'services') {
      const servicesArray = value.split(',').map(service => service.trim()).filter(Boolean);
      setFormData(prev => ({
        ...prev,
        [name]: servicesArray
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  }, [formData, onSubmit]);

  const categories = [
    'Venues',
    'Photography',
    'Catering',
    'Decoration',
    'Music',
    'Makeup'
  ];

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto', my: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Vendor Profile
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Business Name"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              error={!!errors.businessName}
              helperText={errors.businessName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!errors.category}>
              <InputLabel>Category</InputLabel>
              <Select
                name="serviceCategory"
                value={formData.serviceCategory}
                onChange={handleChange}
                label="Service Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
              {errors.category && (
                <FormHelperText>{errors.category}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              multiline
              rows={4}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>Location</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  label="City"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleChange}
                  error={!!errors['location.city']}
                  helperText={errors['location.city']}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  label="State"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleChange}
                  error={!!errors['location.state']}
                  helperText={errors['location.state']}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  label="Country"
                  name="location.country"
                  value={formData.location.country}
                  onChange={handleChange}
                  error={!!errors['location.country']}
                  helperText={errors['location.country']}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Price Range"
              name="priceRange"
              value={formData.priceRange}
              onChange={handleChange}
              placeholder="e.g., ₹10,000 - ₹50,000"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Services Offered"
              name="services"
              value={formData.services}
              onChange={handleChange}
              placeholder="e.g., Wedding Photography, Pre-wedding Shoots"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Years of Experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="e.g., 5 years"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 2 }}
            >
              Save Profile
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default VendorProfileForm;