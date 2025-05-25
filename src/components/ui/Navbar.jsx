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

  const navbarStyle = {
    background: isScrolled
      ? 'linear-gradient(135deg, #FF4B91 0%, #FF7676 100%)'
      : 'linear-gradient(135deg, #FF4B91 0%, #FF7676 80%)',
    transition: 'all 0.3s ease-in-out',
    boxShadow: isScrolled
      ? '0 4px 20px rgba(0, 0, 0, 0.1)'
      : 'none',
    backdropFilter: isScrolled ? 'blur(10px)' : 'none',
    borderBottom: isScrolled ? 'none' : '1px solid rgba(255, 255, 255, 0.1)'
  };

  const buttonStyle = {
    color: '#fff',
    textTransform: 'none',
    fontWeight: 500,
    fontSize: '1rem',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-2px)',
      backgroundColor: 'rgba(255, 255, 255, 0.1)'
    }
  };

  const [notifications] = useState([
    { id: 1, message: 'New booking request', unread: true },
    { id: 2, message: 'Profile update reminder', unread: false }
  ]);

  useEffect(() => {
    if (isAuthenticated && !user && localStorage.getItem('token')) {
      dispatch(getCurrentUser());
    }
  }, [isAuthenticated, user, dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      const shouldBeScrolled = window.scrollY > 20;
      setIsScrolled(prev => {
        if (prev !== shouldBeScrolled) {
          return shouldBeScrolled;
        }
        return prev;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      id="notification-menu"
      anchorEl={notificationAnchor}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(notificationAnchor)}
      onClose={handleClose}
      TransitionComponent={Fade}
      PaperProps={{
        elevation: 4,
        sx: {
          width: 320,
          maxHeight: 400,
          mt: 1.5,
          borderRadius: '12px',
          border: '1px solid rgba(255, 75, 145, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }
      }}
    >
      <Box sx={{
        p: 2,
        background: 'linear-gradient(135deg, #FF4B91 0%, #FF7676 100%)',
        color: '#fff'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600, textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
          Notifications
        </Typography>
      </Box>
      <Box sx={{ maxHeight: 280, overflowY: 'auto' }}>
        {notifications.map(notification => (
          <MenuItem
            key={notification.id}
            onClick={handleClose}
            sx={{
              py: 1.5,
              px: 2,
              '&:hover': {
                backgroundColor: 'rgba(255, 75, 145, 0.05)'
              }
            }}
          >
            <ListItemIcon>
              <NotificationsIcon 
                sx={{ 
                  color: notification.unread ? '#FF4B91' : 'rgba(0, 0, 0, 0.54)'
                }} 
              />
            </ListItemIcon>
            <ListItemText 
              primary={
                <Typography variant="body1" sx={{ fontWeight: notification.unread ? 600 : 400 }}>
                  {notification.message}
                </Typography>
              }
              secondary={
                notification.unread && 
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#FF4B91',
                    fontWeight: 600 
                  }}
                >
                  New
                </Typography>
              }
            />
          </MenuItem>
        ))}
      </Box>
      <Divider sx={{ my: 1 }} />
      <MenuItem 
        sx={{ 
          justifyContent: 'center',
          py: 1.5,
          '&:hover': {
            backgroundColor: 'rgba(255, 75, 145, 0.05)'
          }
        }}
      >
        <Typography sx={{ color: '#FF4B91', fontWeight: 600 }}>
          View All
        </Typography>
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
        elevation: 4,
        sx: {
          mt: 1.5,
          overflow: 'hidden',
          borderRadius: '12px',
          border: '1px solid rgba(255, 75, 145, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <Box sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #FF4B91 0%, #FF7676 100%)',
        color: '#fff'
      }}>
        <Avatar
          src={user?.avatar}
          alt={user?.fullName}
          sx={{
            width: 60,
            height: 60,
            mb: 1,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            color: '#FF4B91',
            border: '2px solid rgba(255, 255, 255, 0.5)'
          }}
        >
          {user?.fullName?.[0]?.toUpperCase() || <AccountCircle />}
        </Avatar>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
          {user?.fullName || 'User'}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
          {user?.email}
        </Typography>
      </Box>
      <Box sx={{ mt: 1 }}>
        <MenuItem 
          onClick={handleDashboard}
          sx={{
            py: 1.5,
            '&:hover': {
              backgroundColor: 'rgba(255, 75, 145, 0.05)'
            }
          }}
        >
          <ListItemIcon>
            <DashboardIcon fontSize="small" sx={{ color: '#FF4B91' }} />
          </ListItemIcon>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Dashboard
          </Typography>
        </MenuItem>
        <MenuItem 
          onClick={handleProfile}
          sx={{
            py: 1.5,
            '&:hover': {
              backgroundColor: 'rgba(255, 75, 145, 0.05)'
            }
          }}
        >
          <ListItemIcon>
            <PersonIcon fontSize="small" sx={{ color: '#FF4B91' }} />
          </ListItemIcon>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Profile
          </Typography>
        </MenuItem>
        <MenuItem 
          onClick={handleLogout}
          sx={{
            py: 1.5,
            '&:hover': {
              backgroundColor: 'rgba(255, 75, 145, 0.05)'
            }
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: '#FF4B91' }} />
          </ListItemIcon>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Logout
          </Typography>
        </MenuItem>
      </Box>
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
          maxWidth: 300,
          background: 'linear-gradient(135deg, #FF4B91 0%, #FF7676 100%)',
          color: '#fff'
        }
      }}
    >
      <Box 
        sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'flex-end',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <IconButton 
          onClick={() => setMobileMenuOpen(false)}
          sx={{ 
            color: '#fff',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <List sx={{ pt: 0 }}>
        <ListItem>
          <ListItemButton 
            component={Link} 
            to="/" 
            onClick={() => setMobileMenuOpen(false)}
            sx={{
              color: '#fff',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <ListItemIcon>
              <HomeIcon sx={{ color: '#fff' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Home" 
              primaryTypographyProps={{
                fontSize: '1rem',
                fontWeight: 500
              }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton 
            component={Link} 
            to="/vendors" 
            onClick={() => setMobileMenuOpen(false)}
            sx={{
              color: '#fff',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <ListItemIcon>
              <StoreIcon sx={{ color: '#fff' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Vendors" 
              primaryTypographyProps={{
                fontSize: '1rem',
                fontWeight: 500
              }}
            />
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
          sx={navbarStyle}
        >
          <Container maxWidth="xl">
            <Toolbar disableGutters sx={{ minHeight: { xs: '64px', sm: '72px' } }}>
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                <Link to="/" style={{ textDecoration: 'none' }}>
                  <Typography 
                    variant="h5" 
                    component="div" 
                    sx={{ 
                      fontWeight: 700, 
                      color: '#fff',
                      letterSpacing: '0.5px',
                      textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        transition: 'transform 0.2s ease-in-out'
                      }
                    }}
                  >
                    ShaadiSetGo
                  </Typography>
                </Link>

              {!isMobile && (
                <Box sx={{ ml: 6, display: 'flex', gap: 2 }}>
                  <Button
                    component={Link}
                    to="/"
                    sx={{
                      ...buttonStyle,
                      borderBottom: isActive('/') ? '2px solid #fff' : 'none',
                      borderRadius: '2px',
                      pb: 0.5
                    }}
                  >
                    Home
                  </Button>
                  <Button
                    component={Link}
                    to="/vendors"
                    sx={{
                      ...buttonStyle,
                      borderBottom: isActive('/vendors') ? '2px solid #fff' : 'none',
                      borderRadius: '2px',
                      pb: 0.5
                    }}
                  >
                    Vendors
                  </Button>
                </Box>
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {!isMobile && isAuthenticated && (
                <>
                  <Tooltip title="Notifications">
                    <IconButton
                      size="large"
                      sx={{
                        color: '#fff',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)'
                        }
                      }}
                      onClick={handleNotificationClick}
                    >
                      <Badge 
                        badgeContent={notifications.filter(n => n.unread).length} 
                        sx={{
                          '& .MuiBadge-badge': {
                            backgroundColor: '#FF4B91',
                            color: '#fff'
                          }
                        }}
                      >
                        <NotificationsIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Dashboard">
                    <IconButton
                      size="large"
                      sx={{
                        color: '#fff',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)'
                        }
                      }}
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
                        sx={{
                          p: 0.5,
                          border: '2px solid rgba(255, 255, 255, 0.2)',
                          '&:hover': {
                            border: '2px solid rgba(255, 255, 255, 0.5)'
                          }
                        }}
                      >
                        <Avatar
                          src={user?.avatar}
                          alt={user?.fullName}
                          sx={{ 
                            width: 32, 
                            height: 32,
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            color: '#FF4B91'
                          }}
                        >
                          {user?.fullName?.[0]?.toUpperCase() || <AccountCircle />}
                        </Avatar>
                      </IconButton>
                    </Tooltip>
                  )}
                </>
              ) : (
                !isMobile && (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      component={Link}
                      to="/login"
                      sx={{
                        ...buttonStyle,
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                        '&:hover': {
                          border: '1px solid #fff',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)'
                        }
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      component={Link}
                      to="/register"
                      sx={{
                        ...buttonStyle,
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.2)'
                        }
                      }}
                    >
                      Register
                    </Button>
                  </Box>
                )
              )}

              {isMobile && (
                <IconButton
                  size="large"
                  edge="start"
                  sx={{ 
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
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