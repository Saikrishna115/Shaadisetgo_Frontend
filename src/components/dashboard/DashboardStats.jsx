import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Star,
  Heart,
  DollarSign
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, color = 'primary' }) => {
  const isPositive = trend > 0;
  const colors = {
    primary: 'from-primary/10 to-primary/5 text-primary',
    secondary: 'from-secondary/10 to-secondary/5 text-secondary',
    accent: 'from-accent/10 to-accent/5 text-accent'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative overflow-hidden rounded-xl border p-6
        bg-gradient-to-br ${colors[color]}
      `}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>
          <h2 className="text-3xl font-bold tracking-tight">
            {value}
          </h2>
        </div>
        <div className="rounded-full bg-background/10 p-3">
          <Icon className="h-6 w-6" />
        </div>
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-1 text-sm">
          <TrendingUp 
            className={`h-4 w-4 ${isPositive ? 'text-green-500' : 'text-destructive'}`} 
          />
          <span className={isPositive ? 'text-green-500' : 'text-destructive'}>
            {Math.abs(trend)}%
          </span>
          <span className="text-muted-foreground">vs last month</span>
        </div>
      )}

      {/* Decorative Elements */}
      <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-gradient-to-br from-background/10 to-transparent blur-2xl" />
      <div className="absolute -top-4 -left-4 h-32 w-32 rounded-full bg-gradient-to-br from-background/10 to-transparent blur-2xl" />
    </motion.div>
  );
};

const DashboardStats = ({ role = 'customer' }) => {
  const customerStats = [
    {
      title: 'Total Bookings',
      value: '12',
      icon: Calendar,
      trend: 8,
      color: 'primary'
    },
    {
      title: 'Favorite Vendors',
      value: '5',
      icon: Heart,
      color: 'accent'
    },
    {
      title: 'Upcoming Events',
      value: '3',
      icon: Calendar,
      color: 'secondary'
    },
    {
      title: 'Total Spent',
      value: '₹45,000',
      icon: DollarSign,
      trend: 12,
      color: 'primary'
    }
  ];

  const vendorStats = [
    {
      title: 'Total Bookings',
      value: '28',
      icon: Calendar,
      trend: 15,
      color: 'primary'
    },
    {
      title: 'Total Revenue',
      value: '₹1,25,000',
      icon: DollarSign,
      trend: 23,
      color: 'accent'
    },
    {
      title: 'Client Reviews',
      value: '4.8',
      icon: Star,
      color: 'secondary'
    },
    {
      title: 'Active Clients',
      value: '18',
      icon: Users,
      trend: 5,
      color: 'primary'
    }
  ];

  const adminStats = [
    {
      title: 'Total Users',
      value: '1,234',
      icon: Users,
      trend: 12,
      color: 'primary'
    },
    {
      title: 'Active Vendors',
      value: '156',
      icon: Users,
      trend: 8,
      color: 'accent'
    },
    {
      title: 'Total Bookings',
      value: '892',
      icon: Calendar,
      trend: 18,
      color: 'secondary'
    },
    {
      title: 'Platform Revenue',
      value: '₹8.5L',
      icon: DollarSign,
      trend: 25,
      color: 'primary'
    }
  ];

  const stats = {
    customer: customerStats,
    vendor: vendorStats,
    admin: adminStats
  }[role];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <StatCard {...stat} />
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats; 