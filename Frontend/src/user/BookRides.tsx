import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import { UserAPI } from "../Api/AxiosInterceptor";
import PaymentForm from "../components/Paymentform"; // Adjust the path if needed
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../context/StripeProvider";
import EnhancedPagination from "../components/Adwancepagination";
import moment from "moment";
import CancelBookingModal from "../components/CancelBooking";
import EnhancedAlerts from "../components/Alert";
interface Ride {
  _id: string;

driverImage?:string
drivername?:string
driverId: string;
  fromLocation: string;
  toLocation: string;
  startDate: string;
  endDate?: string;
  estimatedKm: number;
  estimatedFare: number;
  

finalFare?: number;
  status: "PENDING" | "CONFIRMED" |"CANCELLED" | "COMPLETED" | "REJECTED";
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED";
  bookingType:"RANGE_OF_DATES"|"ONE_RIDE"
}



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
  const fetchRides = async () => {
    try {
      setLoading(true);
      const res = await UserAPI.get(`/bookslot?page=${page}&limit=2`);
      console.log(res.data.data)
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
      await UserAPI.patch(`/cancel-booking`, {bookingId:rideId ,reason });

        setRefresh(prev=> !prev);
        setSuccess(true);
      setCancelModalOpen(false);
      setSelectedRideId(null);
  
   
    } catch (error:any) {
      console.error("Failed to cancel ride:", error);
      setError(error?.response?.data?.error || "Failed to cancel ride");
   
    }
  };
  

  const handlePayment = async (rideId: string) => {
    const ride = rides.find((r) => r._id === rideId);
    if (!ride) return;

    try {
      const res = await UserAPI.post("/create-payment-intent", {
        amount: (ride.finalFare || ride.estimatedFare) * 100, // Amount in paisa
        driverId:ride.driverId, // You can make this dynamic per ride
        rideId: ride._id,
      });
      console.log("Payment intent response:", res.data);

   
      await UserAPI.patch(`/update-booking/${ride._id}`, {
        paymentIntentId: res.data.paymentIntentId,
      });
     
     
      setClientSecret(res.data.clientSecret);
      
      setSelectedRide(ride);
  
        setRefresh((prev) => !prev);
    
      
    } catch (error:any) {
      alert(error?.response?.data?.error|| "Payment failed");
      console.error("Error creating payment intent", error);
    }
  };

  useEffect(() => {
    fetchRides();
  }, [page,refresh]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
const handlePaymentSuccess = async(paymentStatus:string,paymentid?:string) => {
    try {
      await UserAPI.patch(`/update-booking/${selectedRide?._id}`, {
        paymentStatus: paymentStatus,
        paymentid:paymentid
      
      });
      
    } catch (error) {
      console.log(error);
      
    }

}


  if (loading) return <CircularProgress />;

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
       
       onPaymentFailure={(paymentStatus: string) => {
 
        handlePaymentSuccess(paymentStatus); // or handlePaymentFailure if you have one
        fetchRides();
      }}
      onPaymentSuccess={(paymentStatus: string,paymentid:string) => {
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
            <Grid item xs={12} md={6} key={ride._id} >
              <Card>
                <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" mb={1}>
    🚗 Driver Info
  </Typography>
  <Grid container alignItems="center" spacing={1}>
    <Grid item>
      <img
        src={`${import.meta.env.VITE_IMAGEURL}/${ride.driverImage}`}
        alt="Driver"
        style={{
          width: 50,
          height: 50,
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />
    </Grid>
    <Grid item>
      <Typography variant="h6">{ride.drivername}</Typography>
    </Grid>
  </Grid>
                {ride.bookingType === "ONE_RIDE" && (
  <>
    <Typography variant="h6">From: {ride.fromLocation}</Typography>
    <Typography variant="h6">To: {ride.toLocation}</Typography>
  </>
)}

                  <Typography variant="body1">
  {ride.bookingType === "ONE_RIDE" ? (
    <>Date: {moment(ride.startDate).format("DD MMMM YYYY")}</>
  ) : (
    <>
      From: {moment(ride.startDate).format("DD MMMM YYYY")} <br />
      To: {moment(ride.endDate).format("DD MMMM YYYY")}
    </>
  )}
</Typography>

                  <Typography variant="body1">Booking Type: {ride.bookingType}</Typography>
                  <Typography variant="body1">Estimated Fare: ₹{ride.estimatedFare}</Typography>
                  <Typography variant="body1">payment:{ride.paymentStatus}</Typography>
                  {ride.finalFare && (
                    <Typography variant="body1" fontWeight="bold">
                      Final Amount: ₹{ride.finalFare}
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary">
                    Status: {ride.status}
                  </Typography>

                  {ride.status==="COMPLETED" && (ride.paymentStatus!=="COMPLETED") && (
  <Button
    variant="contained"
    color="primary"
    onClick={() => handlePayment(ride._id)}
  >
    Pay Now ₹{ride.finalFare || ride.estimatedFare}
  </Button>
) }

{(ride.status === "PENDING" || ride.status === "CONFIRMED") && (
    <Button variant="outlined" color="error" onClick={() => handleOpenCancelModal(ride._id)}>
    Cancel Booking
  </Button>
)}

                </CardContent>
              </Card>
            </Grid>
          ))}
          
        </Grid>
      )}
<CancelBookingModal
  open={cancelModalOpen}
  onClose={() => setCancelModalOpen(false)}
  onCancel={handleCancel}
  rideId={selectedRideId}
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
