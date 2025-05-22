import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url("/hero-bg.jpg")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-16 text-center text-white">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-heading font-bold mb-6"
        >
          Plan Your Dream Wedding With Us
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl mb-8 max-w-2xl mx-auto"
        >
          Connect with the best wedding vendors and create unforgettable moments. 
          Your perfect wedding journey starts here.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/vendors"
            className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-3 rounded-full font-medium hover:bg-primary hover:text-white transition-colors"
          >
            Find Vendors
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-primary transition-colors"
          >
            Join as Vendor
          </Link>
        </motion.div>

        {/* Partner Logos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 pt-16 border-t border-white/20"
        >
          <p className="text-sm uppercase tracking-wider mb-6 text-white/70">
            Trusted by Leading Wedding Brands
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            {/* Replace with actual partner logos */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 w-32 bg-white/10 rounded-lg" />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Hero; 