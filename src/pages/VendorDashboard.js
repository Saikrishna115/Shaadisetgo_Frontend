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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  Tooltip,
} from '@mui/material';
import DashboardAnalytics from '../components/DashboardAnalytics/DashboardAnalytics';
import { useAuth } from '../context/AuthContext';
import {
  Edit as EditIcon,
  Event as EventIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import './Dashboard.css';
import { useAuth } from '../context/AuthContext';
import { Edit as EditIcon, Event as EventIcon, Business as BusinessIcon } from '@mui/icons-material';
import './Dashboard.css';

const VendorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
    serviceType: '',
    location: '',
    contact: '',
    priceRange: '',
    description: ''
  });

  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (!token || userRole !== 'vendor') {
    navigate('/login', { replace: true });
    return null;
  }

  useEffect(() => {
    if (user && !userInfo) {
      fetchDashboardData();
    }
  }, [user, userInfo]);

  const fetchDashboardData = async () => {
    const calculateAnalytics = (bookings) => {
      const totalBookings = bookings.length;
      const revenue = bookings.reduce((sum, booking) => sum + (booking.amount || 0), 0);
      const completedBookings = bookings.filter(b => b.status === 'completed');
      const rating = completedBookings.reduce((sum, b) => sum + (b.rating || 0), 0) / (completedBookings.length || 1);
      const uniqueCustomers = new Set(bookings.map(b => b.customerId)).size;
      
      // Calculate growth (mock data - replace with actual calculations)
      const bookingGrowth = 15;
      const revenueGrowth = 20;

      return {
        totalBookings,
        revenue,
        rating,
        activeCustomers: uniqueCustomers,
        bookingGrowth,
        revenueGrowth,
      };
    };
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const userResponse = await axios.get('https://shaadisetgo-backend.onrender.com/api/auth/profile', config);
      let userData = userResponse.data;

      const vendorResponse = await axios.get(`https://shaadisetgo-backend.onrender.com/api/vendors/user/${userData._id}`, config);
      userData = { ...userData, vendorInfo: vendorResponse.data };

      const bookingsResponse = await axios.get('https://shaadisetgo-backend.onrender.com/api/bookings/vendor', config);

      setUserInfo(userData);
      const bookingsData = bookingsResponse.data;
      setBookings(bookingsData);
      setAnalytics(calculateAnalytics(bookingsData));

      if (userData.vendorInfo) {
        setProfileData({
          businessName: userData.vendorInfo.businessName || '',
          serviceType: userData.vendorInfo.serviceType || '',
          location: userData.vendorInfo.location || '',
          contact: userData.vendorInfo.contact || '',
          priceRange: userData.vendorInfo.priceRange || '',
          description: userData.vendorInfo.description || ''
        });
      }
      setLoading(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load dashboard data';
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      let response;
      if (userInfo.vendorInfo) {
        response = await axios.put(
          `https://shaadisetgo-backend.onrender.com/api/vendors/${userInfo.vendorInfo._id}`,
          profileData,
          config
        );
      } else {
        response = await axios.post(
          'https://shaadisetgo-backend.onrender.com/api/vendors',
          profileData,
          config
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

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box sx={{ mt: 4 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Container>
    );
  }

  const getStatusChip = (status) => {
    const statusConfig = {
      pending: { color: 'warning', icon: <ScheduleIcon />, label: 'Pending' },
      confirmed: { color: 'success', icon: <CheckCircleIcon />, label: 'Confirmed' },
      cancelled: { color: 'error', icon: <CancelIcon />, label: 'Cancelled' },
      completed: { color: 'info', icon: <CheckCircleIcon />, label: 'Completed' },
    };

    const config = statusConfig[status.toLowerCase()] || statusConfig.pending;

    return (
      <Chip
        icon={config.icon}
        label={config.label}
        color={config.color}
        size="small"
        sx={{ ml: 1 }}
      />
    );
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {userInfo?.vendorInfo?.businessName || user?.name || 'Vendor'}
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
                  onClick={() => navigate('/profile')}
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
                    <ListItem><ListItemText primary="Service Type" secondary={userInfo.vendorInfo.serviceType} /></ListItem>
                    <ListItem><ListItemText primary="Location" secondary={userInfo.vendorInfo.location} /></ListItem>
                    <ListItem><ListItemText primary="Contact" secondary={userInfo.vendorInfo.contact} /></ListItem>
                    <ListItem><ListItemText primary="Price Range" secondary={userInfo.vendorInfo.priceRange} /></ListItem>
                    <ListItem><ListItemText primary="Description" secondary={userInfo.vendorInfo.description} /></ListItem>
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
                                Service: {booking.serviceType}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Date: {new Date(booking.eventDate).toLocaleDateString()}
                              </Typography>
                              {booking.amount && (
                                <Typography variant="body2" color="primary">
                                  Amount: ₹{booking.amount}
                                </Typography>
                              )}
                            </>
                          }
                        />
                        <Tooltip title="View Details">
                          <IconButton
                            edge="end"
                            onClick={() => navigate(`/bookings/${booking._id}`)}
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
            <TextField fullWidth label="Business Name" value={profileData.businessName} onChange={(e) => setProfileData({ ...profileData, businessName: e.target.value })} margin="normal" />
            <TextField fullWidth label="Service Type" value={profileData.serviceType} onChange={(e) => setProfileData({ ...profileData, serviceType: e.target.value })} margin="normal" />
            <TextField fullWidth label="Location" value={profileData.location} onChange={(e) => setProfileData({ ...profileData, location: e.target.value })} margin="normal" />
            <TextField fullWidth label="Contact" value={profileData.contact} onChange={(e) => setProfileData({ ...profileData, contact: e.target.value })} margin="normal" />
            <TextField fullWidth label="Price Range" value={profileData.priceRange} onChange={(e) => setProfileData({ ...profileData, priceRange: e.target.value })} margin="normal" />
            <TextField fullWidth label="Description" value={profileData.description} onChange={(e) => setProfileData({ ...profileData, description: e.target.value })} margin="normal" multiline rows={4} />
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
