import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Paper
} from '@mui/material';
import { PhotoCamera, Delete } from '@mui/icons-material';
import { uploadImage } from '../utils/imageUpload';
import axios from '../utils/axios';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const VendorProfileForm = ({ initialData, onSuccess, isEditing = false }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    description: '',
    category: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    email: '',
    website: '',
    priceRange: '',
    capacity: '',
    services: [],
    images: [],
    openingHours: {
      monday: { open: '', close: '' },
      tuesday: { open: '', close: '' },
      wednesday: { open: '', close: '' },
      thursday: { open: '', close: '' },
      friday: { open: '', close: '' },
      saturday: { open: '', close: '' },
      sunday: { open: '', close: '' }
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState([]);
  const [newService, setNewService] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.images) {
        setImagePreview(initialData.images);
      }
    }
  }, [initialData]);

  const validateForm = () => {
    const requiredFields = [
      'businessName',
      'description',
      'category',
      'address',
      'city',
      'state',
      'pincode',
      'phone',
      'email'
    ];

    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return false;
    }

    if (formData.services.length === 0) {
      setError('Please add at least one service');
      return false;
    }

    if (formData.images.length === 0) {
      setError('Please upload at least one image');
      return false;
    }

    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateImage = (file) => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      throw new Error('Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.');
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size too large. Maximum size is 5MB.');
    }
    return true;
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setLoading(true);
    setError('');

    try {
      // Validate all files first
      for (const file of files) {
        validateImage(file);
      }

      const uploadPromises = files.map(file => uploadImage(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));
      setImagePreview(prev => [...prev, ...uploadedUrls]);
      setSuccess('Images uploaded successfully');
    } catch (err) {
      console.error('Image upload error:', err);
      setError(err.message || 'Failed to upload images');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddService = () => {
    if (newService.trim()) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, newService.trim()]
      }));
      setNewService('');
    }
  };

  const handleRemoveService = (index) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      if (isEditing) {
        await axios.put('/vendor/profile', formData, config);
        setSuccess('Profile updated successfully');
      } else {
        await axios.post('/vendor/profile', formData, config);
        setSuccess('Profile created successfully');
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        {isEditing ? 'Edit Vendor Profile' : 'Create Vendor Profile'}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Business Name"
              name="businessName"
              value={formData.businessName}
              onChange={handleInputChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                label="Category"
              >
                <MenuItem value="venue">Venue</MenuItem>
                <MenuItem value="catering">Catering</MenuItem>
                <MenuItem value="photography">Photography</MenuItem>
                <MenuItem value="decoration">Decoration</MenuItem>
                <MenuItem value="music">Music</MenuItem>
                <MenuItem value="makeup">Makeup</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Price Range"
              name="priceRange"
              value={formData.priceRange}
              onChange={handleInputChange}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleInputChange}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="City"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="State"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              required
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Services</Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                label="Add Service"
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddService();
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={handleAddService}
                disabled={!newService.trim()}
              >
                Add
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.services.map((service, index) => (
                <Chip
                  key={index}
                  label={service}
                  onDelete={() => handleRemoveService(index)}
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Images</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              {imagePreview.map((url, index) => (
                <Box
                  key={index}
                  sx={{
                    position: 'relative',
                    width: 150,
                    height: 150,
                    borderRadius: 1,
                    overflow: 'hidden'
                  }}
                >
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      bgcolor: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(0,0,0,0.7)'
                      }
                    }}
                    onClick={() => handleRemoveImage(index)}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              ))}
            </Box>
            <Button
              variant="outlined"
              component="label"
              startIcon={<PhotoCamera />}
              disabled={loading}
            >
              Upload Images
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleImageUpload}
              />
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Opening Hours</Typography>
            <Grid container spacing={2}>
              {Object.entries(formData.openingHours).map(([day, hours]) => (
                <Grid item xs={12} sm={6} key={day}>
                  <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                    {day}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      fullWidth
                      label="Open"
                      type="time"
                      name={`openingHours.${day}.open`}
                      value={hours.open}
                      onChange={handleInputChange}
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      fullWidth
                      label="Close"
                      type="time"
                      name={`openingHours.${day}.close`}
                      value={hours.close}
                      onChange={handleInputChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                isEditing ? 'Update Profile' : 'Create Profile'
              )}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default VendorProfileForm; 