import React from 'react';
import { Container, Grid, Card, Typography, Button, TextField, Select, MenuItem } from '@mui/material';

const Vendors = () => {
  const [sortBy, setSortBy] = React.useState('rating');
  const [filterCategory, setFilterCategory] = React.useState('all');

  // Sample vendor data
  const vendors = [
    {
      id: 1,
      name: 'Wedding Decorators',
      category: 'Decor',
      rating: 4.8,
      location: 'New Delhi',
      priceRange: '₹50,000 - ₹1,00,000',
      image: '/images/decor.jpg'
    },
    // Add more vendor data here
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Vendors</Typography>

      {/* Filters and Sorting */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Search Vendors"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <Select
            fullWidth
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            label="Category"
          >
            <MenuItem value="all">All Categories</MenuItem>
            <MenuItem value="decor">Decor</MenuItem>
            <MenuItem value="catering">Catering</MenuItem>
            <MenuItem value="photography">Photography</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={6} md={3}>
          <Select
            fullWidth
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            label="Sort By"
          >
            <MenuItem value="rating">Rating</MenuItem>
            <MenuItem value="price">Price</MenuItem>
            <MenuItem value="location">Location</MenuItem>
          </Select>
        </Grid>
      </Grid>

      {/* Vendors Grid */}
      <Grid container spacing={4}>
        {vendors.map((vendor) => (
          <Grid item key={vendor.id} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <img
                src={vendor.image}
                alt={vendor.name}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
              <div style={{ padding: '16px', flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {vendor.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {vendor.category} | {vendor.location}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {vendor.priceRange}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Rating: {vendor.rating}
                </Typography>
              </div>
              <Button
                variant="contained"
                fullWidth
                sx={{ borderRadius: 0 }}
              >
                View Details
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Vendors;