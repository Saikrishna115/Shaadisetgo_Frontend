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
  Chip,
  Rating,
  Tab,
  Tabs,
  Alert,
  TextField,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material';
import {
  Edit as EditIcon,
  Event as EventIcon,
  Cancel as CancelIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  Category as CategoryIcon,
  Group as GroupIcon,
  Money as MoneyIcon,
  Chat as ChatIcon,
  Favorite as FavoriteIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState({
    profile: {
      firstName: '',
      email: '',
      phone: ''
    },
    bookings: [],
    quotes: [],
    favorites: []
  });

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

      const [profileRes, bookingsRes, quotesRes, favoritesRes] = await Promise.all([
        api.get('/users/profile', config),
        api.get('/bookings/customer', config),
        api.get('/quotes/customer', config),
        api.get('/favorites', config)
      ]);

      setDashboardData({
        profile: profileRes.data,
        bookings: bookingsRes.data,
        quotes: quotesRes.data,
        favorites: favoritesRes.data
      });

      setError('');
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="dashboard-container">
      <Box className="dashboard-header">
        <Typography variant="h4" gutterBottom>
          Welcome back, {dashboardData.profile.firstName}!
        </Typography>
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={() => navigate('/vendors')}
        >
          Find More Vendors
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Active Bookings Section */}
        <Grid item xs={12}>
          <Paper className="section-paper">
            <Typography variant="h6" gutterBottom>Active Bookings</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Vendor</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboardData.bookings.map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell>{booking.vendor.businessName}</TableCell>
                      <TableCell>{new Date(booking.eventDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Chip
                          label={booking.status}
                          color={booking.status === 'CONFIRMED' ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => navigate(`/bookings/${booking._id}`)}
                        >
                          View Details
                        </Button>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => navigate(`/chat/${booking.vendor._id}`)}
                        >
                          <ChatIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Quotes Requested Section */}
        <Grid item xs={12} md={6}>
          <Paper className="section-paper">
            <Typography variant="h6" gutterBottom>Pending Quotes</Typography>
            <List>
              {dashboardData.quotes.map((quote) => (
                <ListItem
                  key={quote._id}
                  secondaryAction={
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate(`/quotes/${quote._id}`)}
                    >
                      View Quote
                    </Button>
                  }
                >
                  <ListItemText
                    primary={quote.vendor.businessName}
                    secondary={`Requested on ${new Date(quote.createdAt).toLocaleDateString()}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Favorites Section */}
        <Grid item xs={12} md={6}>
          <Paper className="section-paper">
            <Typography variant="h6" gutterBottom>Your Saved Vendors</Typography>
            <List>
              {dashboardData.favorites.map((favorite) => (
                <ListItem
                  key={favorite._id}
                  secondaryAction={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => navigate(`/vendors/${favorite.vendor._id}`)}
                      >
                        View Profile
                      </Button>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => navigate(`/chat/${favorite.vendor._id}`)}
                      >
                        <ChatIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={favorite.vendor.businessName}
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Rating value={favorite.vendor.rating} readOnly size="small" />
                        <Typography variant="body2" color="text.secondary">
                          ({favorite.vendor.reviewCount} reviews)
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CustomerDashboard;