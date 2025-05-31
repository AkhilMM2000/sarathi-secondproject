
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Grid,
  Avatar,
} from "@mui/material";
import moment from "moment";

const RideDetailsModal = ({ open, onClose, booking }: any) => {
  if (!booking) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Ride Details</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="subtitle2">User</Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar src={`/${booking.userImage}`} />
              <Typography>{booking.username}</Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2">Driver</Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar src={`/${booking.driverImage}`} />
              <Typography>{booking.drivername}</Typography>
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle2">From</Typography>
            <Typography>{booking.fromLocation}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2">To</Typography>
            <Typography>{booking.toLocation}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle2">Start Date</Typography>
            <Typography>{moment(booking.startDate).format("LLL")}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2">Estimated KM</Typography>
            <Typography>{booking.estimatedKm} km</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle2">Estimated Fare</Typography>
            <Typography>₹{booking.estimatedFare}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2">Final Fare</Typography>
            <Typography>
              {booking.finalFare ? `₹${booking.finalFare}` : "N/A"}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle2">Driver Fee</Typography>
            <Typography>
              {booking.driver_fee ? `₹${booking.driver_fee}` : "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2">Platform Fee</Typography>
            <Typography>
              {booking.platform_fee ? `₹${booking.platform_fee}` : "N/A"}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle2">Payment Mode</Typography>
            <Typography>{booking.paymentMode}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2">Payment Status</Typography>
            <Typography>{booking.paymentStatus}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle2">Booking Type</Typography>
            <Typography>{booking.bookingType}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2">Status</Typography>
            <Typography>{booking.status}</Typography>
          </Grid>

          {booking.reason && (
            <Grid item xs={12}>
              <Typography variant="subtitle2">Reason</Typography>
              <Typography>{booking.reason}</Typography>
            </Grid>
          )}

          <Grid item xs={6}>
            <Typography variant="subtitle2">Bookind created</Typography>
            <Typography>{moment(booking.createdAt).format("LLL")}</Typography>
          </Grid>
         
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RideDetailsModal;
