import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  School as SchoolIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Class as ClassIcon,
  EventNote as EventIcon,
  Assignment as AssignmentIcon,
  Grade as GradeIcon,
  Payment as PaymentIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../slices/authSlice';
import { toast } from 'react-toastify';

const Layout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notifications);

  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleProfile = () => {
    handleCloseUserMenu();
    toast.info('Profile page coming soon!');
  };

  // Navigation items based on role
  const getNavItems = () => {
    const commonItems = [
      { text: 'Courses', icon: <ClassIcon />, path: '/courses' },
      { text: 'Grades', icon: <GradeIcon />, path: '/grades' },
      { text: 'Assignments', icon: <AssignmentIcon />, path: '/assignments' }
    ];

    const roleSpecificItems = {
      admin: [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin-dashboard' },
        { text: 'Students', icon: <PeopleIcon />, path: '/students' },
        { text: 'Attendance', icon: <EventIcon />, path: '/attendance' },
        { text: 'Exams', icon: <EventIcon />, path: '/exams' },
        { text: 'Fees', icon: <PaymentIcon />, path: '/fees' }
      ],
      teacher: [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/teacher-dashboard' },
        { text: 'Students', icon: <PeopleIcon />, path: '/students' },
        { text: 'Attendance', icon: <EventIcon />, path: '/attendance' },
        { text: 'Exams', icon: <EventIcon />, path: '/exams' }
      ],
      student: [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/student-dashboard' },
        { text: 'Fees', icon: <PaymentIcon />, path: '/fees' }
      ]
    };

    return [...(roleSpecificItems[user?.role] || []), ...commonItems];
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <SchoolIcon sx={{ mr: 1, fontSize: 30 }} />
        <Typography variant="h6" component="div">
          College ERP
        </Typography>
      </Box>
      <Divider />
      <List>
        {getNavItems().map((item) => (
          <ListItem button key={item.text} onClick={() => navigate(item.path)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Mobile menu icon */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo and title */}
            <SchoolIcon sx={{ display: { xs: 'none', sm: 'flex' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                mr: 2,
                display: { xs: 'none', sm: 'flex' },
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
                flexGrow: 0
              }}
            >
              College ERP
            </Typography>

            {/* Desktop Navigation */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' }, ml: 3 }}>
              {getNavItems().map((item) => (
                <Button
                  key={item.text}
                  onClick={() => navigate(item.path)}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                  startIcon={item.icon}
                >
                  {item.text}
                </Button>
              ))}
            </Box>

            {/* Right side: Notifications and User menu */}
            <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Notifications */}
              <Tooltip title="Notifications">
                <IconButton color="inherit">
                  <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* User menu */}
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={user?.name} src={user?.avatar}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem disabled>
                  <Box>
                    <Typography variant="subtitle1">{user?.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user?.email}
                    </Typography>
                    <Typography variant="caption" display="block" color="primary">
                      {user?.role?.toUpperCase()}
                    </Typography>
                  </Box>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleProfile}>
                  <ListItemIcon>
                    <Avatar sx={{ width: 24, height: 24 }} />
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
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 }
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f5f5f5' }}>
        <Outlet />
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 2,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800]
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} College ERP System. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
