import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api/config';
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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  Tooltip,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import DashboardAnalytics from '../components/DashboardAnalytics/DashboardAnalytics';
import { useSelector } from 'react-redux';
import {
  Edit as EditIcon,
  Event as EventIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon,
  Star as StarIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import './Dashboard.css';
import BookingStats from '../components/BookingStats';
import BookingList from '../components/BookingList';
import BookingCalendar from '../components/BookingCalendar';

const VendorDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [view, setView] = useState('list');

  const calculateAnalytics = (bookings) => {
    const currentDate = new Date();
    const lastMonth = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
    
    const recentBookings = bookings.filter(booking => new Date(booking.createdAt) >= lastMonth);
    const completedBookings = bookings.filter(booking => booking.status === 'completed');
    
    return {
      totalBookings: bookings.length,
      revenue: completedBookings.reduce((total, booking) => total + (booking.amount || 0), 0),
      rating: completedBookings.reduce((total, booking) => total + (booking.rating || 0), 0) / (completedBookings.length || 1),
      activeCustomers: new Set(bookings.map(booking => booking.customerId)).size,
      bookingGrowth: ((recentBookings.length / (bookings.length || 1)) * 100) - 100,
      revenueGrowth: 0 // This would need historical data to calculate properly
    };
  };

  const [userInfo, setUserInfo] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalBookings: 0,
    revenue: 0,
    rating: 0,
    activeCustomers: 0,
    bookingGrowth: 0,
    revenueGrowth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    businessName: '',
    serviceCategory: '',
    location: {
      city: '',
      state: '',
      address: ''
    },
    phone: '',
    priceRange: {
      min: 0,
      max: 0
    },
    serviceDescription: ''
  });
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
    averageRating: 0,
    totalReviews: 0
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [bookingsResponse, statsResponse] = await Promise.all([
        api.get('/bookings/vendor'),
        api.get('/vendors/stats')
      ]);
      setBookings(bookingsResponse.data);
      setStats(statsResponse.data);
      setAnalytics(calculateAnalytics(bookingsResponse.data));
      setError('');
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (!token) {
      navigate('/login', { replace: true, state: { message: 'Please login to continue' } });
      return;
    }

    if (userRole !== 'vendor') {
      navigate('/login', { replace: true, state: { message: 'Unauthorized access. Please login as a vendor.' } });
      return;
    }

    fetchDashboardData();
  }, [navigate, fetchDashboardData]);

  const handleProfileUpdate = async () => {
    try {
      let response;
      if (userInfo.vendorInfo) {
        response = await api.put(
          `/vendors/${userInfo.vendorInfo._id}`,
          profileData
        );
      } else {
        response = await api.post(
          '/vendors',
          profileData
        );
      }

      setUserInfo({
        ...userInfo,
        vendorInfo: response.data
      });
      setIsProfileDialogOpen(false);
      fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleTabChange = (event, newValue) => {
    setView(newValue);
  };

  const handleViewBooking = (bookingId) => {
    navigate(`/bookings/${bookingId}`);
  };

  const handleEditProfile = () => {
    navigate('/profile');
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
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  const getStatusChip = (status) => {
    let color;
    switch (status?.toLowerCase()) {
      case 'confirmed':
        color = 'success';
        break;
      case 'pending':
        color = 'warning';
        break;
      case 'cancelled':
        color = 'error';
        break;
      case 'completed':
        color = 'info';
        break;
      default:
        color = 'default';
    }
    return (
      <Chip
        label={status || 'Unknown'}
        color={color}
        size="small"
        sx={{ ml: 1 }}
      />
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      <BookingStats stats={stats} />

      <Paper sx={{ mt: 4 }}>
        <Tabs
          value={view}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="List View" value="list" />
          <Tab label="Calendar View" value="calendar" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {view === 'list' ? (
            <BookingList bookings={bookings} onUpdate={fetchDashboardData} />
          ) : (
            <BookingCalendar bookings={bookings} />
          )}
        </Box>
      </Paper>

      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {userInfo?.vendorInfo?.businessName || user?.businessName || 'Vendor'}
        </Typography>

        <Box sx={{ mb: 4 }}>
          <DashboardAnalytics stats={analytics} userType="vendor" />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Quick Actions</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setIsProfileDialogOpen(true)}
                  startIcon={<BusinessIcon />}
                >
                  {userInfo?.vendorInfo ? 'Update Business Profile' : 'Create Business Profile'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleEditProfile}
                  startIcon={<EditIcon />}
                >
                  Edit Personal Profile
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/calendar')}
                  startIcon={<EventIcon />}
                >
                  View Calendar
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Business Profile</Typography>
                <Divider sx={{ mb: 2 }} />
                {userInfo?.vendorInfo ? (
                  <List>
                    <ListItem><ListItemText primary="Business Name" secondary={userInfo.vendorInfo.businessName} /></ListItem>
                    <ListItem><ListItemText primary="Service Type" secondary={userInfo.vendorInfo.serviceCategory} /></ListItem>
                    <ListItem><ListItemText primary="Location" secondary={
                      userInfo.vendorInfo.location ? 
                        `${userInfo.vendorInfo.location.city || ''}, ${userInfo.vendorInfo.location.state || ''}`.trim() : 
                        'Not specified'
                    } /></ListItem>
                    <ListItem><ListItemText primary="Contact" secondary={userInfo.vendorInfo.phone || 'Not specified'} /></ListItem>
                    <ListItem><ListItemText primary="Price Range" secondary={
                      userInfo.vendorInfo.priceRange ? 
                        `₹${userInfo.vendorInfo.priceRange.min || 0} - ₹${userInfo.vendorInfo.priceRange.max || 0}` : 
                        'Not specified'
                    } /></ListItem>
                    <ListItem><ListItemText primary="Description" secondary={userInfo.vendorInfo.serviceDescription || 'No description available'} /></ListItem>
                  </List>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    Please create your business profile to start receiving bookings
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Recent Bookings</Typography>
                <Divider sx={{ mb: 2 }} />
                <List>
                  {bookings.length > 0 ? (
                    bookings.map((booking) => (
                      <ListItem
                        key={booking._id}
                        sx={{
                          bgcolor: 'background.paper',
                          borderRadius: 1,
                          mb: 1,
                          '&:hover': { bgcolor: 'action.hover' },
                        }}
                      >
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          {booking.customerName?.charAt(0) || 'C'}
                        </Avatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="subtitle1">
                                {booking.customerName}
                              </Typography>
                              {getStatusChip(booking.status)}
                            </Box>
                          }
                          secondary={
                            <>
                              <Typography variant="body2" color="text.secondary">
                                Customer Email: {booking.customerEmail}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Customer Phone: {booking.customerPhone}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Date: {new Date(booking.eventDate).toLocaleDateString()}
                              </Typography>
                              {booking.message && (
                                <Typography variant="body2" color="text.secondary">
                                  Message: {booking.message}
                                </Typography>
                              )}
                            </>
                          }
                        />
                        <Tooltip title="View Details">
                          <IconButton
                            edge="end"
                            onClick={() => handleViewBooking(booking._id)}
                            sx={{ ml: 2 }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </ListItem>
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No bookings yet
                    </Typography>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Dialog open={isProfileDialogOpen} onClose={() => setIsProfileDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{userInfo?.vendorInfo ? 'Update Business Profile' : 'Create Business Profile'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField 
              fullWidth 
              label="Business Name" 
              value={profileData.businessName} 
              onChange={(e) => setProfileData({ ...profileData, businessName: e.target.value })} 
              margin="normal" 
            />
            <TextField 
              fullWidth 
              label="Service Category" 
              value={profileData.serviceCategory} 
              onChange={(e) => setProfileData({ ...profileData, serviceCategory: e.target.value })} 
              margin="normal" 
            />
            <TextField 
              fullWidth 
              label="City" 
              value={profileData.location.city} 
              onChange={(e) => setProfileData({ 
                ...profileData, 
                location: { ...profileData.location, city: e.target.value } 
              })} 
              margin="normal" 
            />
            <TextField 
              fullWidth 
              label="State" 
              value={profileData.location.state} 
              onChange={(e) => setProfileData({ 
                ...profileData, 
                location: { ...profileData.location, state: e.target.value } 
              })} 
              margin="normal" 
            />
            <TextField 
              fullWidth 
              label="Address" 
              value={profileData.location.address} 
              onChange={(e) => setProfileData({ 
                ...profileData, 
                location: { ...profileData.location, address: e.target.value } 
              })} 
              margin="normal" 
            />
            <TextField 
              fullWidth 
              label="Phone" 
              value={profileData.phone} 
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} 
              margin="normal" 
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField 
                  fullWidth 
                  type="number"
                  label="Minimum Price (₹)" 
                  value={profileData.priceRange.min} 
                  onChange={(e) => setProfileData({ 
                    ...profileData, 
                    priceRange: { ...profileData.priceRange, min: Number(e.target.value) } 
                  })} 
                  margin="normal" 
                />
              </Grid>
              <Grid item xs={6}>
                <TextField 
                  fullWidth 
                  type="number"
                  label="Maximum Price (₹)" 
                  value={profileData.priceRange.max} 
                  onChange={(e) => setProfileData({ 
                    ...profileData, 
                    priceRange: { ...profileData.priceRange, max: Number(e.target.value) } 
                  })} 
                  margin="normal" 
                />
              </Grid>
            </Grid>
            <TextField 
              fullWidth 
              label="Service Description" 
              value={profileData.serviceDescription} 
              onChange={(e) => setProfileData({ ...profileData, serviceDescription: e.target.value })} 
              margin="normal" 
              multiline 
              rows={4} 
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsProfileDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleProfileUpdate} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VendorDashboard;