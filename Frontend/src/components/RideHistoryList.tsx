// components/RideHistory/RideList.tsx
import React from 'react';
import {  Typography, Box } from '@mui/material';
import { RideCard } from './RideHistoryCard';
import { RideHistory } from '../constant/types';
import EnhancedPagination from './Adwancepagination';
interface RideListProps {
  rides: RideHistory[];
  role: 'user' | 'driver';
  page: number;
  totalPages: number;
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

export const RideList: React.FC<RideListProps> = ({
  rides,
  role,
  page,
  totalPages,
  onPageChange,
}) => {
  return (
    <Box>
      {rides.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No rides found.
        </Typography>
      ) : (
        rides.map((ride, index) => <RideCard key={index} ride={ride} role={role} />)
      )}

      {totalPages > 1 && (
        <Box mt={2} display="flex" justifyContent="center">
          
          <EnhancedPagination 
          
        count={totalPages} 
         page={page}  
        onChange={onPageChange} 
        color="standard" 
      />
        </Box>
      )}
    </Box>
  );
};
