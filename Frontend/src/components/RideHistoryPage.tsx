// pages/RideHistoryPage.tsx
import React, { useEffect, useState } from 'react';

import { RideList } from './RideHistoryList';
import { CircularProgress, Box, Typography } from '@mui/material';
import { DriverAPI, UserAPI } from '../Api/AxiosInterceptor';

interface Ride {
  fromLocation: string;
  toLocation: string;
  startDate: string;
  estimatedKm: number;
  estimatedFare: number;
  status: 'CANCELLED' | 'REJECTED';
  paymentStatus: 'COMPLETED';
  bookingType: 'RANGE_OF_DATES' | 'ONE_RIDE';
  paymentMode: 'stripe';
  createdAt: string;
  updatedAt: string;
  finalFare: number;
  paymentIntentId: string;
  driver_fee: number;
  platform_fee: number;
  email: string;
  place: string;
  name: string;
  profile: string;
}

export const RideHistoryPage: React.FC<{ role: 'user' | 'driver'; userId: string }> = ({
  role,
  userId,
}) => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchRideHistory = async (page: number) => {
    try {
      setLoading(true);
      let res;
     if(role=='user'){
res = await UserAPI.get(`/ridehistory?id=${userId}&page=${page}&limit=2`,{
        params: { page, limit: 2 },
      });
     }else{
       res = await DriverAPI.get(`/ridehistory?id=${userId}&page=${page}&limit=2`,{
        params: { page, limit: 2 },
      }); 
     }
      
      console.log(res.data,'data got hre')
      setRides(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Error fetching ride history:', error);
    } finally {
      setLoading(false);
    }
  };
console.log(rides,'ride history') 
  useEffect(() => {
    fetchRideHistory(page);
  }, [page]);
  
 const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  return (
    <Box p={2}>
      <Typography variant="h5" mb={2}>
        Ride History
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <RideList
          rides={rides}
          role={role}
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </Box>
  );
};
