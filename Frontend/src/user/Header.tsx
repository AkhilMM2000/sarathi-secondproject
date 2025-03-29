import { AppBar, Toolbar, Typography, Box, Container, Button } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleNavigation = (type: string) => {
    navigate(`/login?type=${type}`);
  };

  return (
    <AppBar 
      position="fixed" 
      color="primary" 
      elevation={4}
      sx={{ 
        padding: "12px 0",
        background: "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          
          {/* Left Side: Brand + Driver Login */}
          <Box sx={{ 
            display: "flex", 
            alignItems: "center",
            gap: 2,
            "@media (max-width: 768px)": {
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 1
            }
          }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <DirectionsCarIcon 
                fontSize="large" 
                sx={{ marginRight: 1, color: "#fff" }} 
              />
              <Typography 
                variant="h5" 
                fontWeight="bold"
                sx={{ 
                  letterSpacing: "1px",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.2)"
                }}
              >
                Sarathi
              </Typography>
            </Box>
            
            <Button 
              variant="contained" 
              color="secondary"
              startIcon={<DirectionsCarIcon />}
              onClick={() => handleNavigation("driver")}
              sx={{ 
                fontWeight: "bold",
                boxShadow: "0px 3px 5px rgba(0,0,0,0.2)",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0px 4px 6px rgba(0,0,0,0.3)",
                }
              }}
            >
              Driver Login
            </Button>
          </Box>

          {/* Center description - Hidden on very small screens */}
          <Box sx={{ 
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            width: "40%",
            display: { xs: "none", md: "block" }
          }}>
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 300,
                lineHeight: 1.5
              }}
            >
              This platform allows users to connect with drivers, and drivers can get rides.
            </Typography>
          </Box>

          {/* Right Side: User Login */}
          <Box>
            <Button 
              variant="contained" 
              color="secondary"
              startIcon={<PersonIcon />}
              onClick={() => handleNavigation("user")}
              sx={{ 
                fontWeight: "bold",
                boxShadow: "0px 3px 5px rgba(0,0,0,0.2)",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0px 4px 6px rgba(0,0,0,0.3)",
                }
              }}
            >
              User Login
            </Button>
          </Box>
        </Toolbar>
        
        {/* Description for mobile - Only visible on small screens */}
        <Box sx={{ 
          display: { xs: "block", md: "none" },
          textAlign: "center",
          mt: 1,
          mb: 1,
          px: 2
        }}>
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 300,
              lineHeight: 1.4
            }}
          >
            This platform allows users to connect with drivers, and drivers can get rides.
          </Typography>
        </Box>
      </Container>
    </AppBar>
  );
};

export default Header;