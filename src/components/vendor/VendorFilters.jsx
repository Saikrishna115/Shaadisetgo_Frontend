import React from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Filter, X } from 'lucide-react';
import { FormInput, FormSelect } from '../ui/Form';

const categories = [
  'All Categories',
  'Photography',
  'Venue',
  'Catering',
  'Decoration',
  'Music & Entertainment',
  'Wedding Planning',
  'Makeup & Beauty',
  'Wedding Cards'
];

const locations = [
  'All Locations',
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Chennai',
  'Kolkata',
  'Hyderabad',
  'Pune'
];

const priceRanges = [
  { label: 'All Prices', value: '' },
  { label: 'Under ₹50,000', value: '0-50000' },
  { label: '₹50,000 - ₹1,00,000', value: '50000-100000' },
  { label: '₹1,00,000 - ₹2,00,000', value: '100000-200000' },
  { label: 'Above ₹2,00,000', value: '200000-' }
];

const VendorFilters = ({ filters, onChange, onReset }) => {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = Object.values(filters).some(value => value && value !== 'All Categories' && value !== 'All Locations');

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-[5rem] z-30 bg-background/80 backdrop-blur-sm"
    >
      <div className="border-b pb-4">
        <div className="container">
          {/* Search and Filters */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
            {/* Search */}
            <div className="flex-1">
              <FormInput
                icon={Search}
                type="text"
                placeholder="Search vendors..."
                value={filters.search}
                onChange={(e) => handleChange('search', e.target.value)}
              />
            </div>

            {/* Location */}
            <div className="w-full lg:w-64">
              <FormSelect
                value={filters.location}
                onChange={(e) => handleChange('location', e.target.value)}
              >
                {locations.map(location => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </FormSelect>
            </div>

            {/* Category */}
            <div className="w-full lg:w-64">
              <FormSelect
                value={filters.category}
                onChange={(e) => handleChange('category', e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </FormSelect>
            </div>

            {/* Price Range */}
            <div className="w-full lg:w-64">
              <FormSelect
                value={filters.priceRange}
                onChange={(e) => handleChange('priceRange', e.target.value)}
              >
                {priceRanges.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </FormSelect>
            </div>

            {/* Reset Filters */}
            {hasActiveFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={onReset}
                className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent/5 transition-colors"
              >
                <X className="h-4 w-4" />
                Reset Filters
              </motion.button>
            )}
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex flex-wrap gap-2"
            >
              {Object.entries(filters).map(([key, value]) => {
                if (!value || value === 'All Categories' || value === 'All Locations') return null;
                return (
                  <span
                    key={key}
                    className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                  >
                    <span className="capitalize">{key}: {value}</span>
                    <button
                      onClick={() => handleChange(key, '')}
                      className="ml-1 rounded-full p-0.5 hover:bg-primary/20"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default VendorFilters; 