import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Rating,
  Chip
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Event as EventIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import axios from '../utils/axios';

const VendorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/vendors/${id}`);
        if (!response.data) {
          throw new Error('No data received from server');
        }
        setVendor(response.data);
        setError('');
      } catch (err) {
        console.error('Error fetching vendor details:', err);
        setError(err.response?.data?.message || 'Failed to fetch vendor details');
        setVendor(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVendorDetails();
    }
  }, [id]);

  const handleBookNow = () => {
    navigate(`/booking/${id}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !vendor) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error" variant="h6">{error || 'Vendor not found'}</Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => navigate('/vendors')}
          >
            Back to Vendors
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        variant="outlined"
        onClick={() => navigate('/vendors')}
        sx={{ mb: 3 }}
      >
        Back to Vendors
      </Button>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" component="h1">
                  {vendor.businessName || 'Unnamed Vendor'}
                </Typography>
                {vendor.serviceType && (
                  <Chip
                    label={vendor.serviceType}
                    color="primary"
                    variant="outlined"
                  />
                )}
              </Box>

              {vendor.rating && (
                <Box sx={{ mb: 3 }}>
                  <Rating 
                    value={typeof vendor.rating === 'object' ? vendor.rating.average || 0 : vendor.rating || 0} 
                    readOnly 
                    precision={0.5} 
                  />
                  <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 1 }}>
                    ({typeof vendor.rating === 'object' ? vendor.rating.count || 0 : 0} reviews)
                  </Typography>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>About Us</Typography>
              <Typography variant="body1" paragraph>
                {vendor.description || 'No description available'}
              </Typography>

              <Grid container spacing={2} sx={{ mt: 2 }}>
                {(vendor.location?.address || vendor.location?.city || vendor.location?.state) && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body1">
                        {[
                          vendor.location?.address,
                          vendor.location?.city,
                          vendor.location?.state
                        ].filter(Boolean).join(', ')}
                      </Typography>
                    </Box>
                  </Grid>
                )}
                
                {vendor.phone && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PhoneIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body1">{vendor.phone}</Typography>
                    </Box>
                  </Grid>
                )}

                {(vendor.priceRange?.min !== undefined || vendor.priceRange?.max !== undefined) && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <MoneyIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body1">
                        ₹{vendor.priceRange?.min || 0} - ₹{vendor.priceRange?.max || 0}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>

          {vendor.services && vendor.services.length > 0 && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Our Services</Typography>
                <Grid container spacing={2}>
                  {vendor.services.map((service, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1">{service.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {service.description}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Price: ₹{service.price}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Book this Vendor</Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Ready to make your event special? Book this vendor now!
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={handleBookNow}
                sx={{ mt: 2 }}
              >
                Book Now
              </Button>
            </CardContent>
          </Card>

          {vendor.availability && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Availability</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <EventIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    {vendor.availability}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default VendorDetails; 