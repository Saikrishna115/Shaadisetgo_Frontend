import React from 'react';
import { Grid } from '@mui/material';
import {
  Event as EventIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import StatCard from './StatCard';

const DashboardAnalytics = ({ stats, userType }) => {
  const getStatCards = () => {
    if (userType === 'vendor') {
      return [
        {
          title: 'Total Bookings',
          value: stats.totalBookings || 0,
          icon: EventIcon,
          progress: stats.bookingGrowth,
          tooltip: 'Total number of bookings received'
        },
        {
          title: 'Revenue',
          value: `₹${stats.revenue || 0}`,
          icon: TrendingUpIcon,
          progress: stats.revenueGrowth,
          tooltip: 'Total revenue generated'
        },
        {
          title: 'Rating',
          value: stats.rating?.toFixed(1) || '0.0',
          icon: StarIcon,
          tooltip: 'Average customer rating'
        },
        {
          title: 'Active Customers',
          value: stats.activeCustomers || 0,
          icon: PeopleIcon,
          tooltip: 'Number of unique customers'
        },
      ];
    }
    
    return [
      {
        title: 'Active Bookings',
        value: stats.activeBookings || 0,
        icon: EventIcon,
        tooltip: 'Current active bookings'
      },
      {
        title: 'Total Spent',
        value: `₹${stats.totalSpent || 0}`,
        icon: TrendingUpIcon,
        tooltip: 'Total amount spent on bookings'
      },
      {
        title: 'Favorite Vendors',
        value: stats.favoriteVendors || 0,
        icon: StarIcon,
        tooltip: 'Number of vendors marked as favorite'
      },
      {
        title: 'Completed Events',
        value: stats.completedEvents || 0,
        icon: EventIcon,
        tooltip: 'Total number of completed events'
      },
    ];
  };

  return (
    <Grid container spacing={3}>
      {getStatCards().map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <StatCard {...stat} />
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardAnalytics;