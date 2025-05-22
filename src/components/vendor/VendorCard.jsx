import React from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, MapPin, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';

const VendorCard = ({ vendor, onFavorite, isFavorite }) => {
  const {
    id,
    name,
    category,
    image,
    rating,
    reviewCount,
    priceRange,
    location,
    description
  } = vendor;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative overflow-hidden rounded-xl bg-card border shadow-sm hover:shadow-md transition-all duration-200"
    >
      {/* Favorite Button */}
      <button
        onClick={() => onFavorite(id)}
        className="absolute right-4 top-4 z-10 rounded-full bg-black/20 p-2 backdrop-blur-sm transition-all hover:bg-black/40"
      >
        <Heart 
          className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} 
        />
      </button>

      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Category Tag */}
        <div className="absolute bottom-4 left-4">
          <span className="rounded-full bg-primary/90 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
            {category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-4">
          <h3 className="font-heading text-lg font-semibold">{name}</h3>
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-medium">{rating}</span>
            <span className="text-xs text-muted-foreground">({reviewCount})</span>
          </div>
        </div>

        {/* Location */}
        <div className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
        </div>

        {/* Description */}
        <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm">
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{priceRange}</span>
          </div>
          
          <div className="flex gap-2">
            <Link
              to={`/vendors/${id}`}
              className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium hover:bg-accent/80 transition-colors"
            >
              View Details
            </Link>
            <Link
              to={`/vendors/${id}/book`}
              className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VendorCard; 