import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { Edit as EditIcon, Event as EventIcon, Business as BusinessIcon } from '@mui/icons-material';
import './Dashboard.css';

const VendorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [bookings, setBookings] = useState([]);
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

    if (!token || userRole !== 'vendor') {
      navigate('/login');
      return;
    }

    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const userResponse = await axios.get('https://shaadisetgo-backend.onrender.com/api/auth/profile', config);
      let userData = userResponse.data;

      // Fetch vendor-specific information
      const vendorResponse = await axios.get(`https://shaadisetgo-backend.onrender.com/api/vendors/user/${userData._id}`, config);
      userData = { ...userData, vendorInfo: vendorResponse.data };

      // Fetch vendor's bookings
      const bookingsResponse = await axios.get('https://shaadisetgo-backend.onrender.com/api/bookings/vendor', config);
      
      setUserInfo(userData);
      setBookings(bookingsResponse.data);
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
      const token = localStorage.getItem('token');
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
      fetchDashboardData(); // Refresh data
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

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {userInfo?.vendorInfo?.businessName || user?.name || 'Vendor'}
        </Typography>

        <Grid container spacing={3}>
          {/* Quick Actions */}
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

          {/* Business Profile */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Business Profile</Typography>
                <Divider sx={{ mb: 2 }} />
                {userInfo?.vendorInfo ? (
                  <List>
                    <ListItem>
                      <ListItemText primary="Business Name" secondary={userInfo.vendorInfo.businessName} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Service Type" secondary={userInfo.vendorInfo.serviceType} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Location" secondary={userInfo.vendorInfo.location} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Contact" secondary={userInfo.vendorInfo.contact} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Price Range" secondary={userInfo.vendorInfo.priceRange} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Description" secondary={userInfo.vendorInfo.description} />
                    </ListItem>
                  </List>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    Please create your business profile to start receiving bookings
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Bookings */}
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
                        secondaryAction={
                          <IconButton edge="end" onClick={() => navigate(`/bookings/${booking._id}`)}>
                            <EditIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText
                          primary={`${booking.customerName} - ${booking.serviceType}`}
                          secondary={`Status: ${booking.status} | Date: ${new Date(booking.eventDate).toLocaleDateString()}`}
                        />
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

      {/* Profile Edit Dialog */}
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
              label="Service Type"
              value={profileData.serviceType}
              onChange={(e) => setProfileData({ ...profileData, serviceType: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Location"
              value={profileData.location}
              onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Contact"
              value={profileData.contact}
              onChange={(e) => setProfileData({ ...profileData, contact: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Price Range"
              value={profileData.priceRange}
              onChange={(e) => setProfileData({ ...profileData, priceRange: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              value={profileData.description}
              onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
              margin="normal"
              multiline
              rows={4}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsProfileDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleProfileUpdate} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VendorDashboard;