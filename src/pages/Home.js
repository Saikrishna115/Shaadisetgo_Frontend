import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaBuilding, FaCamera, FaUtensils, FaPaintBrush, FaMusic, FaPalette, FaMoneyBillWave, FaLock, FaHeart, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Box, Container, TextField, Button, Grid, Card, CardContent, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import heroBg from '../assets/hero-bg.jpg';
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
    { name: 'Venues', icon: <FaBuilding />, description: 'Find perfect wedding venues' },
    { name: 'Photography', icon: <FaCamera />, description: 'Capture your special moments' },
    { name: 'Catering', icon: <FaUtensils />, description: 'Delicious wedding cuisine' },
    { name: 'Decoration', icon: <FaPaintBrush />, description: 'Beautiful wedding decor' },
    { name: 'Music', icon: <FaMusic />, description: 'Set the perfect mood' },
    { name: 'Makeup', icon: <FaPalette />, description: 'Look your absolute best' }
  ];

  const howItWorks = [
    {
      icon: <FaSearch />,
      title: 'Discover',
      description: 'Browse our curated selection of top-rated wedding vendors in your city'
    },
    {
      icon: <FaMoneyBillWave />,
      title: 'Compare',
      description: 'Get transparent quotes and compare services side by side'
    },
    {
      icon: <FaLock />,
      title: 'Book Securely',
      description: 'Book with confidence using our secure payment system'
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
                Your Dream Wedding Starts Here
              </Typography>
              <Typography 
                variant="h5"
                sx={{ 
                  mb: 4,
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: { xs: '1.1rem', md: '1.5rem' },
                }}
              >
                Connect with top wedding vendors and plan your perfect day with ease
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

      {/* Categories Section */}
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
          Discover Our Services
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
                    <Button 
                      variant="outlined" 
                      sx={{ mt: 3 }}
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