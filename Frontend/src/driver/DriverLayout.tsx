import  { useEffect,  useState } from 'react';
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
  Snackbar,
  Alert,
  Button,
  Rating,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import RouteIcon from "@mui/icons-material/Route";
import HistoryIcon from "@mui/icons-material/History";

import LogoutIcon from "@mui/icons-material/Logout";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

import { AppDispatch, RootState } from "../store/ReduxStore";
import { useDispatch, useSelector } from "react-redux";
import {  setDriver } from '../store/slices/DriverStore';
import { handleDriverData } from '../Api/driverService';
import moment from "moment";
import ApiService from '../Api/ApiService';
const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/driver" },
  { text: "Ride Management", icon: <RouteIcon />, path: "/driver/rides" },
  { text: "Trip History", icon: <HistoryIcon />, path: "/driver/history" },
 
];
import usePreventBackNavigation from '../hooks/usePreventBackNavigation';
import { toast,ToastContainer} from 'react-toastify';
import { CreatesocketConnection } from '../constant/socket';
import CallModal from '../components/CallModal';
import { CallerInfo } from '../constant/types';
import { useRingtone } from '../hooks/useRingtone';
import ViewReviewsModal from '../components/ViewReviewsModal';
const DriverSidebar = () => {
   usePreventBackNavigation()
  const location = useLocation();
  const navigate=useNavigate()
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const[driverId,setDriverId]=useState<string>('')
  const dispatch=useDispatch<AppDispatch>()
  const driverState = useSelector(
    (state: RootState) => state.driverStore.driver
  );
   const [openReviewModal, setOpenReviewModal] = useState(false);
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
    navigate('/driver/call?type=receiver')
  };

  const handleReject = () => {
    const socket = CreatesocketConnection();
    socket.emit("call:reject",{toId:callerInfo?.fromId})

    stopRingtone();
    setCallModalOpen(false);
  };




  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const driverData = await handleDriverData("driver");
      
        setDriverId(driverData._id)
        dispatch(setDriver(driverData)); // Update Redux store
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "An unknown error occurred";

        toast.error(errorMessage);
      }
    };

    fetchDriver();
  }, [dispatch]);





  //here i manage the all the driver side notification real time using socket io connection
  useEffect(() => {
    const socket =CreatesocketConnection(); 
    if (driverId) {
      socket.emit('driver:online', driverId); 
    }
  
    socket.on('booking:new', ({startDate}) => {
      const formattedDate = moment(startDate).format("MMMM D, dddd");
setMessage(`📢 New booking received from ${formattedDate}`);
      
      setOpen(true);
    });
  
  socket.on('cancel:booking',({reason,startDate})=>{
    const formattedDate = moment(startDate).format("MMMM D, dddd");
    setMessage(`cancel booking  ${formattedDate} due to ${reason}`);
      
      setOpen(true);
  })

 socket.on('payment:status',({status,startDate})=>{
  
  console.log(status,startDate,"paymentStatus event")
  const formattedDate = moment(startDate).format("MMMM D, dddd");
  setMessage(`Your ride payment has been ${status} on ${formattedDate}.`);
  setOpen(true);
 })

    return () => {
   socket.off('cancel:booking')
      socket.off('booking:new')
      socket.off('payment:status')
      
    };
  }, [driverId]);
  


  const handleClick = async () => {
    try {
        const message = await ApiService.handleLogout("driver");
        toast.success(message);
        setTimeout(() => {
          navigate(`/login?type=driver`);
      }, 1500); // Adjust time if needed (1.5 seconds)
    } catch (error: any) {
        toast.error(error.message);
    }
};

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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
                  backgroundColor: isActive ? "#0052cc" : "transparent",
                  color: isActive ? "white" : "inherit",
                  "&:hover": {
                    backgroundColor: isActive ? "#0047b3" : "#e3f2fd",
                  },
                  transition: "all 0.2s",
                }}
              >
                <ListItemIcon sx={{ color: isActive ? "white" : "#536dfe" }}>
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
          justifyContent: "space-between", 
          padding: "20px 16px",
          background: "linear-gradient(135deg, #0052cc 0%, #1e88e5 100%)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <DirectionsCarIcon sx={{ fontSize: 40, color: "#ffffff" }} />
          <Typography 
            variant="h5" 
            sx={{ fontWeight: "bold", color: "#ffffff", marginLeft: 1.5 }}
          >
            Sarathi Driver
          </Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle} sx={{ color: "#ffffff" }}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <Box sx={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        padding: "24px 16px", 
        backgroundColor: "#ffffff",
        backgroundImage: "linear-gradient(to bottom, rgba(0,82,204,0.05), rgba(255,255,255,1))"
      }}>
        <Avatar 
          sx={{ 
            width: 100, 
            height: 100, 
            marginBottom: 2,
            border: "4px solid #e3f2fd",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
          }} 
          src={`${import.meta.env.VITE_IMAGEURL}/${driverState?.profileImage}`}
        />
        <Typography variant="h6" fontWeight="bold">{driverState?.name}</Typography>
        <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
          <Rating
    value={driverState?.averageRating || 0}
    precision={0.1}
    readOnly
    size="small"
  />
         
          
        </Box>
          <Button 
    variant="contained" 
    size='small'
    onClick={() => setOpenReviewModal(true)} 
    sx={{ mt: 1 }}
  >
    View Reviews
  </Button>
        <Box sx={{ 
          mt: 2, 
          backgroundColor: "#e3f2fd", 
          borderRadius: 2, 
          padding: "8px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%"
        }}>
          <Typography variant="body2" color="#0052cc" fontWeight="medium">
            <Box component="span" sx={{ fontWeight: "bold", mr: 1 }}>Status:{driverState?.status}</Box> 
          
          </Typography>
        </Box>
      </Box>
      
      <Divider />
      <Box sx={{ py: 2, overflowY: "auto" }}>{renderMenuItems()}</Box>
      <Divider />

      <Box sx={{ mt: "auto", mb: 2, px: 1 }}>
        <ListItemButton sx={{ 
          borderRadius: 1.5, 
          mx: 1, 
          color: "#d32f2f",
          "&:hover": { 
            backgroundColor: "#ffebee" 
          } 
        }}>
          <ListItemIcon sx={{ color: "#d32f2f" }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: "medium" }} onClick={handleClick}/>
        </ListItemButton>
        <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={() => setOpen(false)}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={() => setOpen(false)} severity="info" sx={{ width: '100%', fontSize: '1rem' }}>
        {message}
      </Alert>
    </Snackbar>
     <CallModal
        open={callModalOpen}
        type={type}
      callerName={callerInfo?callerInfo.callerName:''}
  role={callerInfo?callerInfo.role:"user"}
  onAccept={handleAccept}
  onReject={handleReject}
      />
        {driverId && (
        <ViewReviewsModal
        role='driver'
          open={openReviewModal}
          onClose={() => setOpenReviewModal(false)}
          driverId={driverId}
        />
      )}
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
          sx={{ 
            position: 'fixed', 
            top: 16, 
            left: 16, 
            zIndex: theme.zIndex.drawer + 1, 
            backgroundColor: '#0052cc', 
            color: 'white',
            boxShadow: '0 2px 10px rgba(0,82,204,0.3)',
            '&:hover': {
              backgroundColor: '#0047b3'
            }
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {!isMobile && (
        <Drawer 
          variant="permanent" 
          sx={{ 
            width: drawerWidth, 
            flexShrink: 0, 
            "& .MuiDrawer-paper": { 
              width: drawerWidth, 
              backgroundColor: "#f8f9fa", 
              borderRight: "1px solid #e0e0e0",
              boxShadow: "2px 0 20px rgba(0,0,0,0.05)"
            } 
          }}
        >
          {drawer}
        </Drawer>
      )}

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ 
          display: { xs: 'block', md: 'none' }, 
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth, 
            backgroundColor: "#f8f9fa",
            boxShadow: "2px 0 20px rgba(0,0,0,0.1)"
          } 
        }}
      >
        {drawer}
      </Drawer>

      <Box sx={{ 
        flexGrow: 1, 
        p: { xs: 1, sm: 2, md: 3 }, 
        backgroundColor: "#f5f7fa", 
        overflow: "auto", 
        marginTop: isMobile ? '64px' : 0,
        backgroundImage: "linear-gradient(to bottom, #e3f2fd, #f5f7fa)"
      }}>
        <Box sx={{ 
          backgroundColor: "#ffffff", 
          borderRadius: 2, 
          boxShadow: "0 2px 20px rgba(0,0,0,0.05)", 
          p: { xs: 1, sm: 2, md: 3 }, 
          minHeight: "calc(100vh - 48px)"
        }}>
          <Outlet />
        </Box>
      </Box>
      <Snackbar
      open={open}
      autoHideDuration={10000}
      onClose={() => setOpen(false)}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={() => setOpen(false)} severity="info" sx={{ width: '100%', fontSize: '1rem' }}>
        {message}
      </Alert>
    </Snackbar>
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

export default DriverSidebar;