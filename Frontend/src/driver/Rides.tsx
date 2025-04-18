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
  

} from "@mui/material";

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
import Rides from "../user/BookRides";
import moment from "moment";

interface Booking {
  _id: string;
  fromLocation?: string;
  toLocation?: string;
  startDate: string;
  endDate?: string;
  estimatedKm: number;
  estimatedFare: number;
 reason?:string
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "REJECTED";
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED";
  bookingType: string;
  username: string;
  
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

  const fetchBookings = async (currentPage: number) => {
    try {
      setLoading(true);
      const response = await DriverAPI.get(`/bookings?page=${currentPage}&limit=2`);
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
      <Grid container spacing={3}>
        {bookings.map((booking, index) => (
          <Grid item xs={12} md={6} key={booking._id}>
            <Card sx={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#e0f7fa" }}>
              <CardContent>
              <Typography variant="h6">BookedUser:{booking.username}</Typography>
              {booking.fromLocation && (
  <Typography variant="h6">From: {booking.fromLocation}</Typography>
)}
{booking.toLocation && (
  <Typography variant="h6">To: {booking.toLocation}</Typography>
)}
  
                <Typography variant="body1">Start:  {moment(booking.startDate).format("DD MMMM YYYY")}</Typography>
                {booking.endDate && (
                  <Typography variant="body1">End:  {moment(booking.startDate).format("DD MMMM YYYY")}</Typography>
                )}
                <Typography variant="body1">User: {booking.username}</Typography>
                {booking.finalFare ? (
  <Typography variant="body1">Final Fare: ₹{booking.finalFare}</Typography>
) : (
  <Typography variant="body1">Estimated Fare: ₹{booking.estimatedFare}</Typography>
)}

                <Typography>Status: {booking.status}</Typography>
                {booking.status === "CANCELLED" && booking.reason && (
  <Typography>Cancel reason: {booking.reason}</Typography>
)}

                {booking.status=== "PENDING" && (
  <Box mt={2} display="flex" gap={2}>
    <Button
      variant="contained"
      color="success"
      onClick={() => handleOpen(booking._id,'CONFIRMED')}
    >
      Accept
    </Button>
    <Button
      variant="outlined"
      color="error"
      onClick={() => handleOpen(booking._id,'REJECTED')}
    >
      Reject
    </Button>
  </Box>
)}
{booking.status === "CONFIRMED" && (
  <Box mt={2}>
    <Button
      variant="contained"
      color="primary"
      onClick={() => handleOpen(booking._id, 'COMPLETED')}
    >
      Complete Ride
    </Button>
  </Box>
)}
                <Typography>Payment: {booking.paymentStatus}</Typography>
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
