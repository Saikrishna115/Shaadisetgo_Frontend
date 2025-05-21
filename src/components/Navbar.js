import React, { useState, useEffect } from 'react';
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
  useScrollTrigger,
  Slide,
  Paper
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
  Help as HelpIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import Logo from './Logo';
import './Navbar.css';

const HideOnScroll = (props) => {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
};

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
  const [isScrolled, setIsScrolled] = useState(false);
  const [notifications] = useState([
    { id: 1, message: 'New booking request', unread: true },
    { id: 2, message: 'Profile update reminder', unread: false }
  ]);

  useEffect(() => {
    if (isAuthenticated && !user && localStorage.getItem('token')) {
      dispatch(getCurrentUser());
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    if (!user) {
      console.error('User is not defined');
      navigate('/login', { replace: true });
      return;
    }

    const userRole = user.role || localStorage.getItem('userRole');
    if (!userRole) {
      console.error('User role is not defined');
      navigate('/login', { replace: true });
      return;
    }

    switch (userRole) {
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
        console.error('Invalid user role:', userRole);
        navigate('/login', { replace: true });
    }
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    
    const userRole = user.role || localStorage.getItem('userRole');
    if (!userRole) return '/login';
    
    switch (userRole) {
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
      className="notification-menu"
      PaperProps={{
        elevation: 3,
        sx: {
          mt: 1.5,
          overflow: 'hidden'
        }
      }}
    >
      <Box className="notification-header">
        <Typography variant="h6">Notifications</Typography>
      </Box>
      {notifications.map((notification) => (
        <MenuItem 
          key={notification.id} 
          className={`notification-item ${notification.unread ? 'unread' : ''}`}
        >
          <ListItemIcon>
            <NotificationsIcon color={notification.unread ? 'primary' : 'action'} />
          </ListItemIcon>
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
          overflow: 'hidden'
        }
      }}
    >
      <Box className="profile-menu-header">
        <Avatar
          src={user?.avatar}
          alt={user?.fullName}
          className="profile-menu-avatar"
        >
          {user?.fullName?.[0]?.toUpperCase() || <AccountCircle />}
        </Avatar>
        <Typography variant="subtitle1" fontWeight="bold">
          {user?.fullName || 'User'}
        </Typography>
        <Typography variant="body2">
          {user?.email}
        </Typography>
      </Box>
      <Divider />
      {isAuthenticated && (
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
          {user?.role === 'vendor' && (
            <MenuItem onClick={() => { handleClose(); navigate('/vendor/bookings', { replace: true }); }}>
              <ListItemIcon>
                <EventIcon fontSize="small" color="primary" />
              </ListItemIcon>
              Bookings
            </MenuItem>
          )}
          {user?.role === 'customer' && (
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
      <Box className="mobile-menu-header">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Logo variant="small" />
          <IconButton 
            color="inherit" 
            onClick={() => setMobileMenuOpen(false)}
            sx={{ p: 0.5 }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        {isAuthenticated && user && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {user.fullName}
            </Typography>
            <Typography variant="body2">
              {user.email}
            </Typography>
          </Box>
        )}
      </Box>
      <List>
        <ListItem>
          <ListItemButton 
            component={Link} 
            to="/" 
            onClick={() => setMobileMenuOpen(false)}
            selected={isActive('/')}
          >
            <ListItemIcon>
              <HomeIcon color={isActive('/') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>

        <ListItem>
          <ListItemButton 
            component={Link} 
            to="/vendors" 
            onClick={() => setMobileMenuOpen(false)}
            selected={isActive('/vendors')}
          >
            <ListItemIcon>
              <StoreIcon color={isActive('/vendors') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Browse Vendors" />
          </ListItemButton>
        </ListItem>

        {isAuthenticated && (
          <ListItem>
            <ListItemButton 
              component={Link} 
              to={getDashboardPath()} 
              onClick={() => setMobileMenuOpen(false)}
              selected={isActive(getDashboardPath())}
            >
              <ListItemIcon>
                <DashboardIcon color={isActive(getDashboardPath()) ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
        )}

        {isAuthenticated && user?.role === 'vendor' && (
          <ListItem>
            <ListItemButton 
              component={Link} 
              to="/vendor/bookings" 
              onClick={() => setMobileMenuOpen(false)}
              selected={isActive('/vendor/bookings')}
            >
              <ListItemIcon>
                <EventIcon color={isActive('/vendor/bookings') ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Bookings" />
            </ListItemButton>
          </ListItem>
        )}

        <ListItem>
          <ListItemButton 
            component={Link} 
            to="/help" 
            onClick={() => setMobileMenuOpen(false)}
            selected={isActive('/help')}
          >
            <ListItemIcon>
              <HelpIcon color={isActive('/help') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Help & Support" />
          </ListItemButton>
        </ListItem>
      </List>
    </SwipeableDrawer>
  );

  return (
    <HideOnScroll>
      <AppBar 
        className={`navbar ${isScrolled ? 'scrolled' : ''}`}
        elevation={isScrolled ? 2 : 0}
      >
        <Container maxWidth="lg">
          <Toolbar 
            disableGutters 
            className={isScrolled ? 'scrolled' : ''}
          >
            {isMobile && (
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleMobileMenuToggle}
                className={`menu-icon ${mobileMenuOpen ? 'open' : ''}`}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Link
              to="/"
              className="navbar-brand"
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
                  className={isActive('/vendors') ? 'nav-item-active' : ''}
                >
                  Browse Vendors
                </Button>
                
                {isAuthenticated && (
                  <Button
                    color="inherit"
                    startIcon={<DashboardIcon />}
                    component={Link}
                    to={getDashboardPath()}
                    className={isActive(getDashboardPath()) ? 'nav-item-active' : ''}
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
                    className={isActive('/vendor/bookings') ? 'nav-item-active' : ''}
                  >
                    Bookings
                  </Button>
                )}
              </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {!isMobile && (
                <IconButton 
                  color="inherit" 
                  onClick={() => navigate('/search')}
                  className="search-button"
                >
                  <SearchIcon />
                </IconButton>
              )}

              {isAuthenticated ? (
                <>
                  <Tooltip title="Notifications">
                    <IconButton color="inherit" onClick={handleNotificationClick}>
                      <Badge 
                        badgeContent={notifications.filter(n => n.unread).length} 
                        color="error"
                      >
                        <NotificationsIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Account settings">
                    <IconButton
                      onClick={handleMenu}
                      className="profile-button"
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
                </>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    component={Link}
                    to="/login"
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/register"
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
    </HideOnScroll>
  );
};

export default Navbar;
