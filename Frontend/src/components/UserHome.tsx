
import { Box, Container, Grid, Typography, Paper, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate=useNavigate()
  return (
    <Box sx={{ mt: 1 }}> {/* Margin-top to avoid overlap with Navbar */}
      
    {/* Two Images Side by Side */}
    <Box
      sx={{
        height: "400px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden"
      }}
    >
      {/* Left Image */}
      <Box sx={{ flex: 1, height: "100%", overflow: "hidden" }}>
        <img 
          src="https://t4.ftcdn.net/jpg/02/79/99/21/360_F_279992144_3GWh4mLIPBacjzlYNc6kZbz2F3KpKOeE.jpg" 
          alt="Driver" 
          style={{ width: "100%", height: "100%", objectFit: "cover" }} 
        />
      </Box>
      
      {/* Right Image */}
      <Box sx={{ flex: 1, height: "100%", overflow: "hidden" }}>
        <img 
          src="https://media.istockphoto.com/id/1470035625/photo/driver-transporting-a-business-man-on-a-crowdsourced-taxi.jpg?s=612x612&w=0&k=20&c=HbVWN87JGim9g0CDhh2NHPM8oZ1g4qVGx86vxJ5RM24="
          style={{ width: "100%", height: "100%", objectFit: "cover" }} 
        />
      </Box>
    </Box>
  
    {/* Two Info Boxes */}
    <Container sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3} justifyContent="center">
        {[
          { title: "Safe & Secure Rides", desc: "Your safety is our priority with verified drivers." },
          { title: "Seamless Booking", desc: "Book a ride in just a few clicks." },
          { title: "Seamless Booking", desc: "Book a ride in just a few clicks." },
          { title: "Seamless Booking", desc: "Book a ride in just a few clicks." },
        ].map((item, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6" fontWeight="bold">
                {item.title}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
                {item.desc}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
  
      {/* Show Drivers Button */}
      <Box textAlign="center" sx={{ mt: 4 }}>
        <Button variant="contained" color="primary" size="large" onClick={()=>navigate('/drivers')}>
          Show Drivers
        </Button>
      </Box>
    </Container>
  </Box>
  );
};

export default Home;
