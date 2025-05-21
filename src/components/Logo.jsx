import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

const Logo = ({ variant = 'default', sx = {} }) => {
  const theme = useTheme();

  const LotusIcon = () => (
    <svg
      width={variant === 'small' ? "24" : "40"}
      height={variant === 'small' ? "24" : "40"}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M50 10C45 25 25 40 25 60C25 80 35 90 50 90C65 90 75 80 75 60C75 40 55 25 50 10Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: variant === 'small' ? 1 : 2,
        color: theme.palette.primary.main,
        ...sx
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFB74D' // Gold color for the lotus
        }}
      >
        <LotusIcon />
      </Box>
      <Typography
        variant={variant === 'small' ? 'h6' : 'h4'}
        component="span"
        sx={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 600,
          color: '#D27D77', // Rose gold color for text
          letterSpacing: '0.5px'
        }}
      >
        ShaadiSetGo
      </Typography>
    </Box>
  );
};

export default Logo; 