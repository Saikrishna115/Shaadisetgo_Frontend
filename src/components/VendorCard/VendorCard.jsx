import React from 'react';
import './VendorCard.css';

const VendorCard = ({ vendor, handleStatusUpdate }) => {
  const getStatusClass = (status) => {
    const statusMap = {
      active: 'status-active',
      pending: 'status-pending',
      suspended: 'status-suspended',
      inactive: 'status-inactive'
    };
    return `status ${statusMap[status] || 'status-inactive'}`;
  };

  return (
    <div className="vendor-card">
      <div className="vendor-info">
        <h3>{vendor.businessName}</h3>
        <p className="vendor-type">{vendor.serviceType}</p>
        <p className="vendor-location">{vendor.location}</p>
        <p className="vendor-contact">{vendor.contact}</p>
        <p className="vendor-price">Price Range: {vendor.priceRange}</p>
      </div>
      <div className="vendor-status">
        <span className={getStatusClass(vendor.status)}>
          {vendor.status || 'inactive'}
        </span>
        <select
          value={vendor.status || 'inactive'}
          onChange={(e) => handleStatusUpdate(vendor._id, e.target.value)}
          className="status-select"
        >
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>
  );
};

export default VendorCard;