import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Button,
  Typography,
} from "@mui/material";

import moment from "moment";
import { AdminAPI } from "../Api/AxiosInterceptor";
import EnhancedPagination from "../components/Adwancepagination";

interface Booking {
  _id: string;
  username: string;
  userImage: string;
  drivername: string;
  fromLocation: string;
  driverImage: string;
  startDate: string;
  status: string;
  finalFare?: number;
  estimatedFare: number;
  bookingType: string;
  paymentStatus: string;
}
import RideDetailsModal from "../components/BookingData"; // adjust the path if needed

const AllRides: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
const [openModal, setOpenModal] = useState(false);

  const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const fetchBookings = async () => {
        try {
          const response = await AdminAPI.get(`bookings?page=${page}&limit=5`);
          console.log(response)
          setBookings(response.data.bookings.data);
          setTotalPages(response.data.bookings.totalPages);
        } catch (error) {
          console.error("Failed to fetch bookings", error);
        }
      };

  useEffect(() => {
  

    fetchBookings();
  }, [page]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking);
    setOpenModal(true);
  };
  
  return (
    <>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Driver</TableCell>
            <TableCell>Ride Start</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Fare</TableCell>
            <TableCell>Booking Type</TableCell>
            <TableCell>Payment</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking._id}>
              <TableCell>
                <Avatar
                  src={`${import.meta.env.VITE_IMAGEURL}/${booking.userImage}`}
                  alt={booking.username}
                  sx={{ width: 32, height: 32, mr: 1 }}
                />
                {booking.username}
              </TableCell>
              <TableCell>
                <Avatar
                  src={`${import.meta.env.VITE_IMAGEURL}/${booking.driverImage}`}
                  alt={booking.drivername}
                  sx={{ width: 32, height: 32, mr: 1 }}
                />
                {booking.drivername}
              </TableCell>
              <TableCell>
                {moment(booking.startDate).format("DD MMMM YYYY")}
              </TableCell>
              <TableCell>
                <Typography variant="body2">{booking.status}</Typography>
              </TableCell>
              <TableCell>
                ₹{booking.finalFare ?? booking.estimatedFare}
              </TableCell>
              <TableCell>{booking.bookingType}</TableCell>
              <TableCell>{booking.paymentStatus}</TableCell>
              <TableCell>
                <Button variant="outlined" size="small" onClick={() => handleViewDetails(booking)}>
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <EnhancedPagination 
       count={totalPages} 
         page={page}  
        onChange={handlePageChange} 
        color="primary" 
      />
      <RideDetailsModal
  open={openModal}
  onClose={() => setOpenModal(false)}
  booking={selectedBooking}
/>

</>
  );
};

export default AllRides;
