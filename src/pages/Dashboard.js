import React, { useState, useEffect } from 'react';
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
  Paper
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.clear();
      setError('Please login to view dashboard');
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setProfileLoading(true);
        const config = {
          headers: { Authorization: `Bearer ${token}` },
          validateStatus: status => status < 500
        };

        const [userResponse, bookingsResponse] = await Promise.all([
          axios.get('/auth/me', config),
          axios.get('/bookings', config)
        ]);

        const bookingsData = Array.isArray(bookingsResponse.data) ? bookingsResponse.data : [];
        let userData = userResponse.data;

        if (userData.role === 'vendor') {
          const vendorResponse = await axios.get(`/vendors/user/${userData._id}`, config);
          userData = { ...userData, vendorInfo: vendorResponse.data };
        }

        setUserInfo(userData);
        setBookings(bookingsData);
        setProfileData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address || '',
          city: userData.city || '',
          state: userData.state || '',
          pincode: userData.pincode || '',
          eventType: userData.eventType || '',
          eventDate: userData.eventDate ? new Date(userData.eventDate) : null,
          budget: userData.budget || '',
          guestCount: userData.guestCount || '',
          businessName: userData.vendorInfo?.businessName || '',
          serviceType: userData.vendorInfo?.serviceType || '',
          location: userData.vendorInfo?.location || '',
          contact: userData.vendorInfo?.contact || '',
          priceRange: userData.vendorInfo?.priceRange || '',
          description: userData.vendorInfo?.description || ''
        });
        setLoading(false);
        setProfileLoading(false);
        setBookingsLoading(false);
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load dashboard data';
        setError(errorMessage);
        setLoading(false);
        setProfileLoading(false);
        setBookingsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading || profileLoading || bookingsLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

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

      let response;
      if (userInfo.role === 'vendor') {
        if (userInfo.vendorInfo) {
          response = await axios.put(`/vendors/${userInfo.vendorInfo._id}`, profileData, config);
        } else {
          response = await axios.post('/vendors', profileData, config);
        }
      } else {
        // For customer profile update
        const customerData = {
          fullName: profileData.name,  // Map 'name' from form to 'fullName' for backend
          email: profileData.email,
          phone: profileData.phone,
          address: profileData.address,
          city: profileData.city,
          state: profileData.state,
          pincode: profileData.pincode,
          preferences: {
            eventType: profileData.eventType,
            eventDate: profileData.eventDate,
            budget: profileData.budget,
            guestCount: profileData.guestCount
          }
        };
        response = await axios.put('/users/profile', customerData, config);
      }

      if (response.data) {
        setSuccessMessage('Profile updated successfully!');
        setError('');
        setIsEditing(false);
        const updatedData = response.data;
        if (userInfo.role === 'vendor') {
          setUserInfo(prev => ({
            ...prev,
            vendorInfo: updatedData
          }));
        } else {
          setUserInfo(prev => ({
            ...prev,
            ...updatedData
          }));
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update profile';
      setError(errorMessage);
      setSuccessMessage('');
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
    <div className="profile-section">
      <h2>{userInfo?.role === 'vendor' ? 'Vendor Profile' : 'Your Profile'}</h2>
      {isEditing ? (
        userInfo?.role === 'vendor' ? (
          <VendorProfileForm
            profileData={profileData}
            handleInputChange={handleInputChange}
            handleProfileUpdate={handleProfileUpdate}
            setIsEditing={setIsEditing}
            error={error}
            successMessage={successMessage}
          />
        ) : (
          <UserProfileForm
            profileData={profileData}
            handleInputChange={handleInputChange}
            handleProfileUpdate={handleProfileUpdate}
            setIsEditing={setIsEditing}
            error={error}
            successMessage={successMessage}
          />
        )
      ) : (
        <div className={userInfo?.role === 'vendor' ? 'vendor-info' : 'customer-info'}>
          {userInfo?.role === 'vendor' ? (
            userInfo.vendorInfo ? (
              <>
                <p><strong>Business Name:</strong> {userInfo.vendorInfo.businessName}</p>
                <p><strong>Service Type:</strong> {userInfo.vendorInfo.serviceType}</p>
                <p><strong>Location:</strong> {userInfo.vendorInfo.location}</p>
                <p><strong>Contact:</strong> {userInfo.vendorInfo.contact}</p>
                <p><strong>Price Range:</strong> {userInfo.vendorInfo.priceRange}</p>
                <p><strong>Description:</strong> {userInfo.vendorInfo.description}</p>
              </>
            ) : (
              <p>Please complete your vendor profile to start receiving bookings.</p>
            )
          ) : (
            <>
              <p><strong>Name:</strong> {userInfo.name}</p>
              <p><strong>Email:</strong> {userInfo.email}</p>
            </>
          )}
          <button onClick={() => setIsEditing(true)} className="edit-btn">
            {userInfo?.role === 'vendor' && !userInfo.vendorInfo ? 'Create Profile' : 'Edit Profile'}
          </button>
        </div>
      )}
    </div>
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

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {userInfo?.name}
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
      </Box>
    </Container>
  );
};

export default Dashboard;
