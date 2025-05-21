import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Container,
  Tooltip,
  Divider,
  ListItemIcon,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  AccountCircle,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  Menu as MenuIcon,
  Favorite as FavoriteIcon,
  EventNote as EventIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import Logo from './Logo';
import './Navbar.css';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenu = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchor(null);
  };

  const handleLogout = async () => {
    handleClose();
    await dispatch(logout());
    navigate('/login');
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  const handleDashboard = () => {
    handleClose();
    if (!user) return;

    switch (user.role) {
      case 'vendor':
        navigate('/vendor/dashboard', { replace: true });
        break;
      case 'admin':
        navigate('/admin', { replace: true });
        break;
      case 'customer':
        navigate('/dashboard', { replace: true });
        break;
      default:
        console.error('Unknown user role:', user.role);
        navigate('/', { replace: true });
    }
  };

  const getDashboardPath = () => {
    if (!user) return '/dashboard';
    
    switch (user.role) {
      case 'vendor':
        return '/vendor/dashboard';
      case 'admin':
        return '/admin';
      case 'customer':
        return '/dashboard';
      default:
        return '/';
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const renderMenu = (
    <Menu
      id="menu-appbar"
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(anchorEl)}
      onClose={handleClose}
      PaperProps={{
        sx: {
          mt: 1.5,
          width: 220,
          '& .MuiMenuItem-root': {
            px: 2,
            py: 1,
          },
        },
      }}
    >
      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography variant="subtitle1" noWrap>
          {user?.fullName || 'User'}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {user?.email}
        </Typography>
      </Box>
      <Divider />
      <MenuItem onClick={handleDashboard}>
        <ListItemIcon>
          <DashboardIcon fontSize="small" />
        </ListItemIcon>
        Dashboard
      </MenuItem>
      <MenuItem onClick={handleProfile}>
        <ListItemIcon>
          <PersonIcon fontSize="small" />
        </ListItemIcon>
        Profile
      </MenuItem>
      {user?.role === 'vendor' && (
        <MenuItem onClick={() => { handleClose(); navigate('/vendor/bookings'); }}>
          <ListItemIcon>
            <EventIcon fontSize="small" />
          </ListItemIcon>
          Bookings
        </MenuItem>
      )}
      {user?.role === 'user' && (
        <MenuItem onClick={() => { handleClose(); navigate('/favorites'); }}>
          <ListItemIcon>
            <FavoriteIcon fontSize="small" />
          </ListItemIcon>
          Favorites
        </MenuItem>
      )}
      <Divider />
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" color="error" />
        </ListItemIcon>
        <Typography color="error">Logout</Typography>
      </MenuItem>
    </Menu>
  );

  return (
    <AppBar position="sticky" elevation={1} sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {isMobile && isAuthenticated && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMobileMenu}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Link
            to="/"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Logo variant="small" />
          </Link>

          <Box sx={{ flexGrow: 1 }} />

          {!isMobile && isAuthenticated && (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mr: 2 }}>
              <Button
                color="inherit"
                startIcon={<DashboardIcon />}
                component={Link}
                to={getDashboardPath()}
                sx={{
                  fontWeight: isActive(getDashboardPath()) ? 700 : 400,
                  borderBottom: isActive(getDashboardPath()) ? 2 : 0,
                  borderRadius: 0,
                }}
              >
                Dashboard
              </Button>
              {user?.role === 'vendor' && (
                <Button
                  color="inherit"
                  startIcon={<EventIcon />}
                  component={Link}
                  to="/vendor/bookings"
                  sx={{
                    fontWeight: isActive('/vendor/bookings') ? 700 : 400,
                    borderBottom: isActive('/vendor/bookings') ? 2 : 0,
                    borderRadius: 0,
                  }}
                >
                  Bookings
                </Button>
              )}
            </Box>
          )}

          {isAuthenticated ? (
            <Tooltip title="Account settings">
              <IconButton
                size="large"
                onClick={handleMenu}
                sx={{
                  ml: 2,
                  border: '2px solid',
                  borderColor: 'primary.main',
                  padding: '4px'
                }}
              >
                {user?.avatar ? (
                  <Avatar
                    src={user.avatar}
                    alt={user.fullName}
                    sx={{ width: 32, height: 32 }}
                  />
                ) : (
                  <AccountCircle />
                )}
              </IconButton>
            </Tooltip>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                color="primary"
                component={Link}
                to="/login"
              >
                Login
              </Button>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/register"
              >
                Register
              </Button>
            </Box>
          )}

          {renderMenu}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
