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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar
} from '@mui/material';
import {
  Event as EventIcon,
  Group as GroupIcon,
  AttachMoney as MoneyIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Check as AcceptIcon,
  Close as RejectIcon,
  Message as MessageIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [responseDialog, setResponseDialog] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseType, setResponseType] = useState('');

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/bookings/${id}`);
      setBooking(response.data.data || response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching booking details:', err);
      setError(err.response?.data?.message || 'Failed to fetch booking details');
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = (type) => {
    setResponseType(type);
    setResponseMessage('');
    setResponseDialog(true);
  };

  const submitResponse = async () => {
    try {
      setLoading(true);
      const response = await axios.put(`/bookings/${id}`, {
        status: responseType === 'accept' ? 'confirmed' : 
                responseType === 'reject' ? 'rejected' : 
                undefined,
        vendorResponse: responseMessage,
        messageType: responseType === 'message' ? 'message' : undefined
      });

      setBooking(response.data);
      setResponseDialog(false);
      setError('');
    } catch (err) {
      console.error('Error updating booking:', err);
      setError(err.response?.data?.message || 'Failed to update booking');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !booking) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error" variant="h6">{error || 'Booking not found'}</Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        variant="outlined"
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">
                  Booking Details
                </Typography>
                <Chip
                  label={booking.status}
                  color={
                    booking.status === 'pending' ? 'warning' :
                    booking.status === 'confirmed' ? 'success' :
                    booking.status === 'rejected' ? 'error' :
                    booking.status === 'completed' ? 'info' : 'default'
                  }
                />
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EventIcon color="primary" sx={{ mr: 1 }} />
                    <Typography>
                      {new Date(booking.eventDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <GroupIcon color="primary" sx={{ mr: 1 }} />
                    <Typography>
                      {booking.guestCount} Guests
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <MoneyIcon color="primary" sx={{ mr: 1 }} />
                    <Typography>
                      Budget: ₹{booking.budget}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EmailIcon color="primary" sx={{ mr: 1 }} />
                    <Typography>
                      {booking.customerEmail}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PhoneIcon color="primary" sx={{ mr: 1 }} />
                    <Typography>
                      {booking.customerPhone}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {booking.message && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Customer Message
                  </Typography>
                  <Typography variant="body1">
                    {booking.message}
                  </Typography>
                </Box>
              )}

              {booking.vendorResponse && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Your Response
                  </Typography>
                  <Typography variant="body1">
                    {booking.vendorResponse}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Responded on: {new Date(booking.vendorResponseDate).toLocaleString()}
                  </Typography>
                </Box>
              )}

              {booking.messageHistory && booking.messageHistory.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Message History
                  </Typography>
                  <List>
                    {booking.messageHistory.map((msg, index) => (
                      <ListItem key={index} alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar>
                            {msg.sender === 'vendor' ? <PersonIcon /> : <PersonIcon />}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={msg.sender === 'vendor' ? 'You' : booking.customerName}
                          secondary={
                            <>
                              <Typography component="span" variant="body2" color="text.primary">
                                {msg.message}
                              </Typography>
                              <br />
                              <Typography variant="caption" color="text.secondary">
                                {new Date(msg.timestamp).toLocaleString()}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Actions
              </Typography>
              {booking.status === 'pending' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<AcceptIcon />}
                    onClick={() => handleResponse('accept')}
                    fullWidth
                  >
                    Accept Booking
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<RejectIcon />}
                    onClick={() => handleResponse('reject')}
                    fullWidth
                  >
                    Reject Booking
                  </Button>
                </Box>
              )}

              {booking.status === 'confirmed' && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<MessageIcon />}
                  onClick={() => handleResponse('message')}
                  fullWidth
                >
                  Send Message
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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

export default BookingDetails; 