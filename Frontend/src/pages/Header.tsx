import { AppBar, Toolbar, Typography, Box, Container } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar"; // Car icon for branding


const Header = () => {
  return (
    <AppBar position="static" color="primary" sx={{ padding: "20px 0" }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          
          {/* Brand Section */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <DirectionsCarIcon fontSize="large" sx={{ marginRight: 1 }} />
            <Typography variant="h5" fontWeight="bold">
              Sarathi
            </Typography>
          </Box>

          {/* Description - Center Aligned */}
          <Box sx={{ flexGrow: 1, textAlign: "center" }}>
            <Typography variant="body1" sx={{ maxWidth: "600px", margin: "auto" }}>
              This platform allows users to connect with drivers, and drivers can get rides. 
              If you're registered with a company, choose your option below.
            </Typography>
          </Box>

        </Toolbar>
          {/* Brand Section */}
         
      </Container>
    </AppBar>
  );
};

export default Header;
