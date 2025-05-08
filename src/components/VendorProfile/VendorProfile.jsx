import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, Avatar, Divider, ImageList, ImageListItem, CircularProgress } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const VendorProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Ensure user is available before making the request
    if (user && user._id) {
      const fetchProfile = async () => {
        try {
          setLoading(true);
          setError('');
          const response = await fetch(`/api/vendor/${user._id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to fetch profile');
          }

          const data = await response.json();
          setProfile(data);
        } catch (error) {
          console.error('Error fetching profile:', error);
          setError('Failed to load vendor profile');
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    }
  }, [user._id]);

  if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto', marginTop: 5 }} />;
  if (error) return <div>{error}</div>;

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            {/* Business Details */}
            <Grid item xs={12} md={4}>
              <Avatar
                src={profile.profileImage}
                alt={profile.businessName}
                sx={{ width: 150, height: 150, mb: 2 }}
              />
              <Typography variant="h5" gutterBottom>
                {profile.businessName}
              </Typography>
              <Typography variant="subtitle1">
                Owner: {profile.ownerName}
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

            {/* Service Information */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Service Information
              </Typography>
              <Typography>
                Category: {profile.serviceCategory}
              </Typography>
              <Typography>
                Experience: {profile.experienceYears} years
              </Typography>
              <Typography>
                Price Range: ₹{profile.priceRange?.min} - ₹{profile.priceRange?.max}
              </Typography>
              <Typography>
                Tags: {profile.tags?.join(', ')}
              </Typography>
            </Grid>

            {/* Service Description */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Service Description
              </Typography>
              <Typography>
                {profile.serviceDescription}
              </Typography>
            </Grid>

            {/* Ratings & Reviews */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Ratings & Reviews
              </Typography>
              <Typography>
                Average Rating: {profile.rating?.average} ({profile.rating?.count} reviews)
              </Typography>
              {profile.reviews?.map((review, index) => (
                <Box key={index} sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">
                    Rating: {review.rating}/5
                  </Typography>
                  <Typography>
                    {review.comment}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {new Date(review.date).toLocaleDateString()}
                  </Typography>
                </Box>
              ))}
            </Grid>

            {/* Gallery */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Gallery
              </Typography>
              <ImageList sx={{ width: '100%', height: 450 }} cols={3} rowHeight={164}>
                {profile.gallery?.map((image, index) => (
                  <ImageListItem key={index}>
                    <img
                      src={image}
                      alt={`Gallery image ${index + 1}`}
                      loading="lazy"
                      style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default VendorProfile;
