import React, { useEffect, useState } from "react";
import LocationSelector from "../components/Bookdriver";
import { Typography, Avatar, Rating,  Button, Box, Paper, Divider, FormGroup, FormControlLabel, Checkbox, Grid, Snackbar, Alert } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useNearbyDrivers } from "../hooks/useNearbyDrivers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";


import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FareEstimateModal from "../components/FareEstimateModal";
import { UserAPI } from "../Api/AxiosInterceptor";
import ViewReviewsModal from "../components/ViewReviewsModal";
interface BookingData {
  from: string;
  to: string;
  distance: string;
  duration: string;
}

function BookDriver() {
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  const [openFareModal, setOpenFareModal] = useState(false);
const {driverID}=useParams()
const driverData=useNearbyDrivers(driverID)
const [isRangeMode, setIsRangeMode] = useState<boolean>(false);
  const [singleDate, setSingleDate] = useState<Dayjs | null>(null);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [_daysInRange, setDaysInRange] = useState<number>(0);
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const navigate=useNavigate()
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' | 'warning' }>({ open: false, message: "", severity: "success" });
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  // Handle checkbox change
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setIsRangeMode(event.target.checked);
    console.log('check box click',isRangeMode);
    
  };
useEffect(() => {
  if(!isRangeMode){
  
    setEndDate(null)
  }


}, [isRangeMode]);
  // Calculate days in range whenever dates change
  useEffect(() => {
    if (startDate && endDate) {
      const diff = endDate.diff(startDate, 'day');
      setDaysInRange(diff);
    } else {
      setDaysInRange(0);
    }
  }, [startDate, endDate]);

  // Handle start date change
  const handleStartDateChange = (newDate: Dayjs | null): void => {
    setStartDate(newDate);
    
    // If end date exists and is less than start date, reset it
    if (endDate && newDate && endDate.isBefore(newDate)) {
      setEndDate(null);
    }
    
    // If end date exists and the range would be > 5 days, adjust end date
    if (endDate && newDate && endDate.diff(newDate, 'day') > 5) {
      setEndDate(newDate.add(5, 'day'));
    }
  };
console.log('endate',endDate?.toDate())
  // Handle end date change
  const handleEndDateChange = (newDate: Dayjs | null): void => {
    // If setting end date would make range > 5 days, adjust it
    if (startDate && newDate && newDate.diff(startDate, 'day') > 5) {
      setEndDate(startDate.add(5, 'day'));
    } else {
      setEndDate(newDate);
    }
  };
  const handleBookDriver = async() => {
  
  
    if (!bookingData&&!isRangeMode) {
      setSnackbar({ open: true, message: "Please select a location first.", severity: "error" });
      return;
    }
  
    try {
      // Prepare booking data
      const bookingPayload = isRangeMode
        ? {
            driverId: driverData[0]?._id,
            fromLocation: bookingData?.from || "",
            toLocation: bookingData?.to,
            startDate: startDate,
            endDate: endDate?.toDate(),
            estimatedKm:  bookingData?.distance.replace(/,/g, "").replace(" km", ""),
            bookingType: "RANGE_OF_DATES",
          }
        : {
             fromLocation: bookingData?.from || "",
             toLocation: bookingData?.to,
            driverId: driverData[0]?._id,
            startDate: singleDate?.toISOString(),
            estimatedKm:  bookingData?.distance.replace(/,/g, "").replace(" km", ""),
            bookingType: "ONE_RIDE",
          };
  
      // Make API call
      const response = await UserAPI.post("/bookslot", bookingPayload);
  
      if (response.data.success) {
        setSnackbar({ open: true, message: "Driver booked successfully!", severity: "success" });
        navigate("/userhome/rides")
      } else {
        setSnackbar({ open: true, message: "Failed to book the driver.", severity: "error" });
      }
    
    } catch (error:any) {
      console.error("Error booking driver:", error);
    setSnackbar({
      open: true,
      message: error.response?.data?.error || "Failed to book driver",
      severity: "error",
    });
    }
  };

  const isBookingEnabled = () => {
    if (isRangeMode && startDate && endDate) {
      return true;
    } else if (!isRangeMode && singleDate) {
      return !!bookingData;
    }
    return false;
  };

  return (
    <div className="container mx-auto px-4 py-8">
        <Snackbar
      open={snackbar.open}
      autoHideDuration={3000} // Show for 3 seconds
      onClose={handleCloseSnackbar}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
        {snackbar.message}
      </Alert>
    </Snackbar>
    <Typography variant="h4" className="mb-6 text-center font-bold text-blue-800">
      <DirectionsCarIcon className="mr-2" /> Book Your Ride
    </Typography>
    
    <div className="flex flex-col lg:flex-row gap-6 mb-6">
      {/* Left side - Location Selector */}
      <div className="w-full lg:w-1/2">
        <Paper elevation={3} className="p-6 rounded-lg h-full">
          <div className="flex items-center mb-4">
            <LocationOnIcon className="text-blue-600 mr-2" />
            <Typography variant="h6" className="font-semibold">Your Journey</Typography>
          </div>
          <LocationSelector onLocationSelect={setBookingData} />
        </Paper>
      </div>
      
      {/* Right side - Driver details */}
      <div className="w-full lg:w-1/2">
        <Paper elevation={3} className="p-6 rounded-lg h-full">
          <div className="flex items-center mb-4">
            <DirectionsCarIcon className="text-blue-600 mr-2" />
            <Typography variant="h6" className="font-semibold">Available Drivers</Typography>
          </div>
          
          { driverData.length === 0 ? (
          
            <Typography className="text-center py-12">No drivers available in this area</Typography>
          ) : (
            <Box className="border rounded-lg p-4 transition-all hover:shadow-lg bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center">
                {/* Driver Avatar */}
                <div className="relative">
                  <Avatar 
                    src={`${import.meta.env.VITE_IMAGEURL}/${driverData[0]?.profileImage}`} 
                    alt="Driver" 
                    className="w-20 h-20 mb-2 sm:mb-0 border-2 border-blue-500"
                  />
                  <div className="absolute -top-1 -right-1 bg-green-500 w-4 h-4 rounded-full"></div>
                </div>

                {/* Driver Details */}
                <div className="sm:ml-4 flex-1">
                  <Typography variant="subtitle1" className="font-medium">{driverData[0]?.mobile}</Typography>
                  <div className="flex items-center">
                    <Rating value={driverData[0]?.averageRating} precision={0.1} size="small" readOnly />
                    <Typography variant="body2" className="ml-2">{driverData[0]?.email}</Typography>
                  </div>
                  <Typography variant="body2" color="text.secondary">{driverData[0]?.place}</Typography>
                  <div className="mt-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full inline-block">
          <Button
    variant="outlined"
    size="small"
    onClick={() => setOpenReviewModal(true)}
    sx={{ mt: 1, borderRadius: '9999px', textTransform: 'none' }}
  >
    View Reviews
  </Button>
                  </div>
                </div>

                {/* Driver Distance */}
                <div className="text-center bg-blue-50 p-2 rounded-lg mt-2 sm:mt-0">
                  <Typography variant="h6" className="font-bold text-blue-800">{driverData[0]?.distance} Km</Typography>
                  <Typography variant="caption" className="text-blue-600">away</Typography>
                </div>
              </div>

              <Divider className="my-3" />

              {/* Driver Actions */}
              <div>
              
                <Button 
             
                  variant="outlined" 
                  fullWidth 
                  className="mt-2 text-blue-700 border-blue-700"
                   component={Link}
             to="/drivers"
                >
                  View All Drivers
                </Button>
              </div>
            </Box>
          )}
        </Paper>
      </div>
    </div>
    
    {/* Schedule Section */}
    <Paper elevation={3} className="p-6 rounded-lg mb-6">
  <div className="flex items-center mb-4">
    <CalendarMonthIcon className="text-blue-600 mr-2" />
    <Typography variant="h6" className="font-semibold">Schedule Your Ride</Typography>
  </div>
  
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <div className="bg-blue-50 p-4 rounded-lg mb-4">
      <FormGroup>
        <FormControlLabel 
          control={
            <Checkbox 
              checked={isRangeMode} 
              onChange={handleCheckboxChange}
              color="primary"
            />
          } 
          label={
            <Typography variant="body1">
              {isRangeMode ? "Multi-day booking (2-6 days)" : "Single day booking"}
            </Typography>
          }
        />
      </FormGroup>
    </div>
    
    <Box sx={{ mt: 2 }}>
      {isRangeMode ? (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={handleStartDateChange}
              shouldDisableDate={(date) => date.isBefore(dayjs(), "day")}
              slotProps={{ 
                textField: { 
                  fullWidth: true,
                  variant: "outlined"
                } 
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={handleEndDateChange}
              disabled={!startDate}
              minDate={startDate ? startDate.add(1, 'day') : undefined} 
              maxDate={startDate ? startDate.add(5, 'day') : undefined}
              slotProps={{ 
                textField: { 
                  fullWidth: true,
                  variant: "outlined"
                } 
              }}
            />
          </Grid>
        </Grid>
      ) : (
        <DatePicker
          label="Select Date"
          value={singleDate}
          onChange={(newValue: Dayjs | null) => setSingleDate(newValue?.hour(12)|| null)}
          shouldDisableDate={(date) => date.isBefore(dayjs(), "day")}
          slotProps={{ 
            textField: { 
              fullWidth: true,
              variant: "outlined"
            } 
          }}
        />
      )}
    </Box>
    
    {/* Pricing information */}
    {isBookingEnabled()&& <Box sx={{ mt: 3 }} className="bg-blue-100 p-4 rounded-lg">
  <div className="flex flex-col items-center justify-center">
  
    <Button
      variant="contained"
      color="primary"
      onClick={() => setOpenFareModal(true)}
      className="mb-2"
    >
      Show Estimated Fare
    </Button>

    <FareEstimateModal
    SingleRide={!isRangeMode}
      open={openFareModal}
      onClose={() => setOpenFareModal(false)}
      bookingType={endDate?"RANGE_OF_DATES":"ONE_RIDE"}
      estimatedKm={
        bookingData ? parseFloat(bookingData.distance.replace(/,/g, "").replace(" km", "")) : 0
      }
      startDate={
        isRangeMode
          ? startDate?.hour(12).toDate() || new Date()
          : singleDate?.hour(12).toDate() || new Date()
      }
      {...(isRangeMode && {
        endDate: endDate?.hour(12).toDate() || new Date(),
      })}
      
    />
  </div>
</Box>}

  </LocalizationProvider>
</Paper>
     {driverData[0]._id && (
        <ViewReviewsModal
        role="user"
          open={openReviewModal}
          onClose={() => setOpenReviewModal(false)}
          driverId={driverData[0]._id }
        />
      )}
    {/* Book Now Button */}
    <div className="flex justify-center">
    <Button 
          variant="contained" 
          size="large"
          disabled={!isBookingEnabled()}
          onClick={handleBookDriver}
          className="py-3 px-8 text-lg font-medium rounded-full bg-blue-700 hover:bg-blue-800"
          startIcon={<DirectionsCarIcon />}
        >
          Book Your Driver Now
        </Button>
    </div>
  </div>
    
  );
}

export default BookDriver;