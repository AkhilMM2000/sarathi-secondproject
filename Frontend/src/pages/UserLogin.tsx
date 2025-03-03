import React, { useState, useEffect } from 'react';
import { toast, ToastContainer} from "react-toastify";
import ApiService from '../services/Api'
import { 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Container,
  Link,
  IconButton,
  InputAdornment,
  Divider,
  CircularProgress,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff, DirectionsCar, Person } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';


// Define TypeScript interfaces
interface LoginData {
  email: string;
  password: string;
}

const DualLogin= () => {
  // Get query parameters from URL
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const loginType = queryParams.get('type') === 'driver' ? 'driver' : 'user';
 
  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: ''
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  // Theme and responsive breakpoints
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  // Update page title based on login type
  useEffect(() => {
    document.title = `${loginType === 'driver' ? 'Driver' : 'User'} Login | SARATHI`;
  }, [loginType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setLoginData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>)=> {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      toast.info("Please fill in the credentials");
      return;
    }
  
    setLoading(true);
  
    try {
      const role = loginType === "driver" ? "drivers" : "users";
     
 
      // Call API Service for login
      const response = await ApiService.Login(loginData, role);
  
      if (response?.accessToken) {
        // Store tokens and role
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("role", response.role);
  
        toast.success("Login successful!");
  
        // Redirect based on role
        if (response.role === "driver") {
          navigate("/driver/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      } 
    } catch (error: any) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.error || "Login failed!");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const switchLoginType = (): void => {
    const newType = loginType === 'driver' ? 'user' : 'driver';
    navigate(`?type=${newType}`);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: loginType === 'driver' 
          ? 'linear-gradient(135deg, #ff9800 0%, #ffcc80 100%)' 
          : 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
        padding: { xs: '10px', sm: '20px' },
        transition: 'background 0.3s ease'
      }}
    >
      <Container maxWidth="sm" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
        <Card 
          elevation={10} 
          sx={{ 
            borderRadius: { xs: 2, sm: 3 }, 
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            transform: 'scale(1)',
            '&:hover': {
              transform: { xs: 'none', sm: 'scale(1.01)' },
            }
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            {/* Login Type Indicator */}
            <Box sx={{ 
              position: 'absolute', 
              top: { xs: 10, sm: 15 }, 
              right: { xs: 10, sm: 15 },
              bgcolor: loginType === 'driver' ? 'warning.dark' : 'primary.main',
              color: 'white',
              px: 2,
              py: 0.5,
              borderRadius: 5,
              fontSize: { xs: '0.65rem', sm: '0.75rem' },
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              {loginType} LOGIN
            </Box>
            
            {/* Logo and Title */}
            <Box sx={{ textAlign: 'center', mb: { xs: 2, sm: 3, md: 4 }, mt: { xs: 1, sm: 1 } }}>
              {loginType === 'driver' ? 
                <DirectionsCar sx={{ fontSize: { xs: 40, sm: 50 }, color: 'warning.dark', mb: 1 }} /> : 
                <Person sx={{ fontSize: { xs: 40, sm: 50 }, color: 'primary.main', mb: 1 }} />
              }
              
              <Typography 
                variant={isMobile ? "h5" : "h4"} 
                component="h1" 
                fontWeight="bold" 
                color={loginType === 'driver' ? 'warning.dark' : 'primary.main'}
              >
                SARATHI
              </Typography>
              
              <Typography 
                variant={isMobile ? "body2" : "subtitle1"} 
                color="text.secondary" 
                sx={{ mt: 1 }}
              >
                {loginType === 'driver' 
                  ? 'Driver Portal Access' 
                  : 'Welcome back! Please login to your account'}
              </Typography>
            </Box>

            <Divider sx={{ my: { xs: 1, sm: 2 } }} />

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <TextField
                label="Email Address"
                variant="outlined"
                fullWidth
                margin="normal"
                name="email"
                type="email"
                value={loginData.email}
                onChange={handleChange}
                required
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  startAdornment: <Email color="action" sx={{ mr: 1 }} />
                }}
              />
              
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                margin="normal"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={loginData.password}
                onChange={handleChange}
                required
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  startAdornment: <Lock color="action" sx={{ mr: 1 }} />,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
                        size={isMobile ? "small" : "medium"}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{ mb: 2 }}
              />

              {/* Forgot Password Link */}
              <Box sx={{ textAlign: 'right', mb: { xs: 2, sm: 3 } }}>
                <Link 
                  href="#" 
                  underline="hover" 
                  color={loginType === 'driver' ? 'warning.dark' : 'primary.main'}
                  sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                >
                  Forgot Password?
                </Link>
              </Box>

              {/* Login Button */}
              <Button
                variant="contained"
                color={loginType === 'driver' ? 'warning' : 'primary'}
                fullWidth
                type="submit"
                disabled={loading}
                sx={{ 
                  py: { xs: 1, sm: 1.5 },
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  textTransform: 'none',
                  borderRadius: { xs: 1.5, sm: 2 },
                  boxShadow: 3,
                  position: 'relative'
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress 
                      size={isMobile ? 20 : 24} 
                      sx={{ 
                        color: 'white',
                        position: 'absolute',
                        left: 'calc(50% - 12px)'
                      }} 
                    />
                    <span style={{ visibility: 'hidden' }}>Login</span>
                  </>
                ) : (
                  `Login as ${loginType === 'driver' ? 'Driver' : 'User'}`
                )}
              </Button>

              {/* Switch Login Type */}
              <Box sx={{ textAlign: 'center', mt: { xs: 2, sm: 3 } }}>
                <Button
                  variant="text"
                  color={loginType === 'driver' ? 'warning' : 'primary'}
                  onClick={switchLoginType}
                  size={isMobile ? "small" : "medium"}
                  sx={{ 
                    textTransform: 'none',
                    fontSize: { xs: '0.8rem', sm: '0.875rem' }
                  }}
                >
                  Switch to {loginType === 'driver' ? 'User' : 'Driver'} Login
                </Button>
              </Box>
              
              <Box sx={{ textAlign: 'center', mt: 1 }}>
  <Typography 
    variant={isMobile ? "caption" : "body2"} 
    color="text.secondary"
  >
    Don't have an account?{' '}
    <Link 
      href={loginType === 'driver' ? '/driver/register' : '/user/register'} 
      underline="hover" 
      color={loginType === 'driver' ? 'warning.dark' : 'primary.main'} 
      fontWeight="medium"
    >
      Register
    </Link>
  </Typography>
</Box>
            </form>
          </CardContent>
        </Card>
      </Container>
      <ToastContainer/>
    </Box>
  );
};

export default DualLogin;