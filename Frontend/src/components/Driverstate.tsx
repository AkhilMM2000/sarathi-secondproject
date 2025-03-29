import React from 'react';
import { Alert, Typography } from '@mui/material';

const DriverStateNotification = ({ driverState:'',reason:string }) => {
  // Check if driver state is 'rejected'
  if (driverState === 'rejected') {
    return (
      <Alert 
        severity="error" 
        sx={{ 
          mb: 2, 
          width: '100%', 
          display: 'flex', 
          alignItems: 'center' 
        }}
      >
        <Typography variant="body1">
          {reason || 'Your application has been rejected'}
        </Typography>
      </Alert>
    );
  }

  // Return null if not in rejected state
  return null;
};

export default DriverStateNotification;