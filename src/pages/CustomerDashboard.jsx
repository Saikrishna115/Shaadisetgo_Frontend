import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
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
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  Avatar,
  Tooltip,
  Rating,
  Tab,
  Tabs,
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  Event as EventIcon,
  Favorite as FavoriteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  CalendarMonth as CalendarIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState({
    profile: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      preferences: {
        eventType: '',
        eventDate: null,
        budget: '',
        guestCount: ''
      }
    },
    bookings: [],
    favorites: [],
    analytics: {
      totalBookings: 0,
      upcomingEvents: 0,
      totalSpent: 0,
      savedVendors: 0
    }
  });
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Fetch all required data in parallel
      const [profileRes, bookingsRes, favoritesRes] = await Promise.all([
        axios.get('/users/profile', config),
        axios.get('/bookings/customer', config),
        axios.get('/favorites', config)
      ]);

      // Calculate analytics
      const analytics = {
        totalBookings: bookingsRes.data.length,
        upcomingEvents: bookingsRes.data.filter(b => new Date(b.eventDate) > new Date()).length,
        totalSpent: bookingsRes.data.reduce((sum, booking) => sum + (booking.amount || 0), 0),
        savedVendors: favoritesRes.data.length
      };

      setDashboardData({
        profile: profileRes.data,
        bookings: bookingsRes.data,
        favorites: favoritesRes.data,
        analytics
      });

      // Fetch upcoming events (assuming there's an endpoint for this)
      const eventsResponse = await axios.get('/events/upcoming', config);
      setUpcomingEvents(eventsResponse.data);

      setError('');
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await axios.put(`/bookings/${bookingId}/cancel`);
      fetchDashboardData(); // Refresh data after cancellation
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const renderAnalytics = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Total Bookings</Typography>
            <Typography variant="h4">{dashboardData.analytics.totalBookings}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Upcoming Events</Typography>
            <Typography variant="h4">{dashboardData.analytics.upcomingEvents}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Total Spent</Typography>
            <Typography variant="h4">₹{dashboardData.analytics.totalSpent}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Saved Vendors</Typography>
            <Typography variant="h4">{dashboardData.analytics.savedVendors}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderProfile = () => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Profile Information</Typography>
          <Button
            startIcon={<EditIcon />}
            variant="outlined"
            onClick={() => navigate('/profile/edit')}
          >
            Edit Profile
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <List>
              <ListItem>
                <ListItemText
                  primary="Full Name"
                  secondary={dashboardData.profile.fullName}
                  secondaryTypographyProps={{ component: "div" }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={<Box sx={{ display: 'flex', alignItems: 'center' }}><EmailIcon sx={{ mr: 1 }} /> Email</Box>}
                  secondary={dashboardData.profile.email}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={<Box sx={{ display: 'flex', alignItems: 'center' }}><PhoneIcon sx={{ mr: 1 }} /> Phone</Box>}
                  secondary={dashboardData.profile.phone}
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <List>
              <ListItem>
                <ListItemText
                  primary={<Box sx={{ display: 'flex', alignItems: 'center' }}><LocationIcon sx={{ mr: 1 }} /> Address</Box>}
                  secondary={`${dashboardData.profile.address || ''}, ${dashboardData.profile.city || ''}, ${dashboardData.profile.state || ''} ${dashboardData.profile.pincode || ''}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Event Preferences"
                  secondary={
                    <Box>
                      <Typography variant="body2">Type: {dashboardData.profile.preferences?.eventType || 'Not specified'}</Typography>
                      <Typography variant="body2">Date: {dashboardData.profile.preferences?.eventDate ? new Date(dashboardData.profile.preferences.eventDate).toLocaleDateString() : 'Not specified'}</Typography>
                      <Typography variant="body2">Budget: ₹{dashboardData.profile.preferences?.budget || 'Not specified'}</Typography>
                      <Typography variant="body2">Guest Count: {dashboardData.profile.preferences?.guestCount || 'Not specified'}</Typography>
                    </Box>
                  }
                  secondaryTypographyProps={{ component: "div" }}
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderBookings = () => (
    <Grid container spacing={3}>
      {dashboardData.bookings.map((booking) => (
        <Grid item xs={12} md={6} key={booking._id}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">{booking.vendorName}</Typography>
                <Chip
                  label={booking.status}
                  color={
                    booking.status === 'CONFIRMED' ? 'success' :
                    booking.status === 'PENDING' ? 'warning' :
                    booking.status === 'CANCELLED' ? 'error' : 'default'
                  }
                />
              </Box>
              <Typography color="textSecondary" gutterBottom>
                <EventIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                {new Date(booking.eventDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Service: {booking.service}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Amount: ₹{booking.amount}
              </Typography>
              {booking.status === 'PENDING' && (
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleCancelBooking(booking._id)}
                  >
                    Cancel Booking
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
      {dashboardData.bookings.length === 0 && (
        <Grid item xs={12}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary">
              No bookings found. Start exploring vendors to make your first booking!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => navigate('/vendors')}
            >
              Browse Vendors
            </Button>
          </Paper>
        </Grid>
      )}
    </Grid>
  );

  const renderFavorites = () => (
    <Grid container spacing={3}>
      {dashboardData.favorites.map((vendor) => (
        <Grid item xs={12} md={6} key={vendor._id}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">{vendor.businessName}</Typography>
                <Rating value={vendor.rating?.average || 0} readOnly size="small" />
              </Box>
              <Typography color="textSecondary" gutterBottom>{vendor.serviceType}</Typography>
              <Typography variant="body2" gutterBottom>
                <LocationIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                {vendor.location}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Price Range: {vendor.priceRange}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate(`/vendors/${vendor._id}`)}
                >
                  View Details
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
      {dashboardData.favorites.length === 0 && (
        <Grid item xs={12}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary">
              No favorite vendors yet. Start exploring to find and save your preferred vendors!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => navigate('/vendors')}
            >
              Browse Vendors
            </Button>
          </Paper>
        </Grid>
      )}
    </Grid>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {dashboardData.profile.fullName}
        </Typography>
        <Typography color="textSecondary">
          Manage your wedding planning journey
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {renderAnalytics()}

      <Box sx={{ mt: 4 }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Profile" />
          <Tab label="Bookings" />
          <Tab label="Favorites" />
        </Tabs>

        {activeTab === 0 && renderProfile()}
        {activeTab === 1 && renderBookings()}
        {activeTab === 2 && renderFavorites()}
      </Box>
    </Container>
  );
};

export default CustomerDashboard;