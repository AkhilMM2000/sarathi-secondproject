import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Rating,
  TextField,

  CircularProgress,
  useMediaQuery,
  useTheme,
  Divider,
  Stack,
  Box,
  Typography,
} from "@mui/material";

import { UserAPI } from "../Api/AxiosInterceptor";

interface RateDriverModalProps {
  open: boolean;
  onClose: () => void;
  driverId: string;
  rideId: string;
  onReviewSubmitted?: () => void;
 showSnackbar: (message: string, type?: "success" | "error") => void; 
}

const RateDriverModal: React.FC<RateDriverModalProps> = ({
  open,
  onClose,
  driverId,
  rideId,
  onReviewSubmitted,
  showSnackbar
}) => {
  const [rating, setRating] = useState<number | null>(null);
  const [review, setReview] = useState<string>("");
  const [loading, setLoading] = useState(false);
    const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const handleSubmit = async () => {
    if (!rating) return;

    setLoading(true);


    try {
       
     
  await UserAPI.post(`/review`, {
        driverId,
        rideId,
        rating,
        review,
      });
     
        showSnackbar("Review submitted successfully!", "success");
      onReviewSubmitted?.();
      setTimeout(() => {
        onClose();
        setRating(null);
       setReview("");

       
      }, 1000);
    } catch (err: any) {
      const message = err?.response?.data?.error || "Failed to submit review";
      showSnackbar(message, "error");
    } finally {
      setLoading(false);
      setReview("");
       onClose()
       
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm"
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
          m: isMobile ? 0 : 2,
          height: isMobile ? '100%' : 'auto',
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          textAlign: 'center',
          py: { xs: 2, sm: 3 },
          fontSize: { xs: '1.2rem', sm: '1.5rem' }
        }}
      >
        Rate Your Driver
      </DialogTitle>
      
      <Divider />

      <DialogContent sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 3, sm: 4 } }}>
        <Stack spacing={3} alignItems="center">
          <Box textAlign="center">
            <Typography 
              variant="subtitle1" 
              gutterBottom
              sx={{ mb: 1, fontWeight: 500 }}
            >
              How was your ride?
            </Typography>
            <Rating
              value={rating}
              onChange={(_, newValue) => setRating(newValue)}
              size={isMobile ? "medium" : "large"}
              sx={{
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                '& .MuiRating-iconFilled': {
                  color: theme.palette.primary.main,
                }
              }}
            />
          </Box>

          <TextField
            label="Write a review (optional)"
            multiline
            rows={isMobile ? 2 : isTablet ? 3 : 4}
            fullWidth
            margin="normal"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            variant="outlined"
            sx={{
              mt: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
        </Stack>
      </DialogContent>

      <Divider />
      
      <DialogActions sx={{ 
        px: { xs: 2, sm: 3 }, 
        py: { xs: 2, sm: 2.5 },
        flexDirection: isMobile ? 'column' : 'row',
        '& > button': {
          m: isMobile ? 0.5 : 1,
          width: isMobile ? '100%' : 'auto'
        }
      }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
          variant="outlined"
          fullWidth={isMobile}
          sx={{ order: isMobile ? 2 : 1 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!rating || loading}
          size={isMobile ? "large" : "medium"}
          fullWidth={isMobile}
          sx={{ 
            order: isMobile ? 1 : 2,
            py: isMobile ? 1.5 : 1
          }}
        >
          {loading ? <CircularProgress size={24} /> : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RateDriverModal;
