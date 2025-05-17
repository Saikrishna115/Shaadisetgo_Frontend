import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Check as AcceptIcon,
  Close as RejectIcon,
  Edit as EditIcon,
  Event as EventIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  AttachMoney as MoneyIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';

const VendorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [responseDialog, setResponseDialog] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseType, setResponseType] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/bookings/vendor');
      setBookings(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = (booking, type) => {
    setSelectedBooking(booking);
    setResponseType(type);
    setResponseMessage('');
    setResponseDialog(true);
  };

  const submitResponse = async () => {
    try {
      setLoading(true);
      const response = await axios.put(`/bookings/${selectedBooking._id}`, {
        status: responseType === 'accept' ? 'confirmed' : 'rejected',
        vendorResponse: responseMessage
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

  const getStatusChip = (status) => {
    const statusConfig = {
      pending: { color: 'warning', label: 'Pending' },
      confirmed: { color: 'success', label: 'Confirmed' },
      rejected: { color: 'error', label: 'Rejected' },
      cancelled: { color: 'default', label: 'Cancelled' },
      completed: { color: 'info', label: 'Completed' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Booking Requests
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {bookings.map((booking) => (
          <Grid item xs={12} key={booking._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {booking.eventType}
                      <Box component="span" sx={{ ml: 2 }}>
                        {getStatusChip(booking.status)}
                      </Box>
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      Booking ID: {booking._id}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Customer Details
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography>{booking.customerName}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography>{booking.customerEmail}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PhoneIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography>{booking.customerPhone}</Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Event Details
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography>
                        {new Date(booking.eventDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <GroupIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography>{booking.guestCount} Guests</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <MoneyIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography>Budget: ₹{booking.budget}</Typography>
                    </Box>
                  </Grid>
                </Grid>

                {booking.message && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Customer Message
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {booking.message}
                    </Typography>
                  </Box>
                )}

                {booking.vendorResponse && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Your Response
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {booking.vendorResponse}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Responded on: {new Date(booking.vendorResponseDate).toLocaleString()}
                    </Typography>
                  </Box>
                )}

                {booking.status === 'pending' && (
                  <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<AcceptIcon />}
                      onClick={() => handleResponse(booking, 'accept')}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<RejectIcon />}
                      onClick={() => handleResponse(booking, 'reject')}
                    >
                      Reject
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}

        {bookings.length === 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="textSecondary">
                No booking requests found.
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>

      <Dialog open={responseDialog} onClose={() => setResponseDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {responseType === 'accept' ? 'Accept Booking Request' : 'Reject Booking Request'}
        </DialogTitle>
        <DialogContent>
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
                ? 'Add any special instructions or message for the customer...'
                : 'Provide a reason for rejecting the booking...'
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResponseDialog(false)}>Cancel</Button>
          <Button
            onClick={submitResponse}
            variant="contained"
            color={responseType === 'accept' ? 'success' : 'error'}
          >
            {responseType === 'accept' ? 'Accept Booking' : 'Reject Booking'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VendorDashboard; 