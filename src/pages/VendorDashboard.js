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
  }, [navigate]);

  useEffect(() => {
    if (!user) {
      return;
    }
    if (user.role !== 'vendor') {
      navigate('/login', { replace: true, state: { message: 'Unauthorized access. Please login as a vendor.' } });
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        navigate('/login', { replace: true, state: { message: 'Please login to continue' } });
        return;
      }

      // Log token details (without exposing the full token)
      console.log('Token check:', {
        exists: !!token,
        length: token.length,
        prefix: token.substring(0, 10) + '...'
      });

      // Fetch vendor profile
      try {
        console.log('Fetching vendor profile...');
        const vendorProfileResponse = await axios.get('/vendors/profile');
        console.log('Vendor profile response:', {
          status: vendorProfileResponse.status,
          success: vendorProfileResponse.data?.success,
          hasVendor: !!vendorProfileResponse.data?.vendor
        });
        
        if (!vendorProfileResponse.data) {
          console.error('No data in vendor profile response');
          setError('Vendor profile not found');
          setLoading(false);
          return;
        }

        const vendorData = vendorProfileResponse.data.vendor;
        if (!vendorData) {
          console.error('No vendor data in response:', vendorProfileResponse.data);
          setError('Invalid vendor profile data');
          setLoading(false);
          return;
        }

        setUserInfo({ ...user, vendorInfo: vendorData });
        
        // Update profile data
        setProfileData({
          businessName: vendorData.businessName || '',
          serviceType: vendorData.serviceCategory || '',
          location: vendorData.location?.city ? `${vendorData.location.city}, ${vendorData.location.state}` : '',
          contact: vendorData.phone || '',
          priceRange: vendorData.priceRange ? `₹${vendorData.priceRange.min} - ₹${vendorData.priceRange.max}` : '',
          description: vendorData.serviceDescription || ''
        });

        // Fetch bookings
        try {
          console.log('Fetching bookings...');
          const bookingsResponse = await axios.get('/bookings/vendor');
          console.log('Bookings response:', {
            status: bookingsResponse.status,
            count: bookingsResponse.data?.length || 0
          });
          
          const bookingsData = bookingsResponse.data;
          setBookings(bookingsData);
          setAnalytics(calculateAnalytics(bookingsData));
        } catch (bookingError) {
          console.error('Error fetching bookings:', {
            message: bookingError.message,
            response: bookingError.response?.data,
            status: bookingError.response?.status,
            stack: bookingError.stack
          });
          // Don't fail completely if bookings can't be fetched
          setBookings([]);
          setAnalytics({
            totalBookings: 0,
            revenue: 0,
            rating: 0,
            activeCustomers: 0,
            bookingGrowth: 0,
            revenueGrowth: 0,
          });
        }
      } catch (vendorError) {
        console.error('Error fetching vendor profile:', {
          message: vendorError.message,
          response: vendorError.response?.data,
          status: vendorError.response?.status,
          stack: vendorError.stack,
          code: vendorError.code
        });

        // Handle specific error cases
        if (vendorError.code === 'ECONNABORTED') {
          setError('Request timed out. Please try again.');
        } else if (!vendorError.response) {
          setError('Network error. Please check your internet connection.');
        } else {
          const errorMessage = vendorError.response?.data?.message 
            || vendorError.response?.data?.error 
            || vendorError.message 
            || 'Failed to load vendor profile. Please try again.';
          setError(errorMessage);
        }
      }

      setLoading(false);
    } catch (err) {
      console.error('Dashboard error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        stack: err.stack,
        code: err.code
      });

      // Handle different types of errors
      if (err.code === 'ECONNABORTED') {
        setError('Request timed out. Please try again.');
      } else if (!err.response) {
        setError('Network error. Please check your internet connection.');
      } else {
        const errorMessage = err.response?.data?.message 
          || err.response?.data?.error 
          || err.message 
          || 'Failed to load dashboard data';
        setError(errorMessage);
      }
      
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      let response;
      if (userInfo.vendorInfo) {
        response = await axios.put(
          `/vendors/${userInfo.vendorInfo._id}`,
          profileData
        );
      } else {
        response = await axios.post(
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
