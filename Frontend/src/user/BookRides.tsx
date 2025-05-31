import React, {  useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Chip,
  useTheme,
  Avatar,
  IconButton,
  Divider,
  Snackbar,
  Alert,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { UserAPI } from "../Api/AxiosInterceptor";
import PaymentForm from "../components/Paymentform"; // Adjust the path if needed
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../context/StripeProvider";
import EnhancedPagination from "../components/Adwancepagination";
import moment from "moment";
import CancelBookingModal from "../components/CancelBooking";
import EnhancedAlerts from "../components/Alert";
import ChatIcon from '@mui/icons-material/Chat';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PaymentIcon from '@mui/icons-material/Payment';
import CancelIcon from '@mui/icons-material/Cancel';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { Box } from "@mui/material";
import ChatModal from "../components/chat";
import { AppDispatch, RootState } from "../store/ReduxStore";
import { useDispatch, useSelector } from "react-redux";
import { CreatesocketConnection } from "../constant/socket";
import VideoCallIcon from '@mui/icons-material/VideoCall';
import { updateUser } from "../store/slices/AuthuserStore";
import { useCallRequest } from "../hooks/useCallRequest";
import RateDriverModal from "../components/RateDriverModal";
interface PopulatedDriver {
  _id: string;
  name?: string;
  mobile: string;
  image?: string;
}
export interface Ride {
  _id: string;

driverImage?:string
drivername?:string
driverId: string|PopulatedDriver;
  fromLocation: string;
  toLocation: string;
  startDate: string;
  endDate?: string;
  estimatedKm: number;
  estimatedFare: number;
  
reason?:string
finalFare?: number;
  status: "PENDING" | "CONFIRMED" |"CANCELLED" | "COMPLETED" | "REJECTED";
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED";
  bookingType:"RANGE_OF_DATES"|"ONE_RIDE"
}


const getStatusColor = (status: Ride['status']): "success" | "warning" | "info" | "error" | "default" => {
  switch(status) {
    case "COMPLETED": return "success";
    case "PENDING": return "warning";
    case "CONFIRMED": return "info";
    case "CANCELLED": return "error";
    case "REJECTED": return "error";
    default: return "default";
  }
};

const getPaymentStatusColor = (status: Ride['paymentStatus']): "success" | "warning" | "error" | "default" => {
  switch(status) {
    case "COMPLETED": return "success";
    case "PENDING": return "warning";
    case "FAILED": return "error";
    default: return "default";
  }
};
const socket = CreatesocketConnection();
const Rides: React.FC = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [refresh, setRefresh] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string>('');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [chatRideId, setChatRideId] = useState<string | null>(null);
const [chatUserId, setChatUserId] = useState<string >('');
 const dispatch = useDispatch<AppDispatch>();
const user = useSelector((state: RootState) => state.authUser.user);
const [openSnackbar, setOpenSnackbar] = useState< boolean>(false);
const [snackbarMessage, setSnackbarMessage] = useState<string>("");

//review related
const [rateModalOpen, setRateModalOpen] = useState(false);
const [ReviewRideId, setReviewRideId] = useState<string >('');
const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
const handleOpenRateModal = (rideId: string, driverId: string) => {
setReviewRideId(rideId);
  setSelectedDriverId(driverId);
  setRateModalOpen(true);
};
const handleCloseRateModal = () => {
  setRateModalOpen(false);
  setSelectedRideId(null);
  setSelectedDriverId(null);
};
const showSnackbar = (msg: string, _type: "success" | "error" = "success") => {
  setSnackbarMessage(msg);
  setOpenSnackbar(true);
};


///wallet related
const [walletAppliedRideId, setWalletAppliedRideId] = useState<string | null>(null);
const[walletAmount,setWalletAmount] = useState<number>(0)

useEffect(() => {
  const fetchWalletAmount = async () => {
    try {
      const response = await UserAPI.get(`/wallet/ballence`);
      setWalletAmount(response.data.ballence);
    } catch (error) {
      console.error("Error fetching wallet amount:", error);
    }
  };

  fetchWalletAmount();
},[]);


const handleWalletCheckboxChange = (rideId: string) => {
  setWalletAppliedRideId(prev => (prev === rideId ? null : rideId));
};
console.log(walletAppliedRideId,'current wallet applied ride id')

//video call initiating hooks and usage 
const { initiateCall, calling,callAlert,setCallAlert } = useCallRequest();

const handleCall = (
  fromId: string,
  toId: string,
  callerName: string,
  role: "user" | "driver"
) => {
  
  initiateCall({fromId,toId,callerName,role,})

};


useEffect(() => {
  socket.on("referralRewarded", ({ status ,message}) => {

    dispatch( updateUser({ referalPay:status }));
    setSnackbarMessage(message);
    setOpenSnackbar(true); 
  });
  socket.on("booking:confirmation", ({status,startDate,bookingId}) => {
    console.log("Ride.tsx received booking confirmation:", status,startDate);
    setRides(prevRides =>
      prevRides.map(ride =>
        ride._id === bookingId
          ? { ...ride,  status: status }
          : ride
      )
    );
  });

   socket.on("booking:reject", ({bookingId}) => {
      
    setRides(prevRides =>
      prevRides.filter(ride =>
        ride._id !== bookingId
          
      )
    );
});

 

  return () => {
    socket.off("referalStatus");
    socket.off("booking:confirmation");
  };
}, []);

  const theme = useTheme();
  const fetchRides = async () => {
    try {
      setLoading(true);
      const res = await UserAPI.get(`/bookslot?page=${page}&limit=2`);
     console.log(res.data)
     setTotalPages(res.data.totalPages)
  setRides(res.data.data)
      
    } catch (error) {
      console.error("Failed to fetch rides", error);
    } finally {
      setLoading(false);
    }
  };

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedRideId, setSelectedRideId] = useState<string | null>(null);
  
  const handleOpenCancelModal = (rideId: string) => {
    setSelectedRideId(rideId);
    setCancelModalOpen(true);
  };
  
  const handleCancel = async (rideId: string, reason: string) => {
    try {
      await UserAPI.patch(`/booking/cancel`, {bookingId:rideId ,reason });

        setRefresh(prev=> !prev);
        setSuccess(true);
      setCancelModalOpen(false);
      setSelectedRideId(null);
    socket.emit("cancelbooking", {rideId});
   
    } catch (error:any) {
      console.error("Failed to cancel ride:", error);
      setError(error?.response?.data?.error || "Failed to cancel ride");
   
    }
  };
  

  const handlePayment = async (rideId: string,isUsingWallet:boolean) => {
    const ride = rides.find((r) => r._id === rideId);
    if (!ride) return;
const originalAmount = ride.finalFare || ride.estimatedFare || 0;
  const walletDeduction = isUsingWallet ? Math.min(walletAmount, originalAmount) : 0;
  const stripeAmount = originalAmount - walletDeduction;
    try {

 if (stripeAmount === 0) {
      await UserAPI.post('/wallet/ridepayment', {
        rideId: ride._id,
        amount: originalAmount,
      });
setWalletAmount(prev => prev - walletDeduction);  
   socket.emit("walletRidepayment", { userId:user?._id,rideId:ride._id});
      setRefresh((prev) => !prev);
      return;
    }



      const res = await UserAPI.post("/payment-intent", {
        amount: stripeAmount*100, // Amount in paisa
        driverId:ride.driverId, // You can make this dynamic per ride
        rideId: ride._id,
        
      });
     

    
      await UserAPI.patch(`/update-booking/${ride._id}`, {
        paymentIntentId: res.data.paymentIntentId,
        walletDeduction
      });

        socket.emit("ridePaymentSuccess", {rideId:ride._id});

       setWalletAmount(prev => prev - walletDeduction);
      
      setClientSecret(res.data.clientSecret);
      
      setSelectedRide(ride);
  
        setRefresh((prev) => !prev);
    
      
    } catch (error:any) {
    
         setSnackbarMessage(error?.response?.data?.error);
    setOpenSnackbar(true); 
      console.error("Error creating payment intent", error);
    }
  };

  useEffect(() => {
    fetchRides();
  }, [page,refresh]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
const handlePaymentSuccess = async(paymentStatus:Ride['paymentStatus'],paymentid?:string) => {
    try {
      await UserAPI.patch(`/update-booking/${selectedRide?._id}`, {
        paymentStatus: paymentStatus,
        paymentIntentId:paymentid
      
      });

      
      if(paymentStatus==="COMPLETED"&&user?.referalPay){
      
        socket.emit("referalPay", { userId:user._id});
    
      }
      setRides(prevRides =>
        prevRides.filter(ride =>
          ride._id !== selectedRide?._id
            
        )
      );


    } catch (error) {
      console.log(error);
      
    }

}


  if (loading) return <CircularProgress />;

if (rides.length === 0) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="60vh"
      textAlign="center"
    >
      <Box mb={2}>
        <img
          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 150'%3E%3Cpath d='M50 100h100l10-20H40z' fill='%23ddd'/%3E%3Ccircle cx='65' cy='110' r='8' fill='%23333'/%3E%3Ccircle cx='135' cy='110' r='8' fill='%23333'/%3E%3C/svg%3E"
  alt="No rides"
  width={180}
        />
      </Box>
      <Typography variant="h6" gutterBottom>
        You don't have a current ride now
      </Typography>
     
    </Box>
  );
}

  return (
    <div>

<EnhancedAlerts
         success={success}
         error={error}
        setSuccess={setSuccess}
        setError={setError}
         successMessage="Booking calcelled successfully"
         
         autoHideDuration={4000}
      />
      {clientSecret && selectedRide ? (
        <div className="my-4">
          <Typography variant="h5" gutterBottom>
            paying money to  {selectedRide.drivername}
          </Typography>
          <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentForm
       
       onPaymentFailure={(paymentStatus: Ride['paymentStatus']) => {
 
        handlePaymentSuccess(paymentStatus); // or handlePaymentFailure if you have one
        fetchRides();
      }}
      onPaymentSuccess={(paymentStatus:Ride['paymentStatus'],paymentid:string) => {
        setClientSecret('');
        setSelectedRide(null);
        handlePaymentSuccess(paymentStatus,paymentid);
        fetchRides();
      }}
          />
              </Elements>
              <Button
    variant="outlined"
    color="error"
    onClick={() => {
      setClientSecret('');
      setSelectedRide(null);
    }}
    sx={{ px: 4, py: 1.5, fontWeight: 'bold' }}
  >
    Cancel Payment
  </Button>
        </div>
      ) : (
        <Grid container spacing={2}>
         {rides.map((ride) => (
          <Grid item xs={12} md={6} key={ride._id}>
            <Card 
              elevation={hoveredCard === ride._id ? 6 : 2}
              onMouseEnter={() => setHoveredCard(ride._id)}
              onMouseLeave={() => setHoveredCard(null)}
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  transform: 'translateY(-5px)',
                }
              }}
            >
              {/* Card Header */}
              <Box 
                sx={{ 
                  bgcolor: theme.palette.primary.main,
                  color: 'white',
                  py: 1.5,
                  px: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Box display="flex" alignItems="center">
                  <DirectionsCarIcon sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" fontWeight="bold">
                    {ride.bookingType === "ONE_RIDE" ? "Single Ride" : "Multiple Days"}
                  </Typography>
                </Box>
                <Chip 
                  label={ride.status} 
                  size="small" 
                  color={getStatusColor(ride.status)}
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>
              
              <CardContent sx={{ flexGrow: 1, p: 3 }}>

                {/* Driver Information */}
                <Box sx={{ mb: 2.5 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={ride.driverImage ? `${import.meta.env.VITE_IMAGEURL}/${ride.driverImage}` : undefined}
                        alt={ride.drivername || "Driver"}
                        sx={{ width: 50, height: 50, mr: 2 }}
                      >
                        {!ride.driverImage && (ride.drivername?.[0] || "D")}
                      
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Driver</Typography>
                        <Typography variant="h6">
                          {ride.drivername || "Driver"}
                        
                        </Typography>
                        <Typography variant="h6">
                          {typeof ride.driverId === "object" && ride.driverId?.mobile ? ride.driverId.mobile : "Mobile"}
                        
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex" gap={3}>
                    {/* Chat Button */}
                    <IconButton 
                      color="primary"
                      aria-label="chat with driver"
                      onClick={() => {
                        setChatRideId(ride._id); 
                        setChatUserId(typeof ride.driverId === "object" ? ride.driverId._id : ''); 
                        setOpen(true);
                      }}
                      
                      sx={{ 
                        bgcolor: 'rgba(25, 118, 210, 0.1)',
                        '&:hover': {
                          bgcolor: 'rgba(25, 118, 210, 0.2)',
                        },
                        height: 40,
                        width: 40
                      }}
                    >
                      <ChatIcon />
                    </IconButton>
 {/* Video Call Button */}
 <IconButton 
 disabled={calling}
        color="secondary"
        aria-label="video call with driver"
        onClick={() =>
          handleCall(
            user?._id || '',         
            typeof ride.driverId === "object" ? ride.driverId._id:'' ,       
            user?.name || 'User',  
            'user'                  
          )
        }
          
        
        sx={{ 
          bgcolor: 'rgba(156, 39, 176, 0.1)',
          '&:hover': {
            bgcolor: 'rgba(156, 39, 176, 0.2)',
          },
          height: 40,
          width: 40
        }}
      >
        <VideoCallIcon />
      </IconButton>
    </Box>
    

   {ride.status === "COMPLETED" &&  (
        <Button
          variant="outlined"
          onClick={() => handleOpenRateModal(ride._id,typeof ride.driverId === "object" ? ride.driverId._id : '')}
        >
          Rate Driver
        </Button>
      )}
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                {/* Location Information */}
                {ride.bookingType === "ONE_RIDE" && (
                  <Box sx={{ mb: 2.5 }}>
                    <Box display="flex" alignItems="flex-start" mb={1.5}>
                      <LocationOnIcon color="error" sx={{ mr: 1, mt: 0.5 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">From</Typography>
                        <Typography variant="body1" fontWeight="medium">{ride.fromLocation}</Typography>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="flex-start">
                      <LocationOnIcon color="success" sx={{ mr: 1, mt: 0.5 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">To</Typography>
                        <Typography variant="body1" fontWeight="medium">{ride.toLocation}</Typography>
                      </Box>
                    </Box>
                  </Box>
                )}
                
                {/* Date Information */}
                <Box sx={{ mb: 2.5 }}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <CalendarTodayIcon sx={{ mr: 1, fontSize: '1rem' }} color="primary" />
                    <Typography variant="body2" color="text.secondary">
                      {ride.bookingType === "ONE_RIDE" ? "Date" : "Date Range"}
                    </Typography>
                  </Box>
                  
                  {ride.bookingType === "ONE_RIDE" ? (
                    <Typography variant="body1" fontWeight="medium">
                      {moment(ride.startDate).format("DD MMMM YYYY")}
                    </Typography>
                  ) : (
                    <>
                      <Typography variant="body1" fontWeight="medium">
                        From: {moment(ride.startDate).format("DD MMM YYYY")}
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        To: {moment(ride.endDate).format("DD MMM YYYY")}
                      </Typography>
                    </>
                  )}
                </Box>
                
                {/* Fare Information */}
                <Box sx={{ mb: 2.5 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Estimated Fare
                      </Typography>
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        ₹{ride.estimatedFare}
                      </Typography>
                    </Grid>
                    
                    {ride.finalFare && (
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Final Amount
                        </Typography>
                        <Typography variant="h6" color="success.main" fontWeight="bold">
                          ₹{ride.finalFare}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                  
                  <Box mt={1}>
                    <Chip 
                      size="small"
                      label={`Payment: ${ride.paymentStatus}`}
                      color={getPaymentStatusColor(ride.paymentStatus)}
                    />
                  </Box>
                  
                </Box>
            {ride.status === "COMPLETED" && (ride.paymentStatus !== "COMPLETED") && (
 <FormControlLabel
  control={
    <Checkbox
      checked={walletAppliedRideId === ride._id}
      onChange={() => handleWalletCheckboxChange(ride._id)}
      disabled={walletAmount <= 0}
    />
  }
  label={`Use Wallet (₹${walletAmount})`}
/>

)}

                {/* Action Buttons */}
                <Box sx={{ mt: 'auto', pt: 2 }}>
                  
                {ride.status === "COMPLETED" && ride.paymentStatus !== "COMPLETED" && (() => {
  const originalAmount = ride.finalFare || ride.estimatedFare || 0;
  const isUsingWallet = walletAppliedRideId === ride._id;
  const deducted = isUsingWallet ? Math.min(walletAmount, originalAmount) : 0;
  const payable = originalAmount - deducted;

  return (
    <Button
      variant="contained"
      color="primary"
      fullWidth
      startIcon={<PaymentIcon />}
      onClick={() => handlePayment(ride._id, isUsingWallet)}
      sx={{ mb: 1 }}
    >
     {payable > 0 ? `Pay ₹ ${payable}` : `Pay using Wallet`} 
    </Button>
  );
})()}

                  
                  {(ride.status === "PENDING" || ride.status === "CONFIRMED") && (
                    <Button
                      variant="outlined"
                      color="error"
                      fullWidth
                      startIcon={<CancelIcon />}
                      onClick={() => handleOpenCancelModal(ride._id)}
                    >
                      Cancel Booking
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
          
        </Grid>
      )}
     <Snackbar
  open={openSnackbar}
  autoHideDuration={4000}
  onClose={() => setOpenSnackbar(false)}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
  sx={{ 
    '& .MuiSnackbarContent-root': {
      minWidth: '400px',
      padding: 2,
      borderRadius: 2,
      boxShadow: 3,
      fontSize: '1.1rem',
    }
  }}
>
  <Alert
    onClose={() => setOpenSnackbar(false)}
    severity="success"
    sx={{
      width: '100%',
      fontSize: '1rem',
      fontWeight: 'bold',
      alignItems: 'center',
    }}
  >
    {snackbarMessage}
  </Alert>
</Snackbar>
<RateDriverModal
  open={rateModalOpen}
  onClose={handleCloseRateModal}
  driverId={selectedDriverId ?? ""}
  rideId={ReviewRideId?? ""}
  showSnackbar={showSnackbar}
  onReviewSubmitted={() => {
    // Refresh ride list or update the ride as reviewed
    handleCloseRateModal();
  }}
/>
{callAlert && (
  <Snackbar
    open={!!callAlert}
    autoHideDuration={4000}
    onClose={() => setCallAlert(null)}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
  >
    <Alert onClose={() => setCallAlert(null)} severity={callAlert.severity} variant="filled">
      {callAlert.message}
    </Alert>
  </Snackbar>
)}

<CancelBookingModal
  open={cancelModalOpen}
  onClose={() => setCancelModalOpen(false)}
  onCancel={handleCancel}
  rideId={selectedRideId}
/>
<ChatModal open={open}
 
  onClose={() => {
    setOpen(false);        
    setChatRideId(null);    
  }}
  senderType="user"
  recieverId={chatUserId}
  roomId={chatRideId}
  />
{!clientSecret&&
 <EnhancedPagination 
       count={totalPages} 
         page={page}  
        onChange={handlePageChange} 
        color="primary" 
      />}
    </div>
  );
};

export default Rides;
