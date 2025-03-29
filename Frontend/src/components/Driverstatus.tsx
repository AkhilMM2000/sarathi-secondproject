import React from 'react';
import { Alert, AlertTitle, Box, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { DriverData } from '../constant/types';
interface RejectionNotificationProps {
    driverState: DriverData | null;
  }
const RejectionNotification: React.FC<RejectionNotificationProps> = ({ driverState}) => {
  if (driverState?.status !== "rejected") return null;

  return (
    <Box 
      sx={{ 
        width: '100%', 
        mb: 2,
        animation: 'pulse 1.5s infinite',
        '@keyframes pulse': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)' }
        }
      }}
    >
      <Alert 
        severity="error"
        icon={<ErrorOutlineIcon fontSize="large" />}
        sx={{
          backgroundColor: '#ffebee', // Light red background
          border: '2px solid #ff1744', // Darker red border
          borderRadius: 2,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        }}
      >
        <AlertTitle 
          sx={{ 
            fontWeight: 'bold', 
            fontSize: '1.1rem',
            color: '#d32f2f' // Deep red color for title
          }}
        >
          Profile Rejection Notice
        </AlertTitle>
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#333',
            fontWeight: 'medium'
          }}
        >
          Your profile has been rejected: {driverState?.reason}
        </Typography>
      </Alert>
    </Box>
  );
};

export default RejectionNotification;