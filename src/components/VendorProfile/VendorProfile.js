import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Container,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';

const serviceTypes = [
  'Venue',
  'Catering',
  'Photography',
  'Decoration',
  'Music',
  'Makeup Artist',
  'Wedding Planner',
  'Other'
];

const VendorProfile = ({
  profileData,
  isEditing,
  handleInputChange,
  handleProfileUpdate,
  setIsEditing,
  error,
  successMessage,
  isLoading
}) => {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Vendor Profile
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        <Card>
          <CardContent>
            {isEditing ? (
              <Box component="form" noValidate sx={{ mt: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="businessName"
                      label="Business Name"
                      value={profileData.businessName}
                      onChange={handleInputChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      select
                      name="serviceType"
                      label="Service Type"
                      value={profileData.serviceType}
                      onChange={handleInputChange}
                      variant="outlined"
                    >
                      {serviceTypes.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="location"
                      label="Location"
                      value={profileData.location}
                      onChange={handleInputChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="contact"
                      label="Contact"
                      value={profileData.contact}
                      onChange={handleInputChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="priceRange"
                      label="Price Range"
                      value={profileData.priceRange}
                      onChange={handleInputChange}
                      variant="outlined"
                      placeholder="e.g., ₹10,000 - ₹50,000"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      name="description"
                      label="Description"
                      value={profileData.description}
                      onChange={handleInputChange}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleProfileUpdate}
                    disabled={isLoading} // Disable while loading
                  >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setIsEditing(false)}
                    disabled={isLoading} // Disable while loading
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Business Name
                    </Typography>
                    <Typography variant="body1">
                      {profileData.businessName || 'Not specified'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Service Type
                    </Typography>
                    <Typography variant="body1">
                      {profileData.serviceType || 'Not specified'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Location
                    </Typography>
                    <Typography variant="body1">
                      {profileData.location || 'Not specified'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Contact
                    </Typography>
                    <Typography variant="body1">
                      {profileData.contact || 'Not specified'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Price Range
                    </Typography>
                    <Typography variant="body1">
                      {profileData.priceRange || 'Not specified'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Description
                    </Typography>
                    <Typography variant="body1">
                      {profileData.description || 'No description provided'}
                    </Typography>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setIsEditing(true)}
                    disabled={isLoading} // Disable while loading
                  >
                    Edit Profile
                  </Button>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default VendorProfile;
