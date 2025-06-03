// AdminDashboard.js
import React, { useState, useCallback, memo } from 'react';
import UserCard from '../components/UserCard/UserCard';
import VendorCard from '../components/VendorCard/VendorCard';
import BookingCard from '../components/BookingCard/BookingCard';
import useAdminData from '../hooks/useAdminData';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [successMessage, setSuccessMessage] = useState('');
  const { data, loading, error, updateUserStatus, updateVendorStatus, updateBookingStatus } = useAdminData();
  const { users, vendors, bookings } = data;

  const handleUserStatusUpdate = useCallback(async (userId, status) => {
    const result = await updateUserStatus(userId, status);
    setSuccessMessage(result.message);
  }, [updateUserStatus]);

  const handleVendorStatusUpdate = useCallback(async (vendorId, status) => {
    const result = await updateVendorStatus(vendorId, status);
    setSuccessMessage(result.message);
  }, [updateVendorStatus]);

  const handleBookingStatusUpdate = useCallback(async (bookingId, status) => {
    const result = await updateBookingStatus(bookingId, status);
    setSuccessMessage(result.message);
  }, [updateBookingStatus]);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setSuccessMessage('');
  }, []);

  const UsersSection = memo(({ users, onStatusUpdate }) => (
    <div className="admin-section">
      <h2>User Management</h2>
      <div className="admin-grid">
        {users.map(user => (
          <UserCard key={user._id} user={user} handleStatusUpdate={onStatusUpdate} />
        ))}
      </div>
    </div>
  ));

  const VendorsSection = memo(({ vendors, onStatusUpdate }) => (
    <div className="admin-section">
      <h2>Vendor Management</h2>
      <div className="admin-grid">
        {vendors.map(vendor => (
          <VendorCard key={vendor._id} vendor={vendor} handleStatusUpdate={onStatusUpdate} />
        ))}
      </div>
    </div>
  ));

  const BookingsSection = memo(({ bookings, onStatusUpdate }) => (
    <div className="admin-section">
      <h2>Booking Management</h2>
      <div className="admin-grid">
        {bookings.map(booking => (
          <BookingCard key={booking._id} booking={booking} handleStatusUpdate={onStatusUpdate} />
        ))}
      </div>
    </div>
  ));

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-header">
        <h1>Admin Dashboard</h1>
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
      </div>

      <div className="admin-dashboard-content">
        <div className="admin-dashboard-tabs">
          {['users', 'vendors', 'bookings'].map(tab => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => handleTabChange(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'users' && <UsersSection users={users} onStatusUpdate={handleUserStatusUpdate} />}
        {activeTab === 'vendors' && <VendorsSection vendors={vendors} onStatusUpdate={handleVendorStatusUpdate} />}
        {activeTab === 'bookings' && <BookingsSection bookings={bookings} onStatusUpdate={handleBookingStatusUpdate} />}
      </div>
    </div>
  );
};

export default AdminDashboard;
