import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Stack
} from '@mui/material';

const UserCard = ({ user, handleStatusUpdate }) => {
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
    <Card sx={{ minWidth: 275, m: 1 }}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {user.name}
        </Typography>
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
      </CardContent>
    </Card>
  );
};

export default UserCard;