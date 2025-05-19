import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress
} from '@mui/material';
import {
  Event as EventIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, color, percentage }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" color="text.secondary">
          {title}
        </Typography>
        {icon}
      </Box>
      <Typography variant="h4" component="div" sx={{ mb: 1 }}>
        {value}
      </Typography>
      {percentage !== undefined && (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress
              variant="determinate"
              value={percentage}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: color
                }
              }}
            />
          </Box>
          <Box sx={{ minWidth: 35 }}>
            <Typography variant="body2" color="text.secondary">
              {`${Math.round(percentage)}%`}
            </Typography>
          </Box>
        </Box>
      )}
    </CardContent>
  </Card>
);

const BookingStats = ({ bookings }) => {
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const rejectedBookings = bookings.filter(b => b.status === 'rejected').length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;

  const totalRevenue = bookings
    .filter(b => ['confirmed', 'completed'].includes(b.status))
    .reduce((sum, b) => sum + b.budget, 0);

  const upcomingEvents = bookings
    .filter(b => ['confirmed', 'pending'].includes(b.status))
    .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
    .slice(0, 5);

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Bookings"
            value={totalBookings}
            icon={<EventIcon sx={{ color: 'primary.main', fontSize: 30 }} />}
            color="primary.main"
            percentage={100}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Confirmed"
            value={confirmedBookings}
            icon={<CheckCircleIcon sx={{ color: 'success.main', fontSize: 30 }} />}
            color="success.main"
            percentage={(confirmedBookings / totalBookings) * 100}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending"
            value={pendingBookings}
            icon={<PendingIcon sx={{ color: 'warning.main', fontSize: 30 }} />}
            color="warning.main"
            percentage={(pendingBookings / totalBookings) * 100}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Rejected"
            value={rejectedBookings}
            icon={<CancelIcon sx={{ color: 'error.main', fontSize: 30 }} />}
            color="error.main"
            percentage={(rejectedBookings / totalBookings) * 100}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h4" color="primary">
                ₹{totalRevenue.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                From {confirmedBookings + completedBookings} successful bookings
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming Events
              </Typography>
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((booking) => (
                  <Box key={booking._id} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">
                      {booking.customerName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(booking.eventDate).toLocaleDateString()} - {booking.guestCount} Guests
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No upcoming events
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookingStats; 