import React, { useState, useEffect } from 'react';
import { Container, CircularProgress } from '@mui/material';
import UserProfileForm from '../components/UserProfileForm/UserProfileForm';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios'; // Import centralized axios instance

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('/users/profile');
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (formData) => {
    try {
      const response = await axios.put('/users/profile', formData);
      setUserData(response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <UserProfileForm
      initialData={userData}
      onSubmit={handleProfileUpdate}
    />
  );
};

export default UserProfile;