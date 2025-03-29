import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';

const NavBar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [scrolled, setScrolled] = useState(false);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
<AppBar 
  position="fixed" 
  color="primary"
  elevation={0}
  sx={{ 
    boxShadow: scrolled ? '0px 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
    transition: 'box-shadow 0.3s ease'
  }}
>
  <Toolbar>
    {/* Left side - Logo and App name */}
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <DirectionsCarIcon sx={{ mr: 1 }} />
      <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
        Sarathi
      </Typography>
    </Box>

    {/* Spacer */}
    <Box sx={{ flexGrow: 1 }} />

    {/* Right side - User avatar and dropdown menu */}
    <IconButton onClick={handleMenuOpen} size="large" color="inherit">
      <Avatar src={'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Mamooty.jpg/220px-Mamooty.jpg'}
        sx={{ width: 40, height: 40 }}/>
    </IconButton>

    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleMenuClose}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <MenuItem onClick={handleMenuClose}>
        <DashboardIcon sx={{ mr: 1 }} />
        Dashboard
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <LogoutIcon sx={{ mr: 1 }} />
        Logout
      </MenuItem>
    </Menu>
  </Toolbar>
</AppBar>



  )
};

export default NavBar;
