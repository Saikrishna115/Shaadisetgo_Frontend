import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const VendorDashboard = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user?.name || 'Vendor'}
        </Typography>
        <Typography variant="body1">
          This is your vendor dashboard. You can manage your services, bookings, and profile here.
        </Typography>
      </Box>
    </Container>
  );
};

export default VendorDashboard;