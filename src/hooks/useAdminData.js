import { useState, useEffect } from 'react';
import axios from '../utils/axios';

const useAdminData = () => {
  const [data, setData] = useState({
    users: [],
    vendors: [],
    bookings: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login as admin to view dashboard');
      setLoading(false);
      return;
    }

    const fetchAdminData = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
          validateStatus: status => status < 500
        };

        const [usersResponse, vendorsResponse, bookingsResponse] = await Promise.all([
          axios.get('/admin/users', config),
          axios.get('/admin/vendors', config),
          axios.get('/admin/bookings', config)
        ]);

        setData({
          users: usersResponse.data,
          vendors: vendorsResponse.data,
          bookings: bookingsResponse.data
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to load admin data');
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const updateUserStatus = async (userId, status) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.put(`/admin/users/${userId}/status`, { status }, config);
      setData(prev => ({
        ...prev,
        users: prev.users.map(user => user._id === userId ? { ...user, status } : user)
      }));
      return { success: true, message: 'User status updated successfully' };
    } catch (err) {
      return { success: false, message: 'Failed to update user status' };
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
    updateBookingStatus
  };
};

export default useAdminData;