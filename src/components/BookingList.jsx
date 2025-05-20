import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Grid,
  Paper
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const BookingList = ({ bookings, onStatusChange }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const handleMenuClick = (event, booking) => {
    setAnchorEl(event.currentTarget);
    setSelectedBooking(booking);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBooking(null);
  };

  const handleStatusChange = async (newStatus) => {
    if (selectedBooking && onStatusChange) {
      await onStatusChange(selectedBooking._id, newStatus);
    }
    handleMenuClose();
  };

  const filteredBookings = bookings
    .filter(booking => {
      const matchesSearch = 
        booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.status.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.eventDate) - new Date(a.eventDate);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'customer':
          return a.customerName.localeCompare(b.customerName);
        default:
          return 0;
      }
    });

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            select
            fullWidth
            variant="outlined"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FilterIcon />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="confirmed">Confirmed</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            select
            fullWidth
            variant="outlined"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SortIcon />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="date">Sort by Date</MenuItem>
            <MenuItem value="status">Sort by Status</MenuItem>
            <MenuItem value="customer">Sort by Customer</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      {filteredBookings.length > 0 ? (
        filteredBookings.map((booking) => (
          <Paper
            key={booking._id}
            sx={{
              p: 2,
              mb: 2,
              cursor: 'pointer',
              '&:hover': {
                boxShadow: 3,
                transform: 'translateY(-2px)',
                transition: 'all 0.2s ease-in-out'
              }
            }}
            onClick={() => navigate(`/bookings/${booking._id}`)}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  {booking.customerName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {booking.customerEmail}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={booking.status}
                  color={
                    booking.status === 'pending' ? 'warning' :
                    booking.status === 'confirmed' ? 'success' :
                    booking.status === 'rejected' ? 'error' :
                    'default'
                  }
                />
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuClick(e, booking);
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
              </Box>
            </Box>
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Typography variant="body2">
                Event Date: {new Date(booking.eventDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body2">
                Guests: {booking.guestCount}
              </Typography>
              <Typography variant="body2">
                Budget: ₹{booking.budget}
              </Typography>
            </Box>
          </Paper>
        ))
      ) : (
        <Card>
          <CardContent>
            <Typography align="center" color="text.secondary">
              No bookings found
            </Typography>
          </CardContent>
        </Card>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleStatusChange('confirmed')}>
          Accept Booking
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('rejected')}>
          Reject Booking
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('completed')}>
          Mark as Completed
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default BookingList;