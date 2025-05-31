import  { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Avatar, 
  Typography, 
  Box, 
  Divider, 
  Tooltip,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import TravelExploreIcon from '@mui/icons-material/TravelExplore'; 

import LogoutIcon from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import usePreventBackNavigation from '../hooks/usePreventBackNavigation';
import { toast,ToastContainer} from 'react-toastify';
import ApiService from '../Api/ApiService';

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/adminhome" },
  { text: "User Management", icon: <PeopleIcon />, path: "/adminhome/users" },
  { text: "Driver Management", icon: <DirectionsCarIcon />, path: "/adminhome/drivers" },
  { text: "Ridelist", icon: <TravelExploreIcon/>, path: "/adminhome/Rides" },
];

const AdminSidebar = () => {
  usePreventBackNavigation()
  const location = useLocation();
  const theme = useTheme();
  const navigate=useNavigate()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleClick = async () => {
    try {
        const message = await ApiService.handleLogout("admin");
        toast.success(message);
        setTimeout(() => {
          navigate(`/admin`);
      }, 1500); // Adjust time if needed (1.5 seconds)
    } catch (error: any) {
        toast.error(error.message);
    }
};
  const drawerWidth = 280;

  const renderMenuItems = () => (
    <List>
      {menuItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <Tooltip title={item.text} placement="right" arrow>
              <ListItemButton 
                component={Link} 
                to={item.path} 
                onClick={isMobile ? handleDrawerToggle : undefined}
                sx={{ 
                  mx: 1,
                  borderRadius: 1.5,
                  backgroundColor: isActive ? "#1976d2" : "transparent",
                  color: isActive ? "white" : "inherit",
                  "&:hover": {
                    backgroundColor: isActive ? "#1565c0" : "#e3f2fd",
                  },
                  transition: "all 0.2s",
                }}
              >
                <ListItemIcon sx={{ color: isActive ? "white" : "#757575" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isActive ? "bold" : "medium" }} />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        );
      })}
    </List>
  );

  const drawer = (
    <>
      <Box 
        sx={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          padding: "20px 16px",
          background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
        }}
      >
        <AdminPanelSettingsIcon sx={{ fontSize: 40, color: "#ffffff" }} />
        <Typography 
          variant="h5" 
          sx={{ fontWeight: "bold", color: "#ffffff", marginLeft: 1.5 }}
        >
          Admin Panel
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 16px", backgroundColor: "#ffffff" }}>
        <Avatar sx={{ width: 100, height: 100, marginBottom: 2 }} />
        <Typography variant="h6" fontWeight="bold">Admin</Typography>
        <Typography variant="body2" color="text.secondary">System Administrator</Typography>
      </Box>
      
      <Divider />
      <Box sx={{ py: 2 }}>{renderMenuItems()}</Box>
      <Divider />

      <Box sx={{ mt: "auto", mb: 2, px: 1 }}>
        <ListItemButton sx={{ borderRadius: 1.5, mx: 1, color: "#d32f2f", "&:hover": { backgroundColor: "#ffebee" } }}>
          <ListItemIcon sx={{ color: "#d32f2f" }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: "medium" }} onClick={handleClick} />
        </ListItemButton>
      </Box>
    </>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {isMobile && (
        <IconButton
          color="inherit"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ position: 'fixed', top: 16, left: 16, zIndex: theme.zIndex.drawer + 1, backgroundColor: '#1976d2', color: 'white' }}
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      )}

      {!isMobile && (
        <Drawer 
          variant="permanent" 
          sx={{ width: drawerWidth, flexShrink: 0, "& .MuiDrawer-paper": { width: drawerWidth, backgroundColor: "#f8f9fa", borderRight: "1px solid #e0e0e0" } }}
        >
          {drawer}
        </Drawer>
      )}

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: "#f8f9fa" } }}
      >
        {drawer}
      </Drawer>

      <Box sx={{ flexGrow: 1, p: { xs: 1, sm: 2, md: 3 }, backgroundColor: "#f5f7fa", overflow: "auto", marginTop: isMobile ? '64px' : 0 }}>
        <Box sx={{ backgroundColor: "#ffffff", borderRadius: 2, boxShadow: "0 2px 10px rgba(0,0,0,0.05)", p: { xs: 1, sm: 2, md: 3 }, minHeight: "calc(100vh - 48px)" }}>
          <Outlet />
        </Box>
      </Box>
      <ToastContainer/>
    </Box>
  );
};

export default AdminSidebar;
