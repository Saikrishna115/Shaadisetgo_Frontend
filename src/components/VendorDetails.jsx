import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VendorDetails = ({ vendorId }) => {
  const [vendor, setVendor] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const response = await axios.get(`https://shaadisetgo-backend.onrender.com/api/vendors/profile`);
        console.log('Vendor details:', response.data);
        setVendor(response.data);
      } catch (error) {
        console.error('Error fetching vendor details:', error);
      }
    };

    const fetchVendorBookings = async () => {
      try {
        const response = await axios.get(`https://shaadisetgo-backend.onrender.com/api/bookings/vendor`);
        console.log('Vendor bookings:', response.data);
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchVendorDetails();
    fetchVendorBookings();
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