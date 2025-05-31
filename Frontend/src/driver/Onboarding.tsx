import  { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  Typography, 
  Paper, 
  CircularProgress, 
  Fade, 
  Chip,
  Container,
  useTheme
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import VerifiedIcon from "@mui/icons-material/Verified";
import PaidIcon from "@mui/icons-material/Paid";

const DriverOnboardingComplete = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [secondsLeft, setSecondsLeft] = useState(3);
  const [completedSteps, setCompletedSteps] = useState(0);
  
  // Handle redirect timer
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/driver");
    }, 3000);
    
    const countdownInterval = setInterval(() => {
      setSecondsLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    
    // For the progress steps animation
    const stepsInterval = setInterval(() => {
      setCompletedSteps(prev => (prev < 3 ? prev + 1 : prev));
    }, 600);
    
    return () => {
      clearTimeout(timer);
      clearInterval(countdownInterval);
      clearInterval(stepsInterval);
    };
  }, [navigate]);
  
  // Calculate progress percentage for circular progress
  const progress = ((3 - secondsLeft) / 3) * 100;
  
  const steps = [
    {
      title: "Payment Setup Complete",
      icon: <PaidIcon fontSize="small" sx={{ color: "#4caf50" }} />
    },
    {
      title: "Account Verified",
      icon: <VerifiedIcon fontSize="small" sx={{ color: "#2196f3" }} />
    },
    {
      title: "Ready to Drive",
      icon: <DirectionsCarIcon fontSize="small" sx={{ color: "#ff9800" }} />
    }
  ];

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 8
        }}
      >
        <Paper
          elevation={8}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            width: "100%",
            position: "relative"
          }}
        >
          {/* Success banner */}
          <Box
            sx={{
              p: 4,
              bgcolor: "success.main",
              color: "white",
              textAlign: "center",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <Fade in={true} timeout={1000}>
              <Box>
                <CheckCircleOutlineIcon sx={{ fontSize: 80, mb: 2 }} />
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  Onboarding Successful!
                </Typography>
                <Typography variant="body1">
                  Your payment setup has been completed successfully
                </Typography>
              </Box>
            </Fade>
            
            {/* Animated background circles */}
            <Box sx={{
              position: "absolute",
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.1)",
              zIndex: 0
            }} />
            <Box sx={{
              position: "absolute",
              bottom: -20,
              left: -20,
              width: 100,
              height: 100,
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.1)",
              zIndex: 0
            }} />
          </Box>
          
          {/* Content */}
          <Box sx={{ p: 4 }}>
            {/* Progress steps */}
            <Box sx={{ mb: 4 }}>
              {steps.map((step, index) => (
                <Fade
                  key={index}
                  in={completedSteps >= index+1}
                  timeout={{ enter: 500, exit: 0 }}
                  style={{ transitionDelay: completedSteps >= index+1 ? `${index * 200}ms` : "0ms" }}
                >
                  <Box 
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: completedSteps >= index+1 ? "rgba(76, 175, 80, 0.1)" : "transparent",
                      transition: "all 0.3s ease"
                    }}
                  >
                    {step.icon}
                    <Typography 
                      variant="body1" 
                      sx={{ ml: 2, fontWeight: completedSteps >= index+1 ? "medium" : "normal" }}
                    >
                      {step.title}
                    </Typography>
                    {completedSteps >= index+1 && (
                      <CheckCircleOutlineIcon 
                        fontSize="small" 
                        color="success" 
                        sx={{ ml: "auto" }} 
                      />
                    )}
                  </Box>
                </Fade>
              ))}
            </Box>
            
            {/* Redirect notice */}
            <Box 
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                flexDirection: "column",
                mt: 4
              }}
            >
              <Typography variant="body2" color="textSecondary" gutterBottom align="center">
                You'll be redirected to the dashboard in
              </Typography>
              
              <Box sx={{ position: "relative", display: "inline-flex", mb: 2 }}>
                <CircularProgress 
                  variant="determinate" 
                  value={progress} 
                  size={60}
                  thickness={5}
                  sx={{ color: theme.palette.success.main }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    {secondsLeft}
                  </Typography>
                </Box>
              </Box>
              
              <Chip 
                label="Your account is ready to accept payments"
                color="success"
                variant="outlined"
                icon={<VerifiedIcon />}
                sx={{ mt: 2 }}
              />
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default DriverOnboardingComplete;