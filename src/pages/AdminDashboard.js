import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const [successMessage, setSuccessMessage] = useState('');

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
          axios.get('http://localhost:5000/api/admin/users', config),
          axios.get('http://localhost:5000/api/admin/vendors', config),
          axios.get('http://localhost:5000/api/admin/bookings', config)
        ]);

        setUsers(usersResponse.data);
        setVendors(vendorsResponse.data);
        setBookings(bookingsResponse.data);
        setLoading(false);
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load admin data';
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleUserStatusUpdate = async (userId, status) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.put(`http://localhost:5000/api/admin/users/${userId}/status`, { status }, config);
      setUsers(users.map(user => user._id === userId ? { ...user, status } : user));
      setSuccessMessage('User status updated successfully');
    } catch (err) {
      setError('Failed to update user status');
    }
  };

  const handleVendorStatusUpdate = async (vendorId, status) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.put(`http://localhost:5000/api/admin/vendors/${vendorId}/status`, { status }, config);
      setVendors(vendors.map(vendor => vendor._id === vendorId ? { ...vendor, status } : vendor));
      setSuccessMessage('Vendor status updated successfully');
    } catch (err) {
      setError('Failed to update vendor status');
    }
  };

  const handleBookingStatusUpdate = async (bookingId, status) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.put(`http://localhost:5000/api/admin/bookings/${bookingId}/status`, { status }, config);
      setBookings(bookings.map(booking => booking._id === bookingId ? { ...booking, status } : booking));
      setSuccessMessage('Booking status updated successfully');
    } catch (err) {
      setError('Failed to update booking status');
    }
  };

  const renderUsersSection = () => (
    <div className="admin-section">
      <h2>User Management</h2>
      <div className="admin-grid">
        {users.map(user => (
          <div key={user._id} className="admin-card">
            <div className="admin-card-header">
              <h3>{user.name}</h3>
              <span className={`status status-${user.status.toLowerCase()}`}>
                {user.status}
              </span>
            </div>
            <div className="admin-card-details">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="admin-card-actions">
              <select
                value={user.status}
                onChange={(e) => handleUserStatusUpdate(user._id, e.target.value)}
                className="status-select"
              >
                <option value="ACTIVE">Active</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderVendorsSection = () => (
    <div className="admin-section">
      <h2>Vendor Management</h2>
      <div className="admin-grid">
        {vendors.map(vendor => (
          <div key={vendor._id} className="admin-card">
            <div className="admin-card-header">
              <h3>{vendor.businessName}</h3>
              <span className={`status status-${vendor.status.toLowerCase()}`}>
                {vendor.status}
              </span>
            </div>
            <div className="admin-card-details">
              <p><strong>Service Type:</strong> {vendor.serviceType}</p>
              <p><strong>Location:</strong> {vendor.location}</p>
              <p><strong>Contact:</strong> {vendor.contact}</p>
            </div>
            <div className="admin-card-actions">
              <select
                value={vendor.status}
                onChange={(e) => handleVendorStatusUpdate(vendor._id, e.target.value)}
                className="status-select"
              >
                <option value="ACTIVE">Active</option>
                <option value="PENDING">Pending</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBookingsSection = () => (
    <div className="admin-section">
      <h2>Booking Management</h2>
      <div className="admin-grid">
        {bookings.map(booking => (
          <div key={booking._id} className="admin-card">
            <div className="admin-card-header">
              <h3>Booking #{booking._id.slice(-6)}</h3>
              <span className={`status status-${booking.status.toLowerCase()}`}>
                {booking.status}
              </span>
            </div>
            <div className="admin-card-details">
              <p><strong>Customer:</strong> {booking.customerName}</p>
              <p><strong>Vendor:</strong> {booking.vendorName}</p>
              <p><strong>Service:</strong> {booking.service}</p>
              <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
              <p><strong>Amount:</strong> ₹{booking.amount}</p>
            </div>
            <div className="admin-card-actions">
              <select
                value={booking.status}
                onChange={(e) => handleBookingStatusUpdate(booking._id, e.target.value)}
                className="status-select"
              >
                <option value="CONFIRMED">Confirmed</option>
                <option value="PENDING">Pending</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-header">
        <h1>Admin Dashboard</h1>
      </div>

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <div className="admin-dashboard-content">
        <div className="admin-dashboard-tabs">
          <button
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button
            className={`tab-btn ${activeTab === 'vendors' ? 'active' : ''}`}
            onClick={() => setActiveTab('vendors')}
          >
            Vendors
          </button>
          <button
            className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            Bookings
          </button>
        </div>

        {activeTab === 'users' && renderUsersSection()}
        {activeTab === 'vendors' && renderVendorsSection()}
        {activeTab === 'bookings' && renderBookingsSection()}
      </div>
    </div>
  );
};

export default AdminDashboard;