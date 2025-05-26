import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import Rating from "@mui/material/Rating";
import { DriverAPI, UserAPI} from "../Api/AxiosInterceptor";
import EnhancedPagination from "./Adwancepagination"; // your custom pagination component
import moment from "moment";

interface ViewReviewsModalProps {
  open: boolean;
  onClose: () => void;
  driverId: string;
  role: "user" | "driver";
}

interface Review {
  _id: string;
  rating: number;
  review?: string;
  createdAt: string;
  user: {
    _id: string;
    name: string;
    profile: string;
  };
}

const ViewReviewsModal: React.FC<ViewReviewsModalProps> = ({ open, onClose, driverId,role }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async (pageNumber: number) => {
    try {
      setLoading(true);
      let res;
      if(role=='user'){
        res = await UserAPI.get(`/review/${driverId}?page=${pageNumber}&limit=3`);
      }else{    
      res = await DriverAPI.get(`/review/${driverId}?page=${pageNumber}&limit=3`);
      }
      console.log(res.data,'data got hre')  
    
      setReviews(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchReviews(page);
    }
  }, [open, page]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
  <DialogTitle
    sx={{
      fontWeight: "bold",
      fontSize: "1.5rem",
      borderBottom: "1px solid #e0e0e0",
      pb: 1,
    }}
  >
    Driver Reviews
  </DialogTitle>

  <DialogContent dividers sx={{ px: 3, py: 2 }}>
    {loading ? (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="150px">
        <CircularProgress />
      </Box>
    ) : reviews.length === 0 ? (
      <Typography align="center" color="text.secondary" py={4}>
        No reviews yet.
      </Typography>
    ) : (
      reviews.map((r) => (
        <Box
          key={r._id}
          display="flex"
          alignItems="flex-start"
          gap={2}
          mb={3}
          sx={{ borderBottom: "1px solid #f0f0f0", pb: 2 }}
        >
          <Avatar
            src={`${import.meta.env.VITE_IMAGEURL}/${r.user.profile}`}
            alt={r.user.name}
            sx={{ width: 48, height: 48 }}
          />
          <Box flex={1}>
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
              <Typography fontWeight="600" fontSize="1rem">
                {r.user.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {moment(r.createdAt).format("DD MMMM YYYY")}
              </Typography>
            </Box>

            <Rating value={r.rating} readOnly size="small" sx={{ mt: 0.5 }} />

            {r.review && (
              <Typography mt={1} fontSize="0.95rem" color="text.primary">
                {r.review}
              </Typography>
            )}
          </Box>
        </Box>
      ))
    )}
  </DialogContent>

  <DialogActions sx={{ justifyContent: "space-between", px: 3, py: 2, borderTop: "1px solid #e0e0e0" }}>
    {reviews.length > 3 ? (
      <EnhancedPagination
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        color="primary"
      />
    ) : (
      <Box />
    )}
    <Button onClick={onClose} variant="outlined" color="primary">
      Close
    </Button>
  </DialogActions>
</Dialog>

  );
};

export default ViewReviewsModal;
