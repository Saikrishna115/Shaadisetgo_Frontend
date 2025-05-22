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
  Alert,
  MenuItem,
  Divider
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

const eventTypes = [
  'Wedding',
  'Engagement',
  'Reception',
  'Birthday Party',
  'Corporate Event',
  'Other'
];

const UserProfile = ({
  profileData,
  isEditing,
  handleInputChange,
  handleProfileUpdate,
  setIsEditing,
  error,
  successMessage
}) => {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          User Profile
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
                    <Typography variant="h6" gutterBottom>Personal Information</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      name="fullName"
                      label="Full Name"
                      value={profileData.fullName}
                      onChange={handleInputChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="email"
                      label="Email"
                      value={profileData.email}
                      disabled
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      name="phone"
                      label="Phone Number"
                      value={profileData.phone || ''}
                      onChange={handleInputChange}
                      variant="outlined"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom>Location Details</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="address"
                      label="Address"
                      value={profileData.address || ''}
                      onChange={handleInputChange}
                      variant="outlined"
                      multiline
                      rows={2}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="city"
                      label="City"
                      value={profileData.city || ''}
                      onChange={handleInputChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="state"
                      label="State"
                      value={profileData.state || ''}
                      onChange={handleInputChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="pincode"
                      label="Pincode"
                      value={profileData.pincode || ''}
                      onChange={handleInputChange}
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom>Event Details</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      name="eventType"
                      label="Event Type"
                      value={profileData.eventType || ''}
                      onChange={handleInputChange}
                      variant="outlined"
                    >
                      {eventTypes.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Event Date"
                        value={profileData.eventDate || null}
                        onChange={(newValue) => {
                          handleInputChange({
                            target: { name: 'eventDate', value: newValue }
                          });
                        }}
                        renderInput={(params) => (
                          <TextField {...params} fullWidth variant="outlined" />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="budget"
                      label="Budget (₹)"
                      type="number"
                      value={profileData.budget || ''}
                      onChange={handleInputChange}
                      variant="outlined"
                      InputProps={{
                        inputProps: { min: 0 }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="guestCount"
                      label="Expected Guest Count"
                      type="number"
                      value={profileData.guestCount || ''}
                      onChange={handleInputChange}
                      variant="outlined"
                      InputProps={{
                        inputProps: { min: 0 }
                      }}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleProfileUpdate}
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>Personal Information</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="text.secondary">Full Name</Typography>
                    <Typography variant="body1">{profileData.fullName || 'Not specified'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="text.secondary">Email</Typography>
                    <Typography variant="body1">{profileData.email}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="text.secondary">Phone Number</Typography>
                    <Typography variant="body1">{profileData.phone || 'Not specified'}</Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom>Location Details</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" color="text.secondary">Address</Typography>
                    <Typography variant="body1">{profileData.address || 'Not specified'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="text.secondary">City</Typography>
                    <Typography variant="body1">{profileData.city || 'Not specified'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="text.secondary">State</Typography>
                    <Typography variant="body1">{profileData.state || 'Not specified'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="text.secondary">Pincode</Typography>
                    <Typography variant="body1">{profileData.pincode || 'Not specified'}</Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom>Event Details</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="text.secondary">Event Type</Typography>
                    <Typography variant="body1">{profileData.eventType || 'Not specified'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="text.secondary">Event Date</Typography>
                    <Typography variant="body1">
                      {profileData.eventDate ? new Date(profileData.eventDate).toLocaleDateString() : 'Not specified'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="text.secondary">Budget</Typography>
                    <Typography variant="body1">
                      {profileData.budget ? `₹${profileData.budget}` : 'Not specified'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="text.secondary">Expected Guest Count</Typography>
                    <Typography variant="body1">
                      {profileData.guestCount ? `${profileData.guestCount} guests` : 'Not specified'}
                    </Typography>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setIsEditing(true)}
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

export default UserProfile;