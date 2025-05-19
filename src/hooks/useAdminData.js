import { useState, useEffect, useCallback } from 'react';
import axios from '../utils/axios';

const useAdminData = () => {
  const [data, setData] = useState({
    users: [],
    vendors: [],
    bookings: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAdminData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login as admin to view dashboard');
        setLoading(false);
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
        validateStatus: status => status < 500
      };

      const [usersResponse, vendorsResponse, bookingsResponse] = await Promise.all([
        axios.get('/admin/users', config),
        axios.get('/admin/vendors', config),
        axios.get('/admin/bookings', config)
      ]);

      if (usersResponse.status === 401 || vendorsResponse.status === 401 || bookingsResponse.status === 401) {
        setError('Unauthorized access. Please login as admin.');
        return;
      }

      setData({
        users: usersResponse.data,
        vendors: vendorsResponse.data,
        bookings: bookingsResponse.data
      });
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const updateUserStatus = async (userId, status) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found');
        return { success: false, message: 'Authentication token not found' };
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const response = await axios.put(`/admin/users/${userId}/status`, { status }, config);
      
      if (response.status === 401) {
        setError('Unauthorized access');
        return { success: false, message: 'Unauthorized access' };
      }

      setData(prev => ({
        ...prev,
        users: prev.users.map(user => user._id === userId ? { ...user, status } : user)
      }));
      return { success: true, message: 'User status updated successfully' };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update user status';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const updateVendorStatus = async (vendorId, status) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.put(`/admin/vendors/${vendorId}/status`, { status }, config);
      setData(prev => ({
        ...prev,
        vendors: prev.vendors.map(vendor => vendor._id === vendorId ? { ...vendor, status } : vendor)
      }));
      return { success: true, message: 'Vendor status updated successfully' };
    } catch (err) {
      return { success: false, message: 'Failed to update vendor status' };
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.put(`/admin/bookings/${bookingId}/status`, { status }, config);
      setData(prev => ({
        ...prev,
        bookings: prev.bookings.map(booking => booking._id === bookingId ? { ...booking, status } : booking)
      }));
      return { success: true, message: 'Booking status updated successfully' };
    } catch (err) {
      return { success: false, message: 'Failed to update booking status' };
    }
  };

  return {
    data,
    loading,
    error,
    updateUserStatus,
    updateVendorStatus,
    updateBookingStatus,
    refreshData: fetchAdminData
  };
};

export default useAdminData;