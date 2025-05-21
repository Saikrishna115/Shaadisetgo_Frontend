import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import api from '../services/api';
import './VendorDashboard.css';

const VendorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [bookings, setBookings] = useState([]);
  const [vendorProfile, setVendorProfile] = useState(null);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
    averageRating: 0,
    totalReviews: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [responseDialog, setResponseDialog] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseType, setResponseType] = useState('');
  const [view, setView] = useState('list');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsResponse, bookingsResponse] = await Promise.all([
          api.get('/vendors/stats'),
          api.get('/vendors/bookings/recent')
        ]);

        setStats(statsResponse.data);
        setRecentBookings(bookingsResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.businessName}!
      </Typography>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EventIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Bookings</Typography>
              </Box>
              <Typography variant="h4">{stats.totalBookings}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MoneyIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Revenue</Typography>
              </Box>
              <Typography variant="h4">₹{stats.totalRevenue}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <StarIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Rating</Typography>
              </Box>
              <Typography variant="h4">{stats.averageRating.toFixed(1)}</Typography>
              <Typography variant="body2" color="text.secondary">
                ({stats.totalReviews} reviews)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Pending</Typography>
              </Box>
              <Typography variant="h4">{stats.pendingBookings}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Bookings */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Bookings
            </Typography>
            <List>
              {recentBookings.map((booking, index) => (
                <React.Fragment key={booking._id}>
                  {index > 0 && <Divider />}
                  <ListItem>
                    <ListItemText
                      primary={booking.customerName}
                      secondary={`Date: ${new Date(booking.date).toLocaleDateString()} - Status: ${booking.status}`}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate(`/bookings/${booking._id}`)}
                    >
                      View Details
                    </Button>
                  </ListItem>
                </React.Fragment>
              ))}
              {recentBookings.length === 0 && (
                <ListItem>
                  <ListItemText primary="No recent bookings" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>

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
                  const response = await api.put(`/bookings/${bookingId}`, {
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