import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  Calendar,
  Users,
  Settings,
  Bell,
  Heart,
  Clock,
  Star,
  TrendingUp
} from 'lucide-react';
import DashboardStats from '../components/dashboard/DashboardStats';
import TabsContainer from '../components/ui/TabsContainer';
import { FormCard } from '../components/ui/Form';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const user = JSON.parse(localStorage.getItem('user'));

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: Home,
      content: (
        <div className="space-y-6">
          <DashboardStats role={user?.role} />
          
          {/* Recent Activity */}
          <FormCard>
            <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                {
                  icon: Calendar,
                  title: 'New Booking Confirmed',
                  description: 'Wedding Photography with John Doe Studios',
                  time: '2 hours ago'
                },
                {
                  icon: Heart,
                  title: 'Added to Favorites',
                  description: 'Royal Wedding Venue',
                  time: '5 hours ago'
                },
                {
                  icon: Star,
                  title: 'New Review',
                  description: 'You received a 5-star review',
                  time: '1 day ago'
                }
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-lg hover:bg-accent/5 transition-colors"
                >
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    {React.createElement(activity.icon, { className: 'h-5 w-5' })}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{activity.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {activity.time}
                  </span>
                </motion.div>
              ))}
            </div>
          </FormCard>
        </div>
      )
    },
    {
      id: 'bookings',
      label: 'Bookings',
      icon: Calendar,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Your Bookings</h3>
          {/* Add bookings content */}
        </div>
      )
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: Heart,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Saved Vendors</h3>
          {/* Add favorites content */}
        </div>
      )
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Recent Updates</h3>
          {/* Add notifications content */}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.fullName}
        </p>
      </div>

      {/* Main Content */}
      <TabsContainer
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />
    </div>
  );
};

export default Dashboard; 