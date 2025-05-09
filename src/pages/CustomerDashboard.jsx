import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const CustomerDashboard = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user?.name || 'Customer'}
        </Typography>
        <Typography variant="body1">
          This is your customer dashboard. You can manage your wedding planning and vendor bookings here.
        </Typography>
      </Box>
    </Container>
  );
};

export default CustomerDashboard;