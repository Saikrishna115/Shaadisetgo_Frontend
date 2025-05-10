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
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { Edit as EditIcon, Event as EventIcon } from '@mui/icons-material';
import './Dashboard.css';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [favoriteVendors, setFavoriteVendors] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
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

      // Fetch customer's bookings
      const bookingsResponse = await axios.get('https://shaadisetgo-backend.onrender.com/api/bookings/customer', config);
      setBookings(bookingsResponse.data);

      // Fetch upcoming events (assuming there's an endpoint for this)
      const eventsResponse = await axios.get('https://shaadisetgo-backend.onrender.com/api/events/upcoming', config);
      setUpcomingEvents(eventsResponse.data);

      // Fetch favorite vendors
      const favoritesResponse = await axios.get('https://shaadisetgo-backend.onrender.com/api/favorites', config);
      setFavoriteVendors(favoritesResponse.data);

      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
      setLoading(false);
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
          Welcome, {user?.name || 'Customer'}
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
                  onClick={() => navigate('/vendors')}
                >
                  Browse Vendors
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/profile')}
                  startIcon={<EditIcon />}
                >
                  Edit Profile
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

          {/* Upcoming Events */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Upcoming Events</Typography>
                <Divider sx={{ mb: 2 }} />
                <List>
                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.map((event) => (
                      <ListItem key={event._id}>
                        <ListItemText
                          primary={event.title}
                          secondary={new Date(event.date).toLocaleDateString()}
                        />
                      </ListItem>
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No upcoming events
                    </Typography>
                  )}
                </List>
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
                          primary={`${booking.vendorName} - ${booking.serviceType}`}
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

          {/* Favorite Vendors */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Favorite Vendors</Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  {favoriteVendors.length > 0 ? (
                    favoriteVendors.map((vendor) => (
                      <Grid item xs={12} sm={6} md={4} key={vendor._id}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle1">{vendor.businessName}</Typography>
                            <Typography variant="body2" color="textSecondary">
                              {vendor.serviceType}
                            </Typography>
                            <Button
                              size="small"
                              color="primary"
                              onClick={() => navigate(`/vendors/${vendor._id}`)}
                            >
                              View Profile
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary">
                        No favorite vendors yet
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default CustomerDashboard;