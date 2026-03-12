import React, { useContext, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip
} from '@mui/material';
import { Outlet, Link as RouterLink, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { ColorModeContext } from '../App';
import { useAuth } from '../context/AuthContext';
import {
  Menu as MenuIcon,
  Dashboard,
  History,
  Person,
  Logout,
  Receipt
} from '@mui/icons-material';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';

const drawerWidth = 280;

const Layout = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
  };

  const navigationItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Transaction History', icon: <History />, path: '/history' },
    { text: 'Profile', icon: <Person />, path: '/profile' },
    ...(user && user.department === 'Finance' && user.role === 'Core'
      ? [{ text: 'Vendor Management', icon: <Receipt />, path: '/vendor-management' }]
      : []),
  ];

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box
        sx={{
          p: 3,
          textAlign: 'center',
          borderBottom: 1,
          borderColor: 'divider',
          background:
            theme.palette.mode === 'light'
              ? 'linear-gradient(180deg, rgba(25,118,210,0.08), rgba(255,255,255,0))'
              : 'linear-gradient(180deg, rgba(144,202,249,0.16), rgba(0,0,0,0))',
        }}
      >
        <Box
          component="img"
          src={theme.palette.mode === 'light' ? '/Shaastra_2026_logo_black.png' : '/Shaastra_2026_logo_white.png'}
          alt="Shaastra Logo"
          sx={{ height: { xs: 58, sm: 52, md: 46 }, mb: 1.5 }}
        />
        <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
          Shaastra Wallet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Virtual Food Coupons
        </Typography>
      </Box>

      <Box sx={{ px: 2, py: 2 }}>
        <List disablePadding>
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={RouterLink}
                  to={item.path}
                  selected={isActive}
                  onClick={() => setMobileOpen(false)}
                  sx={{
                    borderRadius: 2,
                    py: 1.1,
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      '& .MuiListItemIcon-root': { color: 'primary.contrastText' },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 38, color: isActive ? 'inherit' : 'text.secondary' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{ fontWeight: isActive ? 700 : 500 }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Box sx={{ mt: 'auto', p: 2 }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: 'background.default',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {user?.name || 'User'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.userId || 'ID unavailable'}
          </Typography>
          {!!user?.role && <Chip label={`${user.role}${user?.department ? ` • ${user.department}` : ''}`} size="small" sx={{ mt: 1, maxWidth: '100%' }} />}
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color={theme.palette.mode === 'light' ? 'primary' : 'inherit'}
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1, textAlign: { xs: 'left', sm: 'center' }, pl: { xs: 0.5, sm: 0 } }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                color: theme.palette.mode === 'light' ? theme.palette.text.primary : 'inherit',
                fontWeight: 600,
                fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' },
              }}
            >
              {navigationItems.find((item) => item.path === location.pathname)?.text || 'Shaastra Wallet'}
            </Typography>
          </Box>

          <IconButton
            sx={{ ml: 1 }}
            onClick={colorMode.toggleColorMode}
            color={theme.palette.mode === 'light' ? 'primary' : 'inherit'}
            aria-label="toggle theme"
          >
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          {isAuthenticated && (
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar sx={{ width: 34, height: 34, bgcolor: 'secondary.main' }}>
                {user?.name?.charAt(0)?.toUpperCase()}
              </Avatar>
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.2))',
            mt: 1.5,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleProfileMenuClose} component={RouterLink} to="/profile">
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }} aria-label="app navigation">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          PaperProps={{
            sx: {
              top: { xs: '64px', sm: '64px' },
              height: 'calc(100% - 64px)',
            },
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 3 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          backgroundColor: 'background.default',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
