import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Lock, 
  Calendar,
  Camera,
  Mail,
  Phone,
  MapPin,
  Trash2,
  LogOut,
  AlertTriangle
} from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import TabsContainer from '../ui/TabsContainer';

const ProfileTabs = ({ user, onUpdate, onLogout, onDeleteAccount }) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    onUpdate({ message: 'Profile updated successfully!' });
  };

  const tabs = [
    {
      id: 'personal',
      label: 'Personal Info',
      icon: User,
      content: (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex flex-col items-center">
            <div className="group relative">
              <motion.img
                whileHover={{ scale: 1.05 }}
                src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.fullName}`}
                alt={user?.fullName}
                className="h-32 w-32 rounded-full object-cover ring-4 ring-background"
              />
              <Button
                variant="primary"
                size="icon"
                className="absolute bottom-0 right-0 rounded-full shadow-lg ring-4 ring-background"
              >
                <Camera className="h-5 w-5" />
              </Button>
            </div>
            <h2 className="mt-4 text-xl font-heading font-bold">{user?.fullName}</h2>
            <p className="text-sm text-muted-foreground">{user?.role}</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                icon={User}
                defaultValue={user?.fullName}
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                icon={Mail}
                type="email"
                defaultValue={user?.email}
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input
                icon={Phone}
                type="tel"
                defaultValue={user?.phone}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input
                icon={MapPin}
                defaultValue={user?.location}
                placeholder="Enter your location"
              />
            </div>

            <Button type="submit" loading={loading}>
              Save Changes
            </Button>
          </div>
        </form>
      )
    },
    {
      id: 'security',
      label: 'Security',
      icon: Lock,
      content: (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Password</label>
            <Input
              type="password"
              placeholder="Enter your current password"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">New Password</label>
            <Input
              type="password"
              placeholder="Enter your new password"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm New Password</label>
            <Input
              type="password"
              placeholder="Confirm your new password"
            />
          </div>

          <Button type="submit" loading={loading}>
            Update Password
          </Button>
        </form>
      )
    },
    {
      id: 'bookings',
      label: 'Bookings',
      icon: Calendar,
      content: (
        <div className="rounded-lg border bg-card p-6">
          <div className="space-y-6">
            <p className="text-muted-foreground">No bookings found.</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <TabsContainer
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Account Actions */}
      <div className="rounded-lg border bg-card p-6">
        <h3 className="mb-6 text-lg font-medium">Account Actions</h3>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            variant="outline"
            onClick={onLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>

          <Button
            variant="destructive"
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Account
          </Button>
        </div>
      </div>

      {/* Delete Account Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-lg border bg-card p-6 shadow-lg"
            >
              <div className="mb-6 flex items-center gap-4 text-destructive">
                <AlertTriangle className="h-6 w-6" />
                <h3 className="text-lg font-medium">Delete Account</h3>
              </div>

              <p className="mb-6 text-muted-foreground">
                Are you sure you want to delete your account? This action cannot be undone
                and all your data will be permanently removed.
              </p>

              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    onDeleteAccount();
                    setShowDeleteConfirm(false);
                  }}
                >
                  Delete Account
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileTabs; 