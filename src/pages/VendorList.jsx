import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import VendorCard from '../components/vendor/VendorCard';
import VendorFilters from '../components/vendor/VendorFilters';

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    location: 'All Locations',
    category: 'All Categories',
    priceRange: ''
  });

  const observer = useRef();
  const lastVendorRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Simulated data fetch - Replace with actual API call
  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulate vendor data
        const newVendors = Array.from({ length: 12 }, (_, i) => ({
          id: page * 12 + i,
          name: `Wedding Vendor ${page * 12 + i + 1}`,
          category: 'Photography',
          image: `https://source.unsplash.com/800x600/?wedding,${page * 12 + i}`,
          rating: (4 + Math.random()).toFixed(1),
          reviewCount: Math.floor(Math.random() * 100) + 10,
          priceRange: '₹50,000 - ₹1,00,000',
          location: 'Mumbai',
          description: 'Professional wedding photography services with a creative touch. We capture your special moments in unique and beautiful ways.'
        }));

        setVendors(prev => [...prev, ...newVendors]);
        setHasMore(page < 5); // Simulate limited data
      } catch (error) {
        console.error('Error fetching vendors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [page]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
    setVendors([]);
    setHasMore(true);
  };

  const handleFilterReset = () => {
    setFilters({
      search: '',
      location: 'All Locations',
      category: 'All Categories',
      priceRange: ''
    });
    setPage(1);
    setVendors([]);
    setHasMore(true);
  };

  const toggleFavorite = (vendorId) => {
    setFavorites(prev => 
      prev.includes(vendorId)
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Filters */}
      <VendorFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleFilterReset}
      />

      {/* Results */}
      <div className="container mt-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-heading font-bold">
            Wedding Vendors & Services
          </h1>
          <p className="text-sm text-muted-foreground">
            Showing {vendors.length} results
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {vendors.map((vendor, index) => {
            if (vendors.length === index + 1) {
              return (
                <div ref={lastVendorRef} key={vendor.id}>
                  <VendorCard
                    vendor={vendor}
                    onFavorite={toggleFavorite}
                    isFavorite={favorites.includes(vendor.id)}
                  />
                </div>
              );
            }
            return (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                onFavorite={toggleFavorite}
                isFavorite={favorites.includes(vendor.id)}
              />
            );
          })}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="mt-8 flex justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-muted-foreground"
            >
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading more vendors...</span>
            </motion.div>
          </div>
        )}

        {/* No Results */}
        {!loading && vendors.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 text-center"
          >
            <div className="mx-auto max-w-md rounded-lg border bg-card p-8">
              <h3 className="mb-2 text-lg font-medium">No vendors found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search terms to find what you're looking for.
              </p>
            </div>
          </motion.div>
        )}

        {/* End of Results */}
        {!loading && !hasMore && vendors.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center text-sm text-muted-foreground"
          >
            You've reached the end of the list
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default VendorList; 