import React, { useState, useEffect } from 'react';
import { toast, ToastContainer} from "react-toastify";
import ApiService from '../Api/ApiService';
import GoogleAuthButton from '../components/Googlesign'; 
import ForgotPasswordModal from '../components/FogetPassword'; 
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
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState<boolean>(false);
  
  // Theme and responsive breakpoints
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
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
  
  // Add these functions for modal control
  const handleOpenForgotPassword = (): void => {
    setForgotPasswordOpen(true);
  };

  const handleCloseForgotPassword = (): void => {
    setForgotPasswordOpen(false);
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
        localStorage.setItem(`${response.role}_accessToken`, response.accessToken);
        
        toast.success("Login successful!");
  
        // Redirect based on role
        if (response.role === "driver") {
          navigate("/driver", { replace: true });
        } else {
          navigate("/userhome",{ replace: true });
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
      <Container maxWidth="sm" sx={{ px: { xs: 1, sm: 2 } }}>
        <Card 
          elevation={10} 
          sx={{ 
            borderRadius: { xs: 2, sm: 3 }, 
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: { xs: 'none', sm: 'scale(1.01)' },
            }
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
            {/* Login Type Indicator */}
            <Box sx={{ 
              position: 'absolute', 
              top: { xs: 8, sm: 10 }, 
              right: { xs: 8, sm: 10 },
              bgcolor: loginType === 'driver' ? 'warning.dark' : 'primary.main',
              color: 'white',
              px: 1.5,
              py: 0.3,
              borderRadius: 5,
              fontSize: { xs: '0.6rem', sm: '0.7rem' },
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              {loginType} LOGIN
            </Box>
            
            {/* Logo and Title */}
            <Box sx={{ textAlign: 'center', mb: { xs: 1, sm: 1.5 }, mt: { xs: 0.5, sm: 0.5 } }}>
              {loginType === 'driver' ? 
                <DirectionsCar sx={{ fontSize: { xs: 32, sm: 40 }, color: 'warning.dark', mb: 0.5 }} /> : 
                <Person sx={{ fontSize: { xs: 32, sm: 40 }, color: 'primary.main', mb: 0.5 }} />
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
                variant="body2" 
                color="text.secondary" 
                sx={{ mt: 0.5 }}
              >
                {loginType === 'driver' 
                  ? 'Driver Portal Access' 
                  : 'Welcome back! Please login'}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <TextField
                label="Email Address"
                variant="outlined"
                fullWidth
                margin="dense"
                name="email"
                type="email"
                value={loginData.email}
                onChange={handleChange}
                required
                size="small"
                InputProps={{
                  startAdornment: <Email color="action" sx={{ mr: 1, fontSize: '1.1rem' }} />
                }}
              />
              
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                margin="dense"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={loginData.password}
                onChange={handleChange}
                required
                size="small"
                InputProps={{
                  startAdornment: <Lock color="action" sx={{ mr: 1, fontSize: '1.1rem' }} />,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{ mb: 1 }}
              />

              {/* Forgot Password Link - Updated to open modal */}
              <Box sx={{ textAlign: 'right', mb: 1 }}>
                <Link 
                  component="button"
                  type="button"
                  variant="body2"
                  onClick={handleOpenForgotPassword}
                  underline="hover" 
                  color={loginType === 'driver' ? 'warning.dark' : 'primary.main'}
                  sx={{ fontSize: '0.75rem' }}
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
                  py: { xs: 0.5, sm: 0.75 },
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  textTransform: 'none',
                  borderRadius: { xs: 1.5, sm: 2 },
                  boxShadow: 2,
                  position: 'relative'
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress 
                      size={16} 
                      sx={{ 
                        color: 'white',
                        position: 'absolute',
                        left: 'calc(50% - 8px)'
                      }} 
                    />
                    <span style={{ visibility: 'hidden' }}>Login</span>
                  </>
                ) : (
                  `Login as ${loginType === 'driver' ? 'Driver' : 'User'}`
                )}
              </Button>

              {/* Separator */}
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5, mb: 1 }}>
                <Divider sx={{ flexGrow: 1 }} />
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ px: 1, fontSize: '0.7rem' }}
                >
                  OR
                </Typography>
                <Divider sx={{ flexGrow: 1 }} />
              </Box>

              {/* Google Auth Button */}
              <GoogleAuthButton role={loginType} />

              {/* Switch Login Type */}
              <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Button
                  variant="text"
                  color={loginType === 'driver' ? 'warning' : 'primary'}
                  onClick={switchLoginType}
                  size="small"
                  sx={{ 
                    textTransform: 'none',
                    fontSize: '0.75rem',
                    py: 0,
                    minWidth: 0
                  }}
                >
                  Switch to {loginType === 'driver' ? 'User' : 'Driver'} Login
                </Button>
              </Box>
              
              <Box sx={{ textAlign: 'center', mt: 0.5 }}>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                >
                  Don't have an account?{' '}
                  <Link 
                    href={loginType === 'driver' ? '/' : '/'} 
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
      <ToastContainer />
      
      {/* Forgot Password Modal */}
      <ForgotPasswordModal 
        open={forgotPasswordOpen} 
        handleClose={handleCloseForgotPassword} 
        loginType={loginType}
        
      />
    </Box>
  );
};

export default DualLogin;