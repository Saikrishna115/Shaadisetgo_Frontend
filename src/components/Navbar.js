import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout, getCurrentUser } from '../store/slices/authSlice';
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
  useMediaQuery,
  Badge,
  Fade,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import {
  AccountCircle,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  Menu as MenuIcon,
  Favorite as FavoriteIcon,
  EventNote as EventIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Home as HomeIcon,
  Store as StoreIcon,
  Help as HelpIcon
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
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications] = useState([
    { id: 1, message: 'New booking request', unread: true },
    { id: 2, message: 'Profile update reminder', unread: false }
  ]);

  useEffect(() => {
    if (isAuthenticated && !user && localStorage.getItem('token')) {
      dispatch(getCurrentUser());
    }
  }, [isAuthenticated, user, dispatch]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setNotificationAnchor(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = async () => {
    handleClose();
    await dispatch(logout());
    navigate('/login', { replace: true });
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile', { replace: true });
  };

  const handleDashboard = () => {
    handleClose();
    if (!user || !user.role) {
      console.error('User or user role is undefined');
      navigate('/login', { replace: true });
      return;
    }

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
    if (!user || !user.role) return '/login';
    
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

  const renderNotificationMenu = (
    <Menu
      anchorEl={notificationAnchor}
      open={Boolean(notificationAnchor)}
      onClose={handleClose}
      TransitionComponent={Fade}
      PaperProps={{
        sx: {
          width: 320,
          maxHeight: 400,
        },
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">Notifications</Typography>
      </Box>
      {notifications.map((notification) => (
        <MenuItem key={notification.id} sx={{ 
          py: 1.5,
          px: 2,
          borderLeft: notification.unread ? 3 : 0,
          borderColor: 'primary.main'
        }}>
          <ListItemText 
            primary={notification.message}
            secondary={notification.unread ? 'New' : null}
          />
        </MenuItem>
      ))}
      <Divider />
      <MenuItem sx={{ justifyContent: 'center' }}>
        <Typography color="primary">View All</Typography>
      </MenuItem>
    </Menu>
  );

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
      TransitionComponent={Fade}
      PaperProps={{
        elevation: 3,
        sx: {
          mt: 1.5,
          width: 250,
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
          '& .MuiMenuItem-root': {
            px: 2,
            py: 1.5,
          },
        },
      }}
    >
      <Box sx={{ px: 2, py: 2 }}>
        <Typography variant="subtitle1" noWrap fontWeight="bold">
          {user?.fullName || 'User'}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {user?.email}
        </Typography>
      </Box>
      <Divider />
      {user && user.role && (
        <>
          <MenuItem onClick={handleDashboard}>
            <ListItemIcon>
              <DashboardIcon fontSize="small" color="primary" />
            </ListItemIcon>
            Dashboard
          </MenuItem>
          <MenuItem onClick={handleProfile}>
            <ListItemIcon>
              <PersonIcon fontSize="small" color="primary" />
            </ListItemIcon>
            Profile
          </MenuItem>
          {user.role === 'vendor' && (
            <MenuItem onClick={() => { handleClose(); navigate('/vendor/bookings', { replace: true }); }}>
              <ListItemIcon>
                <EventIcon fontSize="small" color="primary" />
              </ListItemIcon>
              Bookings
            </MenuItem>
          )}
          {user.role === 'customer' && (
            <MenuItem onClick={() => { handleClose(); navigate('/favorites', { replace: true }); }}>
              <ListItemIcon>
                <FavoriteIcon fontSize="small" color="primary" />
              </ListItemIcon>
              Favorites
            </MenuItem>
          )}
          <MenuItem onClick={() => { handleClose(); navigate('/settings', { replace: true }); }}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" color="primary" />
            </ListItemIcon>
            Settings
          </MenuItem>
          <Divider />
        </>
      )}
      <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" color="error" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );

  const mobileDrawer = (
    <SwipeableDrawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
      onOpen={() => setMobileMenuOpen(true)}
      PaperProps={{
        sx: {
          width: 280
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        <Logo variant="small" />
      </Box>
      <Divider />
      <List>
        <ListItem>
          <ListItemButton component={Link} to="/" onClick={() => setMobileMenuOpen(false)}>
            <ListItemIcon>
              <HomeIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        {isAuthenticated && user?.role && (
          <>
            <ListItem>
              <ListItemButton 
                component={Link} 
                to={getDashboardPath()} 
                onClick={() => setMobileMenuOpen(false)}
              >
                <ListItemIcon>
                  <DashboardIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
            {user.role === 'vendor' && (
              <ListItem>
                <ListItemButton 
                  component={Link} 
                  to="/vendor/bookings" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ListItemIcon>
                    <EventIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Bookings" />
                </ListItemButton>
              </ListItem>
            )}
          </>
        )}
        <ListItem>
          <ListItemButton component={Link} to="/vendors" onClick={() => setMobileMenuOpen(false)}>
            <ListItemIcon>
              <StoreIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Browse Vendors" />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton component={Link} to="/help" onClick={() => setMobileMenuOpen(false)}>
            <ListItemIcon>
              <HelpIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Help & Support" />
          </ListItemButton>
        </ListItem>
      </List>
    </SwipeableDrawer>
  );

  return (
    <AppBar 
      position="sticky" 
      elevation={1} 
      sx={{ 
        bgcolor: 'background.paper', 
        color: 'text.primary',
        borderBottom: 1,
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar 
          disableGutters 
          sx={{
            minHeight: { xs: 64, sm: 70 },
            transition: 'min-height 0.2s ease-in-out'
          }}
        >
          {isMobile && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMobileMenuToggle}
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

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mr: 2 }}>
              <Button
                color="inherit"
                component={Link}
                to="/vendors"
                startIcon={<StoreIcon />}
                sx={{
                  fontWeight: isActive('/vendors') ? 700 : 400,
                  borderBottom: isActive('/vendors') ? 2 : 0,
                  borderRadius: 0,
                  px: 2,
                }}
              >
                Browse Vendors
              </Button>
              
              {isAuthenticated && user?.role && (
                <Button
                  color="inherit"
                  startIcon={<DashboardIcon />}
                  component={Link}
                  to={getDashboardPath()}
                  sx={{
                    fontWeight: isActive(getDashboardPath()) ? 700 : 400,
                    borderBottom: isActive(getDashboardPath()) ? 2 : 0,
                    borderRadius: 0,
                    px: 2,
                  }}
                >
                  Dashboard
                </Button>
              )}
              
              {isAuthenticated && user?.role === 'vendor' && (
                <Button
                  color="inherit"
                  startIcon={<EventIcon />}
                  component={Link}
                  to="/vendor/bookings"
                  sx={{
                    fontWeight: isActive('/vendor/bookings') ? 700 : 400,
                    borderBottom: isActive('/vendor/bookings') ? 2 : 0,
                    borderRadius: 0,
                    px: 2,
                  }}
                >
                  Bookings
                </Button>
              )}
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isMobile && (
              <IconButton color="inherit" size="large" onClick={() => navigate('/search')}>
                <SearchIcon />
              </IconButton>
            )}

            {isAuthenticated ? (
              <>
                <Tooltip title="Notifications">
                  <IconButton color="inherit" onClick={handleNotificationClick}>
                    <Badge badgeContent={notifications.filter(n => n.unread).length} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleMenu}
                    sx={{
                      ml: 1,
                      border: '2px solid',
                      borderColor: 'primary.main',
                      padding: '4px',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      }
                    }}
                  >
                    {user?.avatar ? (
                      <Avatar
                        src={user.avatar}
                        alt={user.fullName}
                        sx={{ 
                          width: 32, 
                          height: 32,
                          transition: 'transform 0.2s ease-in-out'
                        }}
                      />
                    ) : (
                      <AccountCircle />
                    )}
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  component={Link}
                  to="/login"
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/register"
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  Register
                </Button>
              </Box>
            )}
          </Box>

          {renderMenu}
          {renderNotificationMenu}
          {mobileDrawer}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
