import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout, getCurrentUser } from '../../store/slices/authSlice';
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
  Slide
} from '@mui/material';
import {
  AccountCircle,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Home as HomeIcon,
  Store as StoreIcon,
  Close as CloseIcon
} from '@mui/icons-material';
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
      navigate('/login', { replace: true });
      return;
    }

    const userRole = user.role || localStorage.getItem('userRole');
    if (!userRole) {
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
        navigate('/login', { replace: true });
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
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );

  const renderMobileMenu = (
    <SwipeableDrawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
      onOpen={() => setMobileMenuOpen(true)}
      PaperProps={{
        sx: {
          width: '80%',
          maxWidth: 300
        }
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton onClick={() => setMobileMenuOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        <ListItem>
          <ListItemButton component={Link} to="/" onClick={() => setMobileMenuOpen(false)}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton component={Link} to="/vendors" onClick={() => setMobileMenuOpen(false)}>
            <ListItemIcon>
              <StoreIcon />
            </ListItemIcon>
            <ListItemText primary="Vendors" />
          </ListItemButton>
        </ListItem>
        {isAuthenticated ? (
          <>
            <ListItem>
              <ListItemButton onClick={handleDashboard}>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton onClick={handleProfile}>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem>
              <ListItemButton component={Link} to="/login" onClick={() => setMobileMenuOpen(false)}>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton component={Link} to="/register" onClick={() => setMobileMenuOpen(false)}>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Register" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </SwipeableDrawer>
  );

  return (
      <HideOnScroll>
        <AppBar 
          position="fixed" 
          color="inherit" 
          elevation={isScrolled ? 4 : 0}
          className={`navbar ${isScrolled ? 'scrolled' : ''}`}
        >
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                <Link to="/" className="logo-link">
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                    ShaadiSetGo
                  </Typography>
                </Link>

              {!isMobile && (
                <Box sx={{ ml: 4, display: 'flex' }}>
                  <Button
                    component={Link}
                    to="/"
                    color={isActive('/') ? 'primary' : 'inherit'}
                    sx={{ mx: 1 }}
                  >
                    Home
                  </Button>
                  <Button
                    component={Link}
                    to="/vendors"
                    color={isActive('/vendors') ? 'primary' : 'inherit'}
                    sx={{ mx: 1 }}
                  >
                    Vendors
                  </Button>
                </Box>
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {!isMobile && isAuthenticated && (
                <>
                  <Tooltip title="Notifications">
                    <IconButton
                      size="large"
                      color="inherit"
                      onClick={handleNotificationClick}
                    >
                      <Badge badgeContent={notifications.filter(n => n.unread).length} color="error">
                        <NotificationsIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Dashboard">
                    <IconButton
                      size="large"
                      color="inherit"
                      onClick={handleDashboard}
                    >
                      <DashboardIcon />
                    </IconButton>
                  </Tooltip>
                </>
              )}

              {isAuthenticated ? (
                <>
                  {!isMobile && (
                    <Tooltip title="Account settings">
                      <IconButton
                        size="large"
                        edge="end"
                        onClick={handleMenu}
                        color="inherit"
                      >
                        <Avatar
                          src={user?.avatar}
                          alt={user?.fullName}
                          sx={{ width: 32, height: 32 }}
                        >
                          {user?.fullName?.[0]?.toUpperCase() || <AccountCircle />}
                        </Avatar>
                      </IconButton>
                    </Tooltip>
                  )}
                </>
              ) : (
                !isMobile && (
                  <>
                    <Button
                      component={Link}
                      to="/login"
                      color="inherit"
                      sx={{ mx: 1 }}
                    >
                      Login
                    </Button>
                    <Button
                      component={Link}
                      to="/register"
                      variant="contained"
                      color="primary"
                      sx={{ mx: 1 }}
                    >
                      Register
                    </Button>
                  </>
                )
              )}

              {isMobile && (
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  onClick={handleMobileMenuToggle}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>
        {renderNotificationMenu}
        {renderMenu}
        {renderMobileMenu}
      </AppBar>
    </HideOnScroll>
  );
};

export default Navbar;