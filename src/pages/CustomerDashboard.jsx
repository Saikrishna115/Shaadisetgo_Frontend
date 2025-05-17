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
  Alert,
  TextField
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
  Email as EmailIcon,
  Business as BusinessIcon,
  Category as CategoryIcon,
  Group as GroupIcon,
  Money as MoneyIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editProfileData, setEditProfileData] = useState(null);
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
      const currentDate = new Date();
      const upcomingEvents = bookingsRes.data.filter(
        booking => new Date(booking.eventDate) > currentDate && booking.status !== 'CANCELLED'
      ).length;

      const analytics = {
        totalBookings: bookingsRes.data.length,
        upcomingEvents,
        totalSpent: bookingsRes.data.reduce((sum, booking) => sum + (booking.amount || 0), 0),
        savedVendors: favoritesRes.data.length
      };

      setDashboardData({
        profile: profileRes.data,
        bookings: bookingsRes.data,
        favorites: favoritesRes.data,
        analytics
      });

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

  const handleProfileUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const response = await axios.put('/users/profile', editProfileData, config);
      
      if (response.data) {
        setDashboardData(prev => ({
          ...prev,
          profile: response.data
        }));
        setIsEditing(false);
        setError('');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const startEditing = () => {
    setEditProfileData({
      fullName: dashboardData.profile.fullName || '',
      email: dashboardData.profile.email || '',
      phone: dashboardData.profile.phone || '',
      address: dashboardData.profile.address || '',
      city: dashboardData.profile.city || '',
      state: dashboardData.profile.state || '',
      pincode: dashboardData.profile.pincode || '',
      preferences: {
        eventType: dashboardData.profile.preferences?.eventType || '',
        eventDate: dashboardData.profile.preferences?.eventDate || null,
        budget: dashboardData.profile.preferences?.budget || '',
        guestCount: dashboardData.profile.preferences?.guestCount || ''
      }
    });
    setIsEditing(true);
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
          {!isEditing && (
            <Button
              startIcon={<EditIcon />}
              variant="outlined"
              onClick={startEditing}
            >
              Edit Profile
            </Button>
          )}
        </Box>
        <Divider sx={{ mb: 2 }} />
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {isEditing ? (
          <Box component="form" noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  value={editProfileData.fullName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={editProfileData.email}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={editProfileData.phone}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={editProfileData.address}
                  onChange={handleInputChange}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={editProfileData.city}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State"
                  name="state"
                  value={editProfileData.state}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Pincode"
                  name="pincode"
                  value={editProfileData.pincode}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Event Preferences</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Event Type"
                  name="preferences.eventType"
                  value={editProfileData.preferences.eventType}
                  onChange={(e) => setEditProfileData(prev => ({
                    ...prev,
                    preferences: {
                      ...prev.preferences,
                      eventType: e.target.value
                    }
                  }))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Event Date"
                  name="preferences.eventDate"
                  type="date"
                  value={editProfileData.preferences.eventDate ? new Date(editProfileData.preferences.eventDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => setEditProfileData(prev => ({
                    ...prev,
                    preferences: {
                      ...prev.preferences,
                      eventDate: e.target.value
                    }
                  }))}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Budget"
                  name="preferences.budget"
                  type="number"
                  value={editProfileData.preferences.budget}
                  onChange={(e) => setEditProfileData(prev => ({
                    ...prev,
                    preferences: {
                      ...prev.preferences,
                      budget: e.target.value
                    }
                  }))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Guest Count"
                  name="preferences.guestCount"
                  type="number"
                  value={editProfileData.preferences.guestCount}
                  onChange={(e) => setEditProfileData(prev => ({
                    ...prev,
                    preferences: {
                      ...prev.preferences,
                      guestCount: e.target.value
                    }
                  }))}
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleProfileUpdate}
              >
                Save Changes
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setIsEditing(false);
                  setError('');
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
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
                    secondary={
                      <Box>
                        {dashboardData.profile.address && (
                          <Typography variant="body2">{dashboardData.profile.address}</Typography>
                        )}
                        {(dashboardData.profile.city || dashboardData.profile.state || dashboardData.profile.pincode) && (
                          <Typography variant="body2">
                            {[
                              dashboardData.profile.city,
                              dashboardData.profile.state,
                              dashboardData.profile.pincode
                            ].filter(Boolean).join(', ')}
                          </Typography>
                        )}
                        {!dashboardData.profile.address && !dashboardData.profile.city && !dashboardData.profile.state && !dashboardData.profile.pincode && (
                          <Typography variant="body2">Not specified</Typography>
                        )}
                      </Box>
                    }
                    secondaryTypographyProps={{ component: "div" }}
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
        )}
      </CardContent>
    </Card>
  );

  const renderBookings = () => (
    <Grid container spacing={3}>
      {dashboardData.bookings.map((booking) => (
        <Grid item xs={12} key={booking._id}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {booking.eventType}
                    <Box component="span" sx={{ ml: 2 }}>
                      <Chip
                        label={booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        color={
                          booking.status === 'confirmed' ? 'success' :
                          booking.status === 'pending' ? 'warning' :
                          booking.status === 'rejected' ? 'error' :
                          booking.status === 'cancelled' ? 'default' :
                          booking.status === 'completed' ? 'info' : 'default'
                        }
                        size="small"
                      />
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
                    Vendor Details
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography>{booking.vendorName}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CategoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography>{booking.vendorService}</Typography>
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
                    Your Message
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {booking.message}
                  </Typography>
                </Box>
              )}

              {booking.vendorResponse && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Vendor Response
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
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleCancelBooking(booking._id)}
                    startIcon={<CancelIcon />}
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