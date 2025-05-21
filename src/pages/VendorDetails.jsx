import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Event as EventIcon,
  AttachMoney as MoneyIcon,
  Check as AcceptIcon,
  Close as RejectIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import api from '../services/api';
import './VendorDetails.css';

const VendorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [responseDialog, setResponseDialog] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseType, setResponseType] = useState('');

  const fetchVendorDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/vendors/${id}`);
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
  }, [id]);

  const fetchBookings = useCallback(async () => {
    try {
      const response = await api.get(`/bookings/vendor/${id}`);
      setBookings(response.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.response?.data?.message || 'Failed to fetch bookings');
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchVendorDetails();
      if (user?.role === 'vendor') {
        fetchBookings();
      }
    }
  }, [id, user?.role, fetchVendorDetails, fetchBookings]);

  const handleResponse = (booking, type) => {
    setSelectedBooking(booking);
    setResponseType(type);
    setResponseMessage('');
    setResponseDialog(true);
  };

  const submitResponse = async () => {
    try {
      setLoading(true);
      const response = await api.put(`/bookings/${selectedBooking._id}`, {
        status: responseType === 'accept' ? 'confirmed' : 
                responseType === 'reject' ? 'rejected' : 
                undefined,
        vendorResponse: responseMessage,
        messageType: responseType === 'message' ? 'message' : undefined
      });

      setBookings(bookings.map(booking => 
        booking._id === response.data._id ? response.data : booking
      ));
      setResponseDialog(false);
      setError('');
    } catch (err) {
      console.error('Error updating booking:', err);
      setError(err.response?.data?.message || 'Failed to update booking');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/vendors/${id}` } });
      return;
    }
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

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

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
                onClick={handleBooking}
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

          {/* Booking management section for vendors */}
          {user?.role === 'vendor' && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">
                    Booking Requests
                  </Typography>
                  <Chip 
                    label={`${bookings.filter(b => b.status === 'pending').length} Pending`}
                    color="warning"
                    size="small"
                  />
                </Box>
                
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <Paper 
                      key={booking._id} 
                      sx={{ 
                        p: 2, 
                        mb: 2,
                        borderLeft: '4px solid',
                        borderColor: booking.status === 'pending' ? 'warning.main' : 
                                   booking.status === 'confirmed' ? 'success.main' : 
                                   'error.main',
                        '&:hover': {
                          boxShadow: 3,
                          transform: 'translateY(-2px)',
                          transition: 'all 0.2s ease-in-out'
                        },
                        cursor: 'pointer'
                      }}
                      onClick={() => navigate(`/bookings/${booking._id}`)}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {booking.customerName}
                        </Typography>
                        <Chip
                          label={booking.status}
                          color={booking.status === 'pending' ? 'warning' : 
                                 booking.status === 'confirmed' ? 'success' : 
                                 'error'}
                          size="small"
                        />
                      </Box>

                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <EventIcon color="primary" sx={{ mr: 1, fontSize: '1.2rem' }} />
                            <Typography variant="body2">
                              {new Date(booking.eventDate).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <GroupIcon color="primary" sx={{ mr: 1, fontSize: '1.2rem' }} />
                            <Typography variant="body2">
                              {booking.guestCount} Guests
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <MoneyIcon color="primary" sx={{ mr: 1, fontSize: '1.2rem' }} />
                            <Typography variant="body2">
                              Budget: ₹{booking.budget}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <EmailIcon color="primary" sx={{ mr: 1, fontSize: '1.2rem' }} />
                            <Typography variant="body2">
                              {booking.customerEmail}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      {booking.message && (
                        <Box sx={{ mt: 2, p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                          <Typography variant="subtitle2" color="primary" gutterBottom>
                            Customer Message:
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {booking.message}
                          </Typography>
                        </Box>
                      )}

                      {booking.vendorResponse && (
                        <Box sx={{ mt: 2, p: 1.5, bgcolor: 'primary.light', borderRadius: 1 }}>
                          <Typography variant="subtitle2" color="primary" gutterBottom>
                            Your Response:
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {booking.vendorResponse}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                            Responded on: {new Date(booking.vendorResponseDate).toLocaleString()}
                          </Typography>
                        </Box>
                      )}

                      {booking.status === 'pending' && (
                        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={<AcceptIcon />}
                            onClick={() => handleResponse(booking, 'accept')}
                            sx={{ flex: 1 }}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            startIcon={<RejectIcon />}
                            onClick={() => handleResponse(booking, 'reject')}
                            sx={{ flex: 1 }}
                          >
                            Reject
                          </Button>
                        </Box>
                      )}

                      {booking.status === 'confirmed' && (
                        <Box sx={{ mt: 2 }}>
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            fullWidth
                            onClick={() => handleResponse(booking, 'message')}
                          >
                            Send Message to Customer
                          </Button>
                        </Box>
                      )}
                    </Paper>
                  ))
                ) : (
                  <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
                    <Typography color="text.secondary">
                      No booking requests found
                    </Typography>
                  </Paper>
                )}
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Enhanced Response Dialog */}
      <Dialog 
        open={responseDialog} 
        onClose={() => setResponseDialog(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 3
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: responseType === 'accept' ? 'success.light' : 
                   responseType === 'reject' ? 'error.light' : 
                   'primary.light',
          color: 'white'
        }}>
          {responseType === 'accept' ? 'Accept Booking Request' : 
           responseType === 'reject' ? 'Reject Booking Request' :
           'Send Message to Customer'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedBooking && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Booking Details:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Customer: {selectedBooking.customerName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Date: {new Date(selectedBooking.eventDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Guests: {selectedBooking.guestCount}
              </Typography>
            </Box>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Message to Customer"
            fullWidth
            multiline
            rows={4}
            value={responseMessage}
            onChange={(e) => setResponseMessage(e.target.value)}
            placeholder={
              responseType === 'accept'
                ? 'Add any special instructions, requirements, or message for the customer...'
                : responseType === 'reject'
                ? 'Provide a clear and professional reason for rejecting the booking...'
                : 'Type your message to the customer...'
            }
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: responseType === 'accept' ? 'success.main' : 
                              responseType === 'reject' ? 'error.main' : 
                              'primary.main'
                }
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: 'grey.50' }}>
          <Button 
            onClick={() => setResponseDialog(false)}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={submitResponse}
            variant="contained"
            color={responseType === 'accept' ? 'success' : 
                   responseType === 'reject' ? 'error' : 
                   'primary'}
            disabled={!responseMessage.trim()}
          >
            {responseType === 'accept' ? 'Accept Booking' : 
             responseType === 'reject' ? 'Reject Booking' :
             'Send Message'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VendorDetails; 