import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  useTheme,
  alpha,
  Divider,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import useFetchUser from '../hooks/useFetchUser';
import { useNavigate } from 'react-router-dom';
import ApiService from '../Api/ApiService';
import { toast ,ToastContainer} from 'react-toastify';

const NavBar = () => {
  const theme = useTheme();
  const navigate=useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [scrolled, setScrolled] = useState(false);
  const userData=useFetchUser()
 
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
   const handleClick = async () => {
      try {
          const message = await ApiService.handleLogout("user");
          toast.success(message);
          setTimeout(() => {
            navigate(`/login?type=user`);
        }, 1500); // Adjust time if needed (1.5 seconds)
      } catch (error: any) {
          toast.error(error.message);
      }
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
      elevation={0}
      sx={{ 
        background: scrolled 
          ? 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)' 
          : 'linear-gradient(90deg, #1565c0 0%, #1976d2 100%)',
        boxShadow: scrolled 
          ? '0px 2px 10px rgba(0, 0, 0, 0.15)' 
          : 'none',
        transition: 'all 0.3s ease',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 4 } }}>
        {/* Left side - Logo and App name with enhanced styling */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            background: alpha(theme.palette.common.white, 0.1),
            borderRadius: 2,
            px: 1.5,
            py: 0.5,
            transition: 'all 0.3s ease',
            '&:hover': {
              background: alpha(theme.palette.common.white, 0.15),
            }
          }}
        >
          <DirectionsCarIcon 
            sx={{ 
              mr: 1.5, 
              fontSize: 28,
              filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.2))'
            }} 
          />
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 'bold',
              letterSpacing: '0.5px',
              background: 'linear-gradient(45deg, #fff 30%, rgba(255,255,255,0.8) 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Sarathi
          </Typography>
        </Box>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* User info section */}
        <Box 
          sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            alignItems: 'center',
            mr: 2,
            opacity: 0.9
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
        
          </Typography>
          <Typography variant="body1" sx={{ ml: 0.5, fontWeight: 600 }}>
            {userData?.place}
          </Typography>
        </Box>

        {/* Right side - User avatar and dropdown menu */}
        <Box sx={{ position: 'relative' }}>
          <IconButton 
            onClick={handleMenuOpen} 
            size="large" 
            aria-controls={open ? 'profile-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            sx={{
              p: 0.5,
              border: '2px solid rgba(255, 255, 255, 0.7)',
              transition: 'all 0.2s ease',
              '&:hover': {
                border: '2px solid rgba(255, 255, 255, 0.9)',
                transform: 'scale(1.05)'
              }
            }}
          >
            <Avatar 
              src={`${import.meta.env.VITE_IMAGEURL}/${userData?.profile}`}
              sx={{ 
                width: 42, 
                height: 42,
                boxShadow: '0px 2px 5px rgba(0,0,0,0.2)'
              }}
            />
          </IconButton>
          
          <Menu
            id="profile-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            PaperProps={{
              elevation: 5,
              sx: {
                width: 220,
                mt: 1.5,
                overflow: 'visible',
                borderRadius: 2,
                filter: 'drop-shadow(0px 2px 12px rgba(0,0,0,0.2))',
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
            {/* User profile header in menu */}
            <Box sx={{ px: 2, py: 1.5, bgcolor: alpha(theme.palette.primary.light, 0.08) }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {userData?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {userData?.email}
              </Typography>
            </Box>
            
            <Divider />
            
            <MenuItem sx={{ py: 1.5 } }
             onClick={() => navigate('/userhome')}>
              <ListItemIcon >
                <AccountCircleIcon color="primary"  />
              </ListItemIcon>
              <ListItemText primary="My Profile"  />
            </MenuItem>
            
            <MenuItem sx={{ py: 1.5 }}
             onClick={() => navigate('/userhome/vehicle')}>
              <ListItemIcon>
                <DashboardIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="vehicle" />
            </MenuItem>
            
           
            
            <Divider />
            
            <MenuItem sx={{ py: 1.5, color: theme.palette.error.main }} onClick={handleClick }>
              <ListItemIcon>
                <LogoutIcon color="error" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
      <ToastContainer/>
    </AppBar>
  );
};

export default NavBar;