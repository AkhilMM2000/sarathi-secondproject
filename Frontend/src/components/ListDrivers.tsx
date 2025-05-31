import  { useState } from "react";
import { Grid, Card, CardContent, Typography, Avatar, TextField, Box, Button, Container, Rating, Divider } from "@mui/material";

import CustomPagination from "./pagination"; 
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { useNearbyDrivers } from "../hooks/useNearbyDrivers";
import { Link } from "react-router-dom";

const DriverList = () => {
  const [search, setSearch] = useState("");
 
 
  const [currentPage, setCurrentPage] = useState(1);
  const driversPerPage = 8

  const drivers = useNearbyDrivers();

  // 🔹 Search filtering (Ensures filtering only when drivers exist)
  const filteredDrivers = drivers.filter((driver) =>
    search === ""
      ? true
      : driver.name?.toLowerCase().includes(search.toLowerCase()) ||
        driver.place?.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredDrivers.length / driversPerPage);
  const indexOfLastDriver = currentPage * driversPerPage;
  const indexOfFirstDriver = indexOfLastDriver - driversPerPage;
  const currentDrivers = filteredDrivers.slice(indexOfFirstDriver, indexOfLastDriver);

  return (
    <Container maxWidth="lg"   sx={{ 
        py: 4,
        backgroundColor: '#e6f2ff', // Light sky blue background
        borderRadius: 2,
        minHeight: '100vh'
      }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" mb={3} color="primary">
        Available Drivers
      </Typography>
      
      <Box sx={{ 
        maxWidth: 600, 
        mx: "auto", 
        mb: 4,
        backgroundColor: 'white', 
        borderRadius: 2,
        boxShadow: 1,
        p: 0.5
      }}>
        <TextField
          fullWidth
          placeholder="Search by driver name or location"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            sx: { borderRadius: 2 }
          }}
        />
      </Box>
      
      <Grid container spacing={3}>
        {currentDrivers.length > 0 ? (
          currentDrivers.map((driver) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={driver._id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  borderRadius: 3,
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6
                  }
                }}
              >
                <Box 
                  sx={{
                    height: 80,
                    bgcolor: 'primary.light',
                    position: 'relative'
                  }}
                />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mt: -5
                  }}
                >
                  <Avatar
                    src={`${import.meta.env.VITE_IMAGEURL}/${driver.profileImage}`}
                    sx={{ 
                      width: 90, 
                      height: 90, 
                      border: '4px solid white',
                      boxShadow: 2
                    }}
                  />
                </Box>
                
                <CardContent sx={{ pt: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" fontWeight="bold" textAlign="center" gutterBottom>
                    {driver.name}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                    <Rating 
                      value={driver?.averageRating||0}
                      precision={0.1} 
                      readOnly 
                      size="small"
                    />
                    <Typography variant="body2" color="text.secondary" ml={0.5}>
                      5
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 1.5 }} />
                  
                  <Box sx={{ mt: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PhoneIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {driver.mobile}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOnIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {driver.place}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <DirectionsCarIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="primary" fontWeight="medium">
                        {driver.distance} km away
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ mt: 'auto', pt: 2 }}>
                  <Button
            component={Link} // Make Button behave like a Link
            to={`/bookslot/${driver._id}`}
            variant="contained"
            fullWidth
            sx={{
              borderRadius: 2,
              textTransform: "none",
              py: 1,
              fontWeight: "bold",
            }}
          >
            Book Now
          </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box 
              sx={{ 
                textAlign: "center", 
                py: 6, 
                px: 2,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 1
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No drivers found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try modifying your search criteria
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
      {totalPages > 1 && (
        <CustomPagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </Container>
  );
};

export default DriverList;
