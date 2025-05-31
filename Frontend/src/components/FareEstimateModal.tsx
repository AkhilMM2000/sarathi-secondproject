import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, CircularProgress, Button, Divider, Paper, useTheme } from '@mui/material';

import { Check, DirectionsCar } from '@mui/icons-material';
import { UserAPI } from '../Api/AxiosInterceptor';



type BookingType = 'ONE_RIDE' | 'RANGE_OF_DATES';

interface FareEstimateProps {
  open: boolean;
  SingleRide:boolean
  onClose: () => void;
  bookingType: BookingType;
  estimatedKm?: number|null
  startDate: Date;
  endDate?: Date
}

const FareEstimateModal: React.FC<FareEstimateProps> = ({
  open,
  SingleRide,
  onClose,
  bookingType,
  estimatedKm,
  startDate,
  endDate,
}) => {
  const [fare, setFare] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
console.log('estimatedKm', estimatedKm)
  useEffect(() => {
    if (open) {
      fetchFare();
    }
  }, [open]);

  const fetchFare = async () => {
    setLoading(true);
    try {
      const response = await UserAPI.post('/estimate-fare',{
        bookingType,
        estimatedKm,
        startDate,
        endDate,
      });
      setFare(response.data.estimatedFare);
    } catch (error: any) {
      console.error(error);
      setError(error.response?.data?.message || 'Failed to fetch fare estimate'); 
      setFare(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
    open={open} 
    onClose={onClose}
    aria-labelledby="fare-calculator-modal"
    aria-describedby="modal-to-display-ride-fare"
  >
    <Paper
      elevation={6}
      sx={{ 
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        borderRadius: 3,
        boxShadow: 24,
        p: 4,
        minWidth: { xs: 280, sm: 400 },
        maxWidth: '90%',
        outline: 'none',
        overflow: 'hidden'
      }}
    >
      {loading ? (
        <Box display="flex" flexDirection="column" alignItems="center" py={3}>
          <CircularProgress size={60} thickness={4} />
          <Typography mt={3} variant="h6" color="text.secondary">
            Calculating fare...
          </Typography>
        </Box>
      ) : fare !== null ? (
        <>
          <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
            <DirectionsCar color="primary" sx={{ fontSize: 32, mr: 1 }} />
            <Typography variant="h5" fontWeight="600">
              Fare Details
            </Typography>
          </Box>
          
          <Box 
            sx={{ 
              backgroundColor: theme.palette.primary.light, 
              borderRadius: 2,
              py: 3,
              px: 2,
              my: 3,
              textAlign: 'center'
            }}
          >
            <Typography variant="h3" color="primary.dark" fontWeight="bold">
              ₹{fare}
            </Typography>
            <Typography variant="subtitle1" color="primary.dark">
              Estimated Fare
            </Typography>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          {SingleRide ? (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" color="text.primary" gutterBottom>
                This is the minimum amount. After the ride is completed, the driver will update the extra kilometers traveled.
              </Typography>
              <Box sx={{ 
                backgroundColor: theme.palette.warning.light, 
                borderRadius: 2,
                p: 2,
                mt: 2
              }}>
                <Typography variant="body2" color="text.secondary">
                make sure extrakm driver added is exactly you travelled
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" color="text.primary" gutterBottom>
                This is the minimum fare based on estimated distance.
              </Typography>
              <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                mt: 2
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Check color="success" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    One-day bookings include up to <strong>300 km</strong>
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Check color="success" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Extra distance: <strong>₹10 per km</strong>
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
          
          <Button 
            variant="contained" 
            color="primary" 
            onClick={onClose}
            fullWidth
            sx={{ 
              py: 1.5, 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Close
          </Button>
        </>
      ) : (
        <Box textAlign="center" py={2}>
          <Typography color="error" variant="h6" gutterBottom>
          {error}
          </Typography>
          <Typography color="text.secondary" variant="body2" sx={{ mb: 3 }}>
          Failed to calculate fare
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={onClose}
            sx={{ 
              py: 1.5, 
              px: 4, 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Close
          </Button>
        </Box>
      )}
    </Paper>
  </Modal>

  );
};

export default FareEstimateModal;
