import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, Avatar, Divider } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const UserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Fetch user profile data
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) return <div>Loading...</div>;

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12} md={4}>
              <Avatar
                src={profile.profilePicture}
                alt={profile.fullName}
                sx={{ width: 150, height: 150, mb: 2 }}
              />
              <Typography variant="h5" gutterBottom>
                {profile.fullName}
              </Typography>
              <Typography color="textSecondary">
                {profile.email}
              </Typography>
              <Typography color="textSecondary">
                {profile.phone}
              </Typography>
            </Grid>

            {/* Location Details */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Location Details
              </Typography>
              <Typography>
                {profile.location?.address}
              </Typography>
              <Typography>
                {profile.location?.city}, {profile.location?.state}
              </Typography>
              <Typography>
                {profile.location?.pincode}
              </Typography>
            </Grid>

            {/* Event Details */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Event Details
              </Typography>
              {profile.eventDetails && (
                <>
                  <Typography>
                    Event Type: {profile.eventDetails.eventType}
                  </Typography>
                  <Typography>
                    Date: {new Date(profile.eventDetails.eventDate).toLocaleDateString()}
                  </Typography>
                  <Typography>
                    Budget: ₹{profile.eventDetails.estimatedBudget?.min} - ₹{profile.eventDetails.estimatedBudget?.max}
                  </Typography>
                  <Typography>
                    Guests: {profile.eventDetails.numberOfGuests}
                  </Typography>
                </>
              )}
            </Grid>

            {/* Preferences */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Preferences
              </Typography>
              <Typography>
                Services Needed: {profile.preferences?.servicesNeeded?.join(', ')}
              </Typography>
              <Typography>
                Special Requests: {profile.specialRequests}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserProfile;