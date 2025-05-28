import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaBuilding, FaCamera, FaUtensils, FaPaintBrush, FaMusic, FaPalette, FaClock, FaMoneyBillWave, FaUserCheck, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Box, Container, TextField, Button, Grid, Card, CardContent, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import heroBg from '../assets/wedding-bg.jpg';
import './Home.css';

const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
  background: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
}));

const SearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      backgroundColor: '#ffffff',
    },
  },
}));

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { name: 'Venues', icon: <FaBuilding className="text-5xl" color="#FFC1CC" /> },
    { name: 'Photography', icon: <FaCamera className="text-5xl" color="#FFC1CC" /> },
    { name: 'Catering', icon: <FaUtensils className="text-5xl" color="#FFC1CC" /> },
    { name: 'Decoration', icon: <FaPaintBrush className="text-5xl" color="#FFC1CC" /> },
    { name: 'Music', icon: <FaMusic className="text-5xl" color="#FFC1CC" /> },
    { name: 'Makeup', icon: <FaPalette className="text-5xl" color="#FFC1CC" /> }
  ];

  const howItWorks = [
    {
      icon: <FaSearch />,
      title: 'Discover',
      description: 'Search top-rated photographers, caterers & decorators in your city.'
    },
    {
      icon: <FaMoneyBillWave />,
      title: 'Compare',
      description: 'Get instant, transparent quotes—no hidden fees.'
    },
    {
      icon: <FaLock />,
      title: 'Book',
      description: 'Secure your vendor with built-in escrow and relax.'
    }
  ];

  const features = [
    {
      icon: <FaClock />,
      title: 'Save Time & Effort',
      description: 'Browse 300+ vetted vendors in one place—stop toggling between sites.'
    },
    {
      icon: <FaMoneyBillWave />,
      title: 'Transparent Pricing',
      description: 'View real quotes upfront. No surprises, ever.'
    },
    {
      icon: <FaUserCheck />,
      title: 'Trusted Pros',
      description: 'Every vendor is background-checked and rated by real couples.'
    },
    {
      icon: <FaLock />,
      title: 'Hassle-Free Payments',
      description: 'Secure, escrow-backed transactions protect your deposit until your big day.'
    }
  ];

  const testimonials = [
    {
      title: 'Geo-Detect & Prefill',
      description: 'Start planning instantly—location detected for you.'
    },
    {
      title: 'Smart Search',
      description: 'Type once; get service + city suggestions in real time.'
    },
    {
      title: 'Live Chat & Support',
      description: 'Got questions? Chat with our wedding experts anytime.'
    }
  ];


  return (
    <Box className="home-container">
      {/* Hero Section */}
      <Box className="hero-section" style={{ backgroundImage: `url(${heroBg})` }}>
        <Container maxWidth="lg">
          <Box className="hero-content">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              variant="h1" className="hero-title" gutterBottom
            >
              Plan Your Dream Wedding in Minutes
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              variant="h5" className="hero-subtitle" gutterBottom
            >
              Connect instantly with handpicked, verified local vendors—no endless searches, no surprises.
            </motion.p>
            
            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="search-container" mt={4}
            >
              <SearchField
                fullWidth
                variant="outlined"
                placeholder="Search for venues, photographers, or caterers in your city"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <IconButton>
                      <FaSearch />
                    </IconButton>
                  ),
                }}
              />
              <button className="search-button" onClick={() => navigate('/vendors')}>
                <FaSearch /> Find Vendors
              </button>
            </motion.div>

            {/* Social Proof */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="social-proof"
            >
              <p>⭐️⭐️⭐️⭐️⭐️ 4.9/5 average vendor rating • Trusted by 12,000+ couples nationwide</p>
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* Categories Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h2" align="center" gutterBottom>
          Browse by Category
        </Typography>
        <Grid container spacing={4} mt={2}>
          {categories.map((category, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <StyledCard>
                  <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    {category.icon}
                    <Typography variant="h6" mt={2}>
                      {category.name}
                    </Typography>
                  </CardContent>
                </StyledCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ bgcolor: '#B2DFDB', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" align="center" gutterBottom>
            How It Works
          </Typography>
          <Grid container spacing={4} mt={2}>
            {howItWorks.map((step, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <StyledCard>
                    <CardContent sx={{ textAlign: 'center', p: 4 }}>
                      {step.icon}
                      <Typography variant="h5" mt={2}>
                        {step.title}
                      </Typography>
                      <Typography variant="body1" mt={1}>
                        {step.description}
                      </Typography>
                    </CardContent>
                  </StyledCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h2" align="center" gutterBottom>
          Why Choose ShaadiSetGo
        </Typography>
        <Grid container spacing={4} mt={2}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <StyledCard>
                  <CardContent sx={{ p: 4 }}>
                    {feature.icon}
                    <Typography variant="h5" mt={2}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" mt={1}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </StyledCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ bgcolor: '#FFF8F0', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" align="center" gutterBottom>
            What Couples Say
          </Typography>
          <Grid container spacing={4} mt={2}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <StyledCard>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                        {testimonial.content}
                      </Typography>
                      <Typography variant="subtitle1" mt={2} sx={{ color: 'primary.main' }}>
                        {testimonial.author}
                      </Typography>
                    </CardContent>
                  </StyledCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h2" gutterBottom>
            Ready to Start Planning?
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ color: 'text.secondary' }}>
            Join thousands of happy couples who planned their perfect day with ShaadiSetGo
          </Typography>
          <Box mt={4}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ mr: 2 }}
              onClick={() => navigate('/signup')}
            >
              Get Started Free
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={() => navigate('/contact')}
            >
              Contact Sales
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Home;