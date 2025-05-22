import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ProfileTabs from '../components/profile/ProfileTabs';

const Profile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleUpdate = ({ message }) => {
    toast.success(message, {
      icon: '✅',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  const handleLogout = () => {
    toast.success('Logged out successfully', {
      icon: '👋',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleDeleteAccount = () => {
    // Add API call to delete account
    toast.success('Account deleted successfully', {
      icon: '🗑️',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/register');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <ProfileTabs
        user={user}
        onUpdate={handleUpdate}
        onLogout={handleLogout}
        onDeleteAccount={handleDeleteAccount}
      />
    </div>
  );
};

export default Profile; 