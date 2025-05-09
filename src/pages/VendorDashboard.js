import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import VendorProfileForm from '../components/VendorProfileForm/VendorProfileForm';
import { CircularProgress } from '@mui/material';
import './Dashboard.css';

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);

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
      setLoading(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load dashboard data';
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (profileData) => {
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
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Vendor Dashboard</h1>
      </div>

      <div className="dashboard-content">
        <section className="profile-section">
          <h2>Business Profile</h2>
          {editMode ? (
            <VendorProfileForm
              initialData={{
                businessName: userInfo.vendorInfo?.businessName || '',
                serviceType: userInfo.vendorInfo?.serviceType || '',
                location: userInfo.vendorInfo?.location || '',
                contact: userInfo.vendorInfo?.contact || '',
                priceRange: userInfo.vendorInfo?.priceRange || '',
                description: userInfo.vendorInfo?.description || ''
              }}
              onSubmit={handleProfileUpdate}
            />
          ) : (
            <div className="vendor-info">
              {userInfo.vendorInfo ? (
                <>
                  <p><strong>Business Name:</strong> {userInfo.vendorInfo.businessName}</p>
                  <p><strong>Service Type:</strong> {userInfo.vendorInfo.serviceType}</p>
                  <p><strong>Location:</strong> {userInfo.vendorInfo.location}</p>
                  <p><strong>Contact:</strong> {userInfo.vendorInfo.contact}</p>
                  <p><strong>Price Range:</strong> {userInfo.vendorInfo.priceRange}</p>
                  <p><strong>Description:</strong> {userInfo.vendorInfo.description}</p>
                  <button onClick={() => setEditMode(true)} className="edit-btn">
                    Edit Profile
                  </button>
                </>
              ) : (
                <>
                  <p>Please complete your vendor profile to start receiving bookings.</p>
                  <button onClick={() => setEditMode(true)} className="edit-btn">
                    Create Profile
                  </button>
                </>
              )}
            </div>
          )}
        </section>

        <section className="bookings-section">
          <h2>Booking Requests</h2>
          {bookings.length > 0 ? (
            <div className="bookings-list">
              {bookings.map((booking) => (
                <div key={booking._id} className="booking-card">
                  <div className="booking-header">
                    <h3>Booking #{booking._id.slice(-6)}</h3>
                    <span className={`status ${booking.status.toLowerCase()}`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="booking-details">
                    <p><strong>Customer:</strong> {booking.customerName}</p>
                    <p><strong>Date:</strong> {new Date(booking.eventDate).toLocaleDateString()}</p>
                    <p><strong>Service:</strong> {booking.serviceType}</p>
                    <p><strong>Status:</strong> {booking.status}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-bookings">You haven't received any bookings yet.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default VendorDashboard;