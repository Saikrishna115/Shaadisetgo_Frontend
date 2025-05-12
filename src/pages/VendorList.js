import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios'; // Use centralized axios instance
import './VendorList.css';

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await axios.get('/vendors'); // uses baseURL from axios instance
      setVendors(response.data);
    } catch (err) {
      setError('Failed to fetch vendors');
    } finally {
      setLoading(false);
    }
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vendor.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || vendor.serviceType === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="vendor-list-container">
      <div className="vendor-list-header">
        <h1>Find Your Perfect Vendor</h1>
        <div className="search-filters">
          <input
            type="text"
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="all">All Categories</option>
            <option value="Venue">Venue</option>
            <option value="Catering">Catering</option>
            <option value="Photography">Photography</option>
            <option value="Decoration">Decoration</option>
            <option value="Music">Music</option>
          </select>
        </div>
      </div>

      <div className="vendor-grid">
        {filteredVendors.map(vendor => (
          <div key={vendor._id} className="vendor-card">
            {vendor.images && vendor.images.length > 0 && (
              <div className="vendor-image">
                <img src={vendor.images[0]} alt={vendor.businessName} />
              </div>
            )}
            <div className="vendor-info">
              <h3>{vendor.businessName}</h3>
              <p className="vendor-category">{vendor.serviceType}</p>
              <p className="vendor-description">{vendor.description}</p>
              <div className="vendor-footer">
                <span className="vendor-price">{vendor.priceRange}</span>
                <button className="book-btn" onClick={() => navigate(`/vendors/${vendor._id}`)}>View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVendors.length === 0 && (
        <div className="no-results">
          <p>No vendors found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default VendorList;
