import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api/config';
import {
  Container,
  Box,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
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
      setLoading(true);
      setError('');
      const response = await api.get('/vendors');
      if (!response.data) {
        throw new Error('No data received from server');
      }
      setVendors(response.data);
    } catch (err) {
      console.error('Error fetching vendors:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to fetch vendors. Please try again later.'
      );
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={fetchVendors}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Container>
    );
  }

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
                <span className="vendor-price">
                  {vendor.priceRange && typeof vendor.priceRange === 'object' 
                    ? `₹${vendor.priceRange.min || 0} - ₹${vendor.priceRange.max || 0}`
                    : vendor.priceRange || 'Price not specified'}
                </span>
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
