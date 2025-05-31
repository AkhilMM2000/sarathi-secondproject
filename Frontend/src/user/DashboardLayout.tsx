import  { useEffect, useState } from 'react';
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
  Badge, 
  Tooltip,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CommuteIcon from "@mui/icons-material/Commute";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import EmojiTransportationIcon from "@mui/icons-material/EmojiTransportation";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import WalletOutlinedIcon from '@mui/icons-material/WalletOutlined';
import ApiService from '../Api/ApiService';
import { toast,ToastContainer } from 'react-toastify';
import usePreventBackNavigation from '../hooks/usePreventBackNavigation';
import { AppDispatch, RootState } from '../store/ReduxStore';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '../store/slices/AuthuserStore';
import { getLoggedUserApi } from '../Api/userService';
import { CreatesocketConnection } from '../constant/socket';
import { useRingtone } from '../hooks/useRingtone';
import { CallerInfo } from '../constant/types';
import CallModal from '../components/CallModal';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/userhome/dashboard" },
  { text: "Vehicle Info", icon: <DirectionsCarIcon />, path: "/userhome/vehicle" },
  { text: "Current Rides", icon: <CommuteIcon />, path: "/userhome/rides" },
  { text: "Ride History", icon: <HistoryIcon />, path: "/userhome/ridehistory" },
  { text: "Wallet", icon: <WalletOutlinedIcon />, path: "/userhome/wallet" },
  { text: "Home", icon: <HomeOutlinedIcon />, path: "/home" },
];

const UserDashlayout= () => {
  usePreventBackNavigation()
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
const navigate=useNavigate()
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const dispatch = useDispatch<AppDispatch>(); // Type-safe dispatch
  const Currentuser = useSelector((state: RootState) => state.authUser.user);
  const drawerWidth = 280;

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
  const fetchLoggedUser = async () => {
    try {
      const user = await getLoggedUserApi();
      console.log(user);
      
      dispatch(setAuthUser(user)); 
    } catch (error) {
      console.error("Failed to fetch logged user:", error);
    }
  };

  fetchLoggedUser();
}, [dispatch]); 

//video call management
const [callModalOpen, setCallModalOpen] = useState<boolean>(false);
  const [type,  setCallType] = useState<"incoming" | "outgoing">("incoming");
  const [callerInfo, setCallerInfo] = useState<CallerInfo | null>(null);
 
const { playRingtone, stopRingtone } = useRingtone('/sounds/ringtone.mp3');
  

useEffect(()=>{
  const socket = CreatesocketConnection();

  socket.on("call:incoming", ({ fromId, callerName, role }) => {
    setCallerInfo({ fromId, callerName, role }); // store info in state
    setCallType("incoming");
    setCallModalOpen(true);
    playRingtone();
  });

  return () => {
    socket.off("call:incoming");
  };
},[])
  const handleAccept = () => {
  const socket = CreatesocketConnection();
  socket.emit('call:accept',{toId:callerInfo?.fromId,role:callerInfo?.role})
    stopRingtone();
    setCallModalOpen(false);
    navigate('/userhome/call?type=receiver')
  };

  const handleReject = () => {
    const socket = CreatesocketConnection();
    socket.emit("call:reject",{toId:callerInfo?.fromId})

    stopRingtone();
    setCallModalOpen(false);
  };


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
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontWeight: isActive ? "bold" : "medium" 
                  }} 
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        );
      })}
    </List>
  );

  const drawer = (
    <>
      {/* Sarathi Branding */}
      <Box 
        sx={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          padding: "20px 16px",
          background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
        }}
      >
        <EmojiTransportationIcon sx={{ fontSize: 40, color: "#ffffff" }} />
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: "bold", 
            color: "#ffffff", 
            marginLeft: 1.5,
            letterSpacing: "0.5px",
            textShadow: "1px 1px 2px rgba(0,0,0,0.2)"
          }}
        >
          Sarathi
        </Typography>
      </Box>

      {/* User Profile */}
      <Box 
        sx={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          padding: "24px 16px",
          backgroundColor: "#ffffff",
        }}
      >
        <Badge 
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                backgroundColor: '#44b700',
                border: '2px solid white',
              }}
            />
          }
        >
          <Avatar 
            src={`${import.meta.env.VITE_IMAGEURL}/${Currentuser?.profile}`}
            sx={{ 
              width: 100, 
              height: 100, 
              marginBottom: 2,
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
            }} 
          />
        </Badge>
        <Typography variant="h6" fontWeight="bold">{Currentuser?.name}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Active User
        </Typography>
      </Box>
      
      <Divider />

      {/* Navigation Menu */}
      <Box sx={{ py: 2 }}>
        {renderMenuItems()}
      </Box>

      <Divider />

      {/* Logout Button */}
      <Box sx={{ mt: "auto", mb: 2, px: 1 }}>
        <ListItemButton
          sx={{
            borderRadius: 1.5,
            mx: 1,
            color: "#d32f2f",
            "&:hover": {
              backgroundColor: "#ffebee",
            },
          }}
          onClick={handleClick}
        >
          <ListItemIcon sx={{ color: "#d32f2f" }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Logout" 
            primaryTypographyProps={{ fontWeight: "medium" }}
          />
        </ListItemButton>
       
      </Box>
         <CallModal
        open={callModalOpen}
        type={type}
      callerName={callerInfo?callerInfo.callerName:''}
  role={callerInfo?callerInfo.role:"user"}
  onAccept={handleAccept}
  onReject={handleReject}
      />
    </>
    
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Mobile Menu Toggle */}
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ 
            position: 'fixed', 
            top: 16, 
            left: 16, 
            zIndex: theme.zIndex.drawer + 1,
            backgroundColor: '#1976d2',
            color: 'white',
            '&:hover': {
              backgroundColor: '#1565c0',
            }
          }}
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      )}

      {/* Desktop Drawer */}
      {!isMobile && (
        <Drawer 
          variant="permanent" 
          sx={{ 
            width: drawerWidth, 
            flexShrink: 0, 
            "& .MuiDrawer-paper": { 
              width: drawerWidth, 
              boxSizing: "border-box", 
              backgroundColor: "#f8f9fa",
              borderRight: "1px solid #e0e0e0",
              boxShadow: "0 0 10px rgba(0,0,0,0.05)",
            } 
          }}
        >
          {drawer}
        </Drawer>
      )}

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            backgroundColor: "#f8f9fa",
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Right Side Content */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 1, sm: 2, md: 3 },
          backgroundColor: "#f5f7fa",
          overflow: "auto",
          marginTop: isMobile ? '64px' : 0, // Adjust for mobile menu toggle
        }}
      >
        <Box 
          sx={{ 
            backgroundColor: "#ffffff", 
            borderRadius: 2,
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            p: { xs: 1, sm: 2, md: 3 },
            minHeight: "calc(100vh - 48px)"
          }}
        >
          <Outlet />
        </Box>
      </Box>
      <ToastContainer/>
         <CallModal
        open={callModalOpen}
        type={type}
      callerName={callerInfo?callerInfo.callerName:''}
  role={callerInfo?callerInfo.role:"user"}
  onAccept={handleAccept}
  onReject={handleReject}
      />
    </Box>
  );
};

export default UserDashlayout