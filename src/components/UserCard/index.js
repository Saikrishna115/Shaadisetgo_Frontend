import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
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

const UserCard = ({ user }) => {
  return (
    <StyledCard>
      <CardMedia
        component="img"
        height="140"
        image={user.profilePicture || 'https://via.placeholder.com/140'}
        alt={user.fullName}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {user.fullName}
        </Typography>
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
      </CardContent>
    </StyledCard>
  );
};

export default UserCard;