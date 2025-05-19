import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Tab,
  Tabs,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import BookingList from '../components/BookingList';
import BookingStats from '../components/BookingStats';
import BookingCalendar from '../components/BookingCalendar';

const VendorBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('list');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/bookings/vendor');
      setBookings(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      setLoading(true);
      const response = await axios.put(`/bookings/${bookingId}`, {
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
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Booking Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <BookingStats bookings={bookings} />
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={view}
          onChange={(e, newValue) => setView(newValue)}
          aria-label="booking view tabs"
        >
          <Tab label="List View" value="list" />
          <Tab label="Calendar View" value="calendar" />
        </Tabs>
      </Box>

      {view === 'list' ? (
        <BookingList
          bookings={bookings}
          onStatusChange={handleStatusChange}
        />
      ) : (
        <BookingCalendar bookings={bookings} />
      )}
    </Container>
  );
};

export default VendorBookings; 