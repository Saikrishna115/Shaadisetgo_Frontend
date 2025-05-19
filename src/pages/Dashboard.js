import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import VendorProfileForm from '../components/VendorProfileForm';
import UserProfileForm from '../components/UserProfileForm';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';

const initialProfileState = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  eventType: '',
  eventDate: null,
  budget: '',
  guestCount: '',
  businessName: '',
  serviceType: '',
  location: '',
  contact: '',
  priceRange: '',
  description: ''
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(initialProfileState);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [userInfo, setUserInfo] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
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

      const [profileRes, bookingsRes] = await Promise.all([
        axios.get('/users/profile', config),
        axios.get('/bookings', config)
      ]);

      setUserInfo(profileRes.data);
      setProfileData(profileRes.data);
      setBookings(bookingsRes.data);
      setError('');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load dashboard data';
      setError(errorMessage);
    } finally {
      setLoading(false);
      setProfileLoading(false);
      setBookingsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.clear();
      setError('Please login to view dashboard');
      setLoading(false);
      return;
    }

    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleProfileUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please login again.');
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const requiredFields = userInfo?.role === 'vendor'
        ? ['businessName', 'serviceType', 'location', 'contact']
        : ['name', 'email', 'phone'];

      const missingFields = requiredFields.filter(field => !profileData[field]);
      if (missingFields.length > 0) {
        setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
      }

      const response = await axios.put('/users/profile', profileData, config);
      setUserInfo(response.data);
      setProfileData(response.data);
      setError('');
      setSuccessMessage('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const renderProfileSection = () => (
    <Box>
      <Typography variant="h5" gutterBottom>
        {userInfo?.role === 'vendor' ? 'Vendor Profile' : 'Your Profile'}
      </Typography>
      {isEditing ? (
        userInfo?.role === 'vendor' ? (
          <VendorProfileForm
            initialData={profileData}
            onSuccess={handleProfileUpdate}
            isEditing={isEditing}
          />
        ) : (
          <UserProfileForm
            initialData={profileData}
            onSuccess={handleProfileUpdate}
            isEditing={isEditing}
          />
        )
      ) : (
        <Box>
          {userInfo?.role === 'vendor' ? (
            userInfo.vendorInfo ? (
              <>
                <Typography><strong>Business Name:</strong> {userInfo.vendorInfo.businessName}</Typography>
                <Typography><strong>Service Type:</strong> {userInfo.vendorInfo.serviceType}</Typography>
                <Typography><strong>Location:</strong> {userInfo.vendorInfo.location}</Typography>
                <Typography><strong>Contact:</strong> {userInfo.vendorInfo.contact}</Typography>
                <Typography><strong>Price Range:</strong> {userInfo.vendorInfo.priceRange}</Typography>
                <Typography><strong>Description:</strong> {userInfo.vendorInfo.description}</Typography>
              </>
            ) : (
              <Typography>Please complete your vendor profile to start receiving bookings.</Typography>
            )
          ) : (
            <>
              <Typography><strong>Name:</strong> {userInfo.name}</Typography>
              <Typography><strong>Email:</strong> {userInfo.email}</Typography>
            </>
          )}
          <Button
            variant="contained"
            onClick={() => setIsEditing(true)}
            sx={{ mt: 2 }}
          >
            {userInfo?.role === 'vendor' && !userInfo.vendorInfo ? 'Create Profile' : 'Edit Profile'}
          </Button>
        </Box>
      )}
    </Box>
  );

  const renderBookingsSection = () => (
    <Box>
      <Typography variant="h5" gutterBottom>
        Your Bookings
      </Typography>
      <Grid container spacing={3}>
        {bookings.length > 0 ? (
          bookings.map(booking => (
            <Grid item xs={12} sm={6} md={4} key={booking._id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" component="div">
                      {userInfo?.role === 'vendor' ? booking.customerName : booking.vendorName}
                    </Typography>
                    <Chip
                      label={booking.status}
                      color={booking.status === 'PENDING' ? 'warning' : booking.status === 'CONFIRMED' ? 'success' : 'error'}
                      size="small"
                    />
                  </Box>
                  <Typography color="text.secondary" gutterBottom>
                    <strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}
                  </Typography>
                  <Typography color="text.secondary" gutterBottom>
                    <strong>Service:</strong> {booking.service}
                  </Typography>
                  <Typography color="text.secondary" gutterBottom>
                    <strong>Amount:</strong> ₹{booking.amount}
                  </Typography>
                  {userInfo?.role !== 'vendor' && booking.status === 'PENDING' && (
                    <Box sx={{ mt: 2 }}>
                      <Button variant="outlined" color="error" fullWidth>
                        Cancel Booking
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">
                {userInfo?.role === 'vendor' ? "You haven't received any bookings yet." : "You haven't made any bookings yet."}
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );

  if (loading || profileLoading || bookingsLoading) {
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Account Type: {userInfo?.role}
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab === 'profile' ? 0 : 1} onChange={(e, newValue) => setActiveTab(newValue === 0 ? 'profile' : 'bookings')}>
          <Tab label="Profile" />
          <Tab label="Bookings" />
        </Tabs>
      </Box>

      <Box sx={{ mt: 3 }}>
        {activeTab === 'profile' ? renderProfileSection() : renderBookingsSection()}
      </Box>
    </Container>
  );
};

export default Dashboard;
