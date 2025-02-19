import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Container,
  Link
} from '@mui/material';
import { Email, Lock } from '@mui/icons-material';

const UserLogin = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = () => {
  
  };

  const handleSubmit = () => {
  
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
        padding: '20px'
      }}
    >
      <Container maxWidth="sm">
        <Card elevation={10} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <CardContent sx={{ p: 4 }}>
            {/* Logo and Title */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
                SARATHI
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
                Welcome back! Please login to your account
              </Typography>
            </Box>

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
                type="password"
                value={loginData.password}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: <Lock color="action" sx={{ mr: 1 }} />
                }}
                sx={{ mb: 2 }}
              />

              {/* Forgot Password Link */}
              <Box sx={{ textAlign: 'right', mb: 3 }}>
                <Link href="#" underline="hover" color="primary.main">
                  Forgot Password?
                </Link>
              </Box>

              {/* Login Button */}
              <Button
                variant="contained"
                color="primary"
                fullWidth
                type="submit"
                disabled={loading}
                sx={{ 
                  py: 1.5,
                  fontSize: '1rem',
                  textTransform: 'none',
                  borderRadius: 2,
                  boxShadow: 2
                }}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>

              {/* Register Link */}
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Link href="/register" underline="hover" color="primary.main" fontWeight="medium">
                    Register
                  </Link>
                </Typography>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default UserLogin