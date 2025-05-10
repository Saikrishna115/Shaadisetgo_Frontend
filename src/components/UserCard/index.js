import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Button, Chip, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 345,
  margin: theme.spacing(2),
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const UserCard = ({ user, handleStatusUpdate, isAdmin = false }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'blocked':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <StyledCard>
      {!isAdmin && (
        <CardMedia
          component="img"
          height="140"
          image={user.profilePicture || 'https://via.placeholder.com/140'}
          alt={user.fullName || user.name}
        />
      )}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {user.fullName || user.name}
        </Typography>
        {isAdmin ? (
          <>
            <Typography color="text.secondary" gutterBottom>
              {user.email}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <Typography variant="body2">Status:</Typography>
              <Chip
                label={user.status}
                color={getStatusColor(user.status)}
                size="small"
              />
            </Stack>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Joined: {new Date(user.createdAt).toLocaleDateString()}
            </Typography>
            <Box sx={{ mt: 2 }}>
              {user.status !== 'active' && (
                <Button
                  size="small"
                  color="success"
                  variant="outlined"
                  onClick={() => handleStatusUpdate(user._id, 'active')}
                  sx={{ mr: 1 }}
                >
                  Activate
                </Button>
              )}
              {user.status !== 'blocked' && (
                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  onClick={() => handleStatusUpdate(user._id, 'blocked')}
                >
                  Block
                </Button>
              )}
            </Box>
          </>
        ) : (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Location: {user.location?.city}, {user.location?.state}
            </Typography>
            {user.eventDetails?.eventType && (
              <Typography variant="body2" color="text.secondary">
                Event: {user.eventDetails.eventType}
              </Typography>
            )}
            {user.eventDetails?.eventDate && (
              <Typography variant="body2" color="text.secondary">
                Date: {new Date(user.eventDetails.eventDate).toLocaleDateString()}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </StyledCard>
  );
};

export default UserCard;