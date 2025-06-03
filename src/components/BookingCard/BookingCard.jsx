import React from 'react';
import './BookingCard.css';

const BookingCard = ({ booking, handleStatusUpdate }) => {
  const getStatusClass = (status) => {
    const statusMap = {
      confirmed: 'status-confirmed',
      pending: 'status-pending',
      cancelled: 'status-cancelled',
      completed: 'status-completed'
    };
    return `status ${statusMap[status] || 'status-pending'}`;
  };

  return (
    <div className="booking-card">
      <div className="booking-info">
        <h3>Booking #{booking._id}</h3>
        <p className="booking-user">User: {booking.user ? booking.user.name : 'N/A'}</p>
        <p className="booking-vendor">Vendor: {booking.vendor ? booking.vendor.businessName : 'N/A'}</p>
        <p className="booking-service">Service: {booking.vendor ? booking.vendor.serviceType : 'N/A'}</p>
        <p className="booking-date">Event Date: {new Date(booking.eventDate).toLocaleDateString()}</p>
        <p className="booking-guests">Guests: {booking.guestCount}</p>
        <p className="booking-budget">Budget: ₹{booking.budget}</p>
      </div>
      <div className="booking-status">
        <span className={getStatusClass(booking.status)}>
          {booking.status || 'pending'}
        </span>
        <select
          value={booking.status || 'pending'}
          onChange={(e) => handleStatusUpdate(booking._id, e.target.value)}
          className="status-select"
        >
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  );
};

export default BookingCard;