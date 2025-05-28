import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, Container, useScrollTrigger } from '@mui/material';
import { styled } from '@mui/material/styles';

const NavLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  textDecoration: 'none',
  padding: theme.spacing(1),
  position: 'relative',
  fontWeight: 500,
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '0%',
    height: '2px',
    bottom: '0',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: theme.palette.primary.main,
    transition: 'width 0.3s ease-in-out',
  },
  '&:hover::after': {
    width: '100%',
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  transition: 'all 0.3s ease',
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(1, 2),
  },
}));

const Logo = styled('img')({
  height: '40px',
  cursor: 'pointer',
});

const NavContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(4),
  alignItems: 'center',
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
}));

const Header = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AppBar
      position="fixed"
      elevation={trigger ? 4 : 0}
      sx={{
        bgcolor: 'background.default',
        transition: 'all 0.3s ease',
        py: isScrolled ? 0 : 1,
      }}
    >
      <Container maxWidth="xl">
        <StyledToolbar>
          <Logo
            src="/logo.svg"
            alt="ShaadiSetGo"
            onClick={() => navigate('/')}
          />

          <NavContainer sx={{ display: { xs: 'none', md: 'flex' } }}>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/services">Services</NavLink>
            <NavLink to="/how-it-works">How it Works</NavLink>
            <NavLink to="/testimonials">Testimonials</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </NavContainer>

          <ButtonContainer>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/login')}
              sx={{
                borderRadius: '50px',
                px: 3,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                },
              }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/get-quotes')}
              sx={{
                borderRadius: '50px',
                px: 3,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                },
              }}
            >
              Get Free Quotes
            </Button>
          </ButtonContainer>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
};

export default Header;