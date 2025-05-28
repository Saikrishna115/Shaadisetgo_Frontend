import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, Container, useScrollTrigger } from '@mui/material';
import { styled } from '@mui/material/styles';

const NavLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  textDecoration: 'none',
  padding: theme.spacing(1.5),
  position: 'relative',
  fontWeight: 600,
  fontSize: '1rem',
  letterSpacing: '0.5px',
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
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1.5),
  transition: 'all 0.3s ease',
  height: '80px',
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(1, 3),
  },
}));

const Logo = styled('img')({
  height: '48px',
  cursor: 'pointer',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

const NavContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(3),
  alignItems: 'center',
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1, 3),
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 600,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
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
        py: isScrolled ? 0 : 0.5,
        borderBottom: '1px solid',
        borderColor: trigger ? 'divider' : 'transparent',
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
            <StyledButton
              variant="outlined"
              color="primary"
              onClick={() => navigate('/login')}
              sx={{
                borderWidth: '2px',
                '&:hover': {
                  borderWidth: '2px',
                },
              }}
            >
              Login
            </StyledButton>
            <StyledButton
              variant="contained"
              color="primary"
              onClick={() => navigate('/signup')}
              sx={{
                boxShadow: '0 4px 14px 0 rgba(0, 118, 255, 0.39)',
              }}
            >
              Get Free Quotes
            </StyledButton>
          </ButtonContainer>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
};

export default Header;