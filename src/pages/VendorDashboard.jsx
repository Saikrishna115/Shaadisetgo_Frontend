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
  Group as GroupIcon,
  Person as PersonIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import BookingStats from '../components/BookingStats';
import BookingList from '../components/BookingList';
import BookingCalendar from '../components/BookingCalendar';

const VendorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [vendorProfile, setVendorProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [responseDialog, setResponseDialog] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseType, setResponseType] = useState('');
  const [view, setView] = useState('list');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, profileRes, statsRes] = await Promise.all([
        axios.get('/bookings/vendor'),
        axios.get('/vendors/profile'),
        axios.get('/bookings/stats')
      ]);
      
      setBookings(bookingsRes.data.data || []);
      setVendorProfile(profileRes.data.data);
      setStats(statsRes.data.data);
      setError('');
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
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
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      <BookingStats bookings={bookings} />

      <Paper sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Booking Requests
        </Typography>

        <Box sx={{ p: 3 }}>
          {view === 'list' ? (
            <BookingList 
              bookings={bookings} 
              onStatusChange={async (bookingId, newStatus) => {
                try {
                  setLoading(true);
                  const response = await axios.put(`/bookings/${bookingId}`, {
                    status: newStatus
                  });
                  setBookings(bookings.map(booking => 
                    booking._id === bookingId ? response.data : booking
                  ));
                  setError('');
                } catch (err) {
                  console.error('Error updating booking:', err);
                  setError(err.response?.data?.message || 'Failed to update booking');
                } finally {
                  setLoading(false);
                }
              }} 
            />
          ) : (
            <BookingCalendar bookings={bookings} />
          )}
        </Box>
      </Paper>

      <Dialog open={responseDialog} onClose={() => setResponseDialog(false)}>
        <DialogTitle>
          {responseType === 'accept' ? 'Accept Booking' : 'Reject Booking'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Response Message"
            fullWidth
            multiline
            rows={4}
            value={responseMessage}
            onChange={(e) => setResponseMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResponseDialog(false)}>Cancel</Button>
          <Button
            onClick={submitResponse}
            variant="contained"
            color={responseType === 'accept' ? 'success' : 'error'}
          >
            {responseType === 'accept' ? 'Accept' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VendorDashboard; 