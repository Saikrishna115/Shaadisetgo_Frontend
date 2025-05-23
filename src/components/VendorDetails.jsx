import React, { useEffect, useState } from 'react';
import api from '../services/api/config';

const VendorDetails = ({ vendorId }) => {
  const [vendor, setVendor] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchVendorDetails = async () => {
      try {
        const response = await api.get('/vendors/profile');
        if (isMounted) {
          setVendor(response.data);
        }
      } catch (error) {
        console.error('Error fetching vendor details:', error);
      }
    };

    const fetchVendorBookings = async () => {
      try {
        const response = await api.get('/bookings/vendor');
        if (isMounted) {
          setBookings(response.data);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchVendorDetails();
    fetchVendorBookings();

    return () => {
      isMounted = false;
    };
  }, [vendorId]);

  return (
    <div>
      {vendor && (
        <div>
          <h2>{vendor.name}</h2>
          <p>{vendor.description}</p>
        </div>
      )}
      {bookings.length > 0 && (
        <div>
          <h3>Bookings</h3>
          <ul>
            {bookings.map(booking => (
              <li key={booking._id}>{booking.date} - {booking.status}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default VendorDetails;