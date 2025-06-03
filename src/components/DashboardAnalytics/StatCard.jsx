import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Tooltip,
} from '@mui/material';

const StatCard = ({ title, value, icon: Icon, progress, tooltip }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Icon sx={{ mr: 1, color: 'primary.main' }} />
        <Tooltip title={tooltip || title}>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Tooltip>
      </Box>
      <Typography variant="h4" component="div" sx={{ mb: 2 }}>
        {value}
      </Typography>
      {progress !== undefined && (
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {progress}% Growth
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
);

export default StatCard;