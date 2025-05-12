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
  Chip,
  Avatar,
  Tooltip,
  Rating,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import {
  Edit as EditIcon,
  Event as EventIcon,
  Favorite as FavoriteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  CalendarMonth as CalendarIcon,
} from '@mui/icons-material';
import DashboardAnalytics from '../components/DashboardAnalytics/DashboardAnalytics';
import './Dashboard.css';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState({
    activeBookings: 0,
    totalSpent: 0,
    favoriteVendors: 0,
    completedEvents: 0,
  });
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
      const bookingsData = bookingsResponse.data;
      setBookings(bookingsData);

      // Calculate analytics
      const activeBookings = bookingsData.filter(b => b.status === 'confirmed' || b.status === 'pending').length;
      const totalSpent = bookingsData.reduce((sum, b) => sum + (b.amount || 0), 0);
      const completedEvents = bookingsData.filter(b => b.status === 'completed').length;

      setAnalytics({
        activeBookings,
        totalSpent,
        favoriteVendors: favoriteVendors.length,
        completedEvents,
      });

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
          Welcome, {user?.name || 'Customer'}
        </Typography>

        <Box sx={{ mb: 4 }}>
          <DashboardAnalytics stats={analytics} userType="customer" />
        </Box>

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
                      <ListItem
                        key={event._id}
                        sx={{
                          bgcolor: 'background.paper',
                          borderRadius: 1,
                          mb: 1,
                          '&:hover': { bgcolor: 'action.hover' },
                        }}
                      >
                        <CalendarIcon sx={{ mr: 2, color: 'primary.main' }} />
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1">
                              {event.title}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary">
                              {new Date(event.date).toLocaleDateString()}
                            </Typography>
                          }
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
                        sx={{
                          bgcolor: 'background.paper',
                          borderRadius: 1,
                          mb: 1,
                          '&:hover': { bgcolor: 'action.hover' },
                        }}
                      >
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          {booking.vendorName?.charAt(0) || 'V'}
                        </Avatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="subtitle1">
                                {booking.vendorName}
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
                        <Card variant="outlined" sx={{
                            '&:hover': { boxShadow: 3 },
                            transition: 'box-shadow 0.3s',
                          }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Avatar sx={{ mr: 1, bgcolor: 'secondary.main' }}>
                                {vendor.businessName?.charAt(0) || 'V'}
                              </Avatar>
                              <Typography variant="subtitle1">{vendor.businessName}</Typography>
                            </Box>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                              {vendor.serviceType}
                            </Typography>
                            {vendor.rating && (
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Rating value={vendor.rating} readOnly size="small" />
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                  ({vendor.rating})
                                </Typography>
                              </Box>
                            )}
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                size="small"
                                variant="contained"
                                color="primary"
                                onClick={() => navigate(`/vendors/${vendor._id}`)}
                              >
                                View Profile
                              </Button>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => navigate(`/vendors/${vendor._id}`)}
                              >
                                <FavoriteIcon />
                              </IconButton>
                            </Box>
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