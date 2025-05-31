// components/RideHistory/RideCard.tsx
import React from 'react';
import { Card, CardContent, Avatar, Typography, Grid, Stack, Chip, Box } from '@mui/material';

import LocationOnIcon from '@mui/icons-material/LocationOn';
import { RideHistory } from '../constant/types';
import moment from 'moment';

interface RideCardProps {
  ride: RideHistory
  role: 'user' | 'driver';
}

export const RideCard: React.FC<RideCardProps> = ({ ride, role }) => {
  const statusColor =
    ride.status === 'CANCELLED'
      ? 'error'
      : ride.status === 'REJECTED'
      ? 'warning'
      : 'success';

  const renderHeader = () => {
    return (
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Avatar   src={`${import.meta.env.VITE_IMAGEURL}/${ride.profile}`} alt={ride.name} sx={{ width: 56, height: 56 }} />
        
        </Grid>

        <Grid item xs>
          <Stack spacing={0.3}>
            <Typography variant="h6">
              {role === 'user' ? 'Driver: ' : 'User: '}
              {ride.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {ride.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {ride.place}
            </Typography>
          </Stack>
        </Grid>

        <Grid item>
          <Chip label={ride.status} color={statusColor as any} />
        </Grid>
      </Grid>
    );
  };

  return (
    <Card sx={{ mb: 2, p: 2 }}>
      {renderHeader()}

      <CardContent sx={{ px: 0 }}>
        <Box mt={2}>
          {ride.bookingType !== 'RANGE_OF_DATES' && (
  <>
    <Typography variant="subtitle2">
      From: <LocationOnIcon fontSize="small" /> {ride.fromLocation}
    </Typography>
    <Typography variant="subtitle2">
      To: <LocationOnIcon fontSize="small" /> {ride.toLocation}
    </Typography>
  </>
)}

<Typography variant="body2" mt={1}>
  Fare: ₹{ride.finalFare}
  {ride.bookingType !== 'RANGE_OF_DATES' && ` | Distance: ${ride.estimatedKm} km`}
</Typography>

<Typography variant="body2">
  Booking Type: {ride.bookingType} | Payment Mode: {ride.paymentMode}
</Typography>

          <Typography variant="caption" color="text.secondary">
        
              Created: {moment(ride.createdAt).format('DD MMMM YYYY')}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
