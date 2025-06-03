import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaBuilding, FaCamera, FaUtensils, FaPaintBrush, FaMusic, FaPalette, FaMoneyBillWave, FaLock, FaHeart, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Box, Container, TextField, Button, Grid, Card, CardContent, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import heroBg from '../assets/hero-bg.jpg';
import Header from '@/components/Header';
import './Home.css';
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      backgroundColor: '#ffffff',
    },
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  fontSize: '2.5rem',
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
}));

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { name: 'Plan My Wedding Tool', icon: <FaBuilding />, description: 'Tell us about your wedding, and we'll handle the rest.' },
    { name: 'Vendor Marketplace', icon: <FaCamera />, description: 'Browse curated professionals with availability and pricing.' },
    { name: 'Wedding Dashboard', icon: <FaUtensils />, description: 'Manage your guests, to-dos, and budget in one place.' }
  ];

  const benefits = [
    {
      icon: <FaSearch />,
      title: '💍 Personalized Wedding Planner',
      description: 'Get a complete wedding blueprint tailored to your date, budget & city.'
    },
    {
      icon: <FaMoneyBillWave />,
      title: '📍 Top-Rated Vendors',
      description: 'Discover decorators, caterers, and venues with real reviews.'
    },
    {
      icon: <FaLock />,
      title: '📊 Budget Smart Tools',
      description: 'Track spending, get alerts, and stay on top of your finances.'
    },
    {
      icon: <FaLock />,
      title: '📋 Checklist That Thinks Ahead',
      description: "We'll keep you on schedule, even if you forget."
    },
    {
      icon: <FaLock />,
      title: '📞 Planner Support (Optional)',
      description: 'Upgrade to a human assistant when you need that extra help.'
    }
  ];

  const testimonials = [
    {
      quote: 'Shaadisetgo took the pressure off planning. Our planner even helped us find a last-minute DJ!',
      couple: 'Aishwarya & Raghav',
      location: 'Hyderabad'
    },
    {
      quote: 'The platform felt like having a wedding planner in our pocket.',
      couple: 'Ritika & Jai',
      location: 'Jaipur'
    }
  ];

  return (
    <Box className="home-container">
      {/* Hero Section */}
      <Box 
        className="hero-section"
        sx={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
        }}
      >
        <Header />
        <Container maxWidth="lg">
          <Box 
            sx={{
              textAlign: 'center',
              maxWidth: '800px',
              mx: 'auto',
              p: 4,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography 
                variant="h1" 
                sx={{ 
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  fontWeight: 800,
                  mb: 3,
                  fontFamily: '"Playfair Display", serif',
                  background: 'linear-gradient(120deg, #FFC1CC, #D4AF37)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Everything You Need. Right Where You Need It.
              </Typography>
              <Typography 
                variant="h5"
                sx={{ 
                  mb: 4,
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: { xs: '1.1rem', md: '1.5rem' },
                }}
              >
                Why ShaadiSetGo?
              </Typography>

              <Box sx={{ maxWidth: '600px', mx: 'auto', mb: 4 }}>
                <SearchField
                  fullWidth
                  variant="outlined"
                  placeholder="Search for venues, photographers, or caterers"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <Button 
                        variant="contained" 
                        sx={{ 
                          height: '100%',
                          borderTopLeftRadius: 0,
                          borderBottomLeftRadius: 0,
                        }}
                      >
                        <FaSearch />
                        <Box component="span" sx={{ ml: 1, display: { xs: 'none', sm: 'block' } }}>
                          Search
                        </Box>
                      </Button>
                    ),
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FaStar style={{ color: '#FFD700' }} /> 4.9/5 Rating
                </Typography>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FaHeart style={{ color: '#FFC1CC' }} /> 10,000+ Happy Couples
                </Typography>
              </Box>
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography 
          variant="h2" 
          align="center" 
          gutterBottom
          sx={{ 
            mb: 6,
            fontFamily: '"Playfair Display", serif',
            fontSize: { xs: '2rem', md: '3rem' },
          }}
        >
          Why ShaadiSetGo?
        </Typography>
        <Grid container spacing={4}>
          {benefits.map((benefit, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <StyledCard>
                  <CardContent sx={{ p: 4, textAlign: 'center', flex: 1 }}>
                    <IconWrapper>{benefit.icon}</IconWrapper>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                      {benefit.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {benefit.description}
                    </Typography>
                  </CardContent>
                </StyledCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography 
          variant="h2" 
          align="center" 
          gutterBottom
          sx={{ 
            mb: 6,
            fontFamily: '"Playfair Display", serif',
            fontSize: { xs: '2rem', md: '3rem' },
          }}
        >
          🛠️ Features Preview
        </Typography>
        <Grid container spacing={4}>
          {categories.map((category, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <StyledCard>
                  <CardContent sx={{ p: 4, textAlign: 'center', flex: 1 }}>
                    <IconWrapper>{category.icon}</IconWrapper>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                      {category.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {category.description}
                    </Typography>
                  </CardContent>
                </StyledCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 }, bgcolor: 'grey.50' }}>
        <Typography 
          variant="h2" 
          align="center" 
          gutterBottom
          sx={{ 
            mb: 6,
            fontFamily: '"Playfair Display", serif',
            fontSize: { xs: '2rem', md: '3rem' },
          }}
        >
          👰🏽 Real Love. Real Stories.
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    p: 4,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    bgcolor: 'white',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic' }}>
                    
                      onClick={() => navigate(`/services/${category.name.toLowerCase()}`)}
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </StyledCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ bgcolor: 'background.default', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            align="center" 
            gutterBottom
            sx={{ 
              mb: 6,
              fontFamily: '"Playfair Display", serif',
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            How It Works
          </Typography>
          <Grid container spacing={4}>
            {howItWorks.map((step, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 4, 
                      height: '100%',
                      textAlign: 'center',
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                    }}
                  >
                    <IconWrapper>{step.icon}</IconWrapper>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {step.description}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          py: { xs: 6, md: 10 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography 
              variant="h2" 
              gutterBottom
              sx={{ 
                fontFamily: '"Playfair Display", serif',
                fontSize: { xs: '2rem', md: '3rem' },
                mb: 3,
              }}
            >
              Ready to Start Planning?
            </Typography>
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                mb: 4,
                opacity: 0.9,
                fontSize: { xs: '1.1rem', md: '1.5rem' },
              }}
            >
              Join thousands of happy couples who planned their perfect day with us
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => navigate('/signup')}
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  fontSize: '1.1rem',
                  backgroundColor: '#FFF',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: '#F3F3F3',
                  }
                }}
              >
                Get Started Free
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/contact')}
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  fontSize: '1.1rem',
                  borderColor: '#FFF',
                  color: '#FFF',
                  '&:hover': {
                    borderColor: '#F3F3F3',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                Contact Sales
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;