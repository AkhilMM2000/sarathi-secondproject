import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
 
  CircularProgress,
  Button,
  Modal,
  TextField,
  IconButton,
  Avatar,
  Paper,
  Snackbar,
  Alert,
  

} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import VideoCallIcon from "@mui/icons-material/VideoCall";

import EnhancedAlerts from "../components/Alert";

const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };
  
import { DriverAPI } from "../Api/AxiosInterceptor";
import EnhancedPagination from "../components/Adwancepagination";

import moment from "moment";
import ChatModal from "../components/chat";
import { CreatesocketConnection } from "../constant/socket";
import { useCallRequest } from "../hooks/useCallRequest";
import { useSelector } from "react-redux";
import { RootState } from "../store/ReduxStore";
interface User {
  _id: string;  
  name: string;
}
interface Booking {
  _id: string;
  fromLocation?: string;
  toLocation?: string;
  startDate: string;
  endDate?: string;
  estimatedKm: number;
  estimatedFare: number;
 reason?:string
  status: "PENDING" | "CONFIRMED"  | "COMPLETED" 
  paymentStatus: "PENDING" | "FAILED";
  bookingType: string;
  name: string;
  place:string,
  email:string,
  profile:string,
  mobile:string
  userId?:User
finalFare:number
}

const DriverBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string >('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [open, setOpen] = useState(false);
  const [actionType, setActionType] = useState<'CONFIRMED' | 'REJECTED'|'COMPLETED' | null>(null);
  const [reason, setReason] = useState('');
  const [bookingId, setBookingId] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [finalKm, setFinalKm] = useState<string>('');
  const [openChat, setOpenChat] = useState(false);
  const [chatRideId, setChatRideId] = useState<string | null>(null);
  const [recieverId, setRecieverId] = useState<string>('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const fetchBookings = async (currentPage: number) => {
    try {
      setLoading(true);
      const response = await DriverAPI.get(`/bookings?page=${currentPage}&limit=2`);
    console.log(response.data.data,'driver side ride')
      setBookings(response.data.data);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch bookings.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(page);
  }, [page,refresh]);

//video call management start here
 const authdriver = useSelector(
    (state: RootState) => state.driverStore.driver
  );

const { initiateCall, calling, callAlert, setCallAlert } = useCallRequest();

const handleCall = (
  fromId: string,
  toId: string,
  callerName: string,
  role: "user" | "driver"
) => {
 
  initiateCall({fromId,toId,callerName,role,})

};





  
  useEffect(() => {
    const socket=CreatesocketConnection()
    socket.on("cancel:booking", ({ status,reason,bookingId}) => {
      console.log(reason,bookingId,'in the driver ride page')
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId
            ? {
                ...booking,
                status,
                reason

                
              }
            : booking
        )
      );
     
    });
  socket.on("walletRidepaymentSuccess", (data) => {
    console.log("Wallet payment success:", data.rideId);
 setBookings((prevBookings) =>
    prevBookings.filter((booking) =>
      booking._id !== data.rideId
      
    )
  );
      setSnackbarMessage("your payment i received successfully");
      setSnackbarOpen(true);
  });
socket.on("cancelbookingSuccess", ({ message, rideId }) => {
  console.log(message, rideId);
 
    
  setBookings((prevBookings) =>
    prevBookings.filter((booking) =>
      booking._id !== rideId
      
    )
  );
   setSnackbarMessage("your ride is cancelled");
      setSnackbarOpen(true);
});
socket.on("ridePaymentSuccessAck", ({ message, rideId }) => {

  setBookings((prevBookings) =>
    prevBookings.filter((booking) =>
      booking._id !== rideId
      
    )
  );
setSnackbarMessage( message);
      setSnackbarOpen(true);
});

    


socket.on('payment:status',({bookingId})=>{
  console.log(bookingId,'bookingid in ride.tsx')
  
  setBookings((prevBookings) =>
    prevBookings.filter((booking) =>
      booking._id !== bookingId
      
    )
  );
 
  

 })
 const handleNewBooking = ({ newRide }: { newRide: Booking }) => {
  console.log('Received newRide:', newRide);
  setBookings((prev) => [newRide, ...prev].slice(0, 2)); // Add new ride at the top, limit to 2
};

socket.on('booking:new', handleNewBooking);


    return () => {
     
      socket.off('booking:new', handleNewBooking); // clean up
       socket.off("cancel:booking");
    socket.off("walletRidepaymentSuccess");
    socket.off("cancelbookingSuccess");
    socket.off("ridePaymentSuccessAck");
    socket.off("payment:status");
    
    };
  }, []);



  const handleOpen = (id:string,type: 'CONFIRMED' | 'REJECTED'|'COMPLETED') => {
    setActionType(type);
    setBookingId(id)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setActionType(null);
    setReason('');
   setBookingId('')
   setFinalKm('');
  };

  const handleSubmit = async() => {
  console.log(bookingId,actionType)
    if (!bookingId || !actionType) return;

    // Don’t call API if rejected without reason
    if (actionType === 'REJECTED' && reason.trim() === '') return;
  
    setLoading(true);
    setError('');
    try {
      await DriverAPI.patch(`/booking-status/${bookingId}`, {
        status: actionType,
        ...(actionType === 'REJECTED' && { reason: reason.trim() }),
        ...(actionType === 'COMPLETED' && { finalKm: Number(finalKm) }),
      });
  
      setSuccess(true); // trigger snackbar or any success indicator
      setRefresh(prev => !prev); // trigger re-fetch of bookings
      handleClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }
  
  if (bookings.length === 0) {
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

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>

       <EnhancedAlerts
         success={success}
         error={error}
        setSuccess={setSuccess}
        setError={setError}
         successMessage="Status updated successfully!"
         
         autoHideDuration={4000}
      />
      <Typography variant="h4" gutterBottom>
        My Bookings
      </Typography>
       <Grid container spacing={4}>
      {bookings.slice(0, 2).map((booking, index) => (
        <Grid item xs={12} md={6} key={booking._id}>
          <Card
            sx={{
              backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#e0f7fa",
              borderRadius: 3,
              boxShadow: 3,
            }}
          >
            <CardContent>
              {/* USER DETAILS */}
              <Paper elevation={3} sx={{ p: 2, borderRadius: 2, mb: 3 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: 600, color: "#333" }}
                >
                  User Details
                </Typography>

                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <Avatar
                      src={`${import.meta.env.VITE_IMAGEURL}${booking.profile}`}
                      alt={booking.name}
                      sx={{ width: 80, height: 80 }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={8}>
                    <Typography variant="body1">
                      <strong>Name:</strong> {booking.name}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Email:</strong> {booking.email}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Mobile:</strong> {booking.mobile || "Not Provided"}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Location:</strong> {booking.place}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* RIDE DETAILS */}
              <Box mb={2}>
                {booking.fromLocation && (
                  <Typography variant="body1">
                    <strong>From:</strong> {booking.fromLocation}
                  </Typography>
                )}
                {booking.toLocation && (
                  <Typography variant="body1">
                    <strong>To:</strong> {booking.toLocation}
                  </Typography>
                )}
                <Typography variant="body1">
                  <strong>Start:</strong>{" "}
                  {moment(booking.startDate).format("DD MMMM YYYY")}
                </Typography>
                {booking.endDate && (
                  <Typography variant="body1">
                    <strong>End:</strong>{" "}
                    {moment(booking.endDate).format("DD MMMM YYYY")}
                  </Typography>
                )}
                <Typography variant="body1">
                  <strong>
                    {booking.finalFare ? "Final Fare" : "Estimated Fare"}:
                  </strong>{" "}
                  ₹{booking.finalFare || booking.estimatedFare}
                </Typography>
                <Typography variant="body1">
                  <strong>Payment Status:</strong> {booking.paymentStatus}
                </Typography>
              </Box>

              {/* ACTION BUTTONS */}
              {booking.status === "PENDING" && (
                <Box display="flex" gap={2} mb={2}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleOpen(booking._id, "CONFIRMED")}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleOpen(booking._id, "REJECTED")}
                  >
                    Reject
                  </Button>
                </Box>
              )}
              {booking.status === "CONFIRMED" && (
                <Box mb={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpen(booking._id, "COMPLETED")}
                  >
                    Complete Ride
                  </Button>
                </Box>
              )}

              {/* CHAT AND VIDEO CALL ICONS */}
              <Box display="flex" alignItems="center" gap={2}>
                <IconButton
                  color="primary"
                  aria-label="chat with user"
                  onClick={() => {
                    setChatRideId(booking._id);
                    setRecieverId(booking.userId?._id || "");
                    setOpenChat(true);
                  }}
                  sx={{
                    bgcolor: "rgba(25, 118, 210, 0.1)",
                    "&:hover": {
                      bgcolor: "rgba(25, 118, 210, 0.2)",
                    },
                    height: 40,
                    width: 40,
                  }}
                >
                  <ChatIcon />
                </IconButton>

                <IconButton
                  disabled={calling}
                  color="secondary"
                  aria-label="video call"
                  onClick={() =>
                    handleCall(
                      authdriver?._id || "",
                      typeof booking.userId === "object"
                        ? booking.userId._id
                        : "",
                      authdriver?.name || "Driver",
                      "driver"
                    )
                  }
                  sx={{
                    bgcolor: "rgba(156, 39, 176, 0.1)",
                    "&:hover": {
                      bgcolor: "rgba(156, 39, 176, 0.2)",
                    },
                    height: 40,
                    width: 40,
                  }}
                >
                  <VideoCallIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
      <Box display="flex" justifyContent="center" mt={4}>
       <EnhancedPagination 
       count={totalPages} 
         page={page}  
        onChange={handlePageChange} 
        color="primary" 
      />
    </Box>

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
    <ChatModal open={openChat}
 recieverId={recieverId}
  onClose={() => {
    setOpenChat(false);        
    setChatRideId(null); 
    setRecieverId('');   
  }}
  senderType="driver"
  roomId={chatRideId}
  />
  <Snackbar
        open={snackbarOpen}
        autoHideDuration={7000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    <Modal open={open} onClose={handleClose}>
  <Box sx={style}>
    <Typography variant="h6" component="h2" mb={2}>
      {actionType === 'CONFIRMED' && 'Confirm Acceptance'}
      {actionType === 'REJECTED' && 'Reject Request'}
      {actionType === 'COMPLETED' && 'Complete Ride'}
    </Typography>

    {actionType === 'REJECTED' && (
      <TextField
        fullWidth
        label="Reason for Rejection"
        variant="outlined"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        multiline
        rows={3}
        sx={{ mb: 2 }}
      />
    )}

    {actionType === 'COMPLETED' && (
      <>
      <TextField
        fullWidth
        label="extra KM"
        variant="outlined"
        value={finalKm}
        onChange={(e) => setFinalKm(e.target.value)}
        type="number"
        sx={{ mb: 2 }}
      />
      <Typography variant="body2" color="text.secondary"      sx={{ mb: 2, color: 'warning.main', fontWeight: 'bold' }}>
      For multi-day rides, 1 day = 200 KM. Add extra KM only if confirmed with the ride owner.
      
    </Typography>
  </>
    )}

    <Box display="flex" justifyContent="flex-end" gap={2}>
      <Button onClick={handleClose}>Cancel</Button>
      <Button
        variant="contained"
        color={
          actionType === 'CONFIRMED'
            ? 'success'
            : actionType === 'REJECTED'
            ? 'error'
            : 'primary'
        }
        onClick={handleSubmit}
        disabled={(actionType === 'REJECTED' && reason.trim() === '') || (actionType === 'COMPLETED' && finalKm.trim() === '')}
      >
        Submit
      </Button>
    </Box>
  </Box>
</Modal>

      
    </Box>
  );
};

export default DriverBookings;
