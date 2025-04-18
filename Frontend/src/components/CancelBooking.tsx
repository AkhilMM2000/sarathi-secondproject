import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Typography,
  Alert,
} from "@mui/material";
import { EventBusy } from "@mui/icons-material";
const CancelBookingModal: React.FC<{
    open: boolean;
    onClose: () => void;
    onCancel: (rideId: string, reason: string) => void;
    rideId: string | null;
  }> = ({ open, onClose, onCancel, rideId }) => {
    const [reason, setReason] = useState("");
  
    const handleSubmit = () => {
      if (rideId && reason.trim()) {
        onCancel(rideId, reason);
        setReason(""); // reset reason for next time
      }
    };
  
    return (
        <Dialog 
        open={open} 
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          background: 'linear-gradient(to right, #ff6b6b, #ff8e8e)',
          color: 'white',
          py: 2
        }}>
          <EventBusy fontSize="small" />
          Cancel Booking
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2" fontWeight="medium">
              Please note: Cancellation is only available until 24 hours before the scheduled ride time.
            </Typography>
          </Alert>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle1" gutterBottom sx={{ mb: 1 }}>
            Please tell us why you're cancelling:
          </Typography>
          
          <TextField
            autoFocus
            margin="dense"
            label="Reason for cancellation"
            placeholder="Please provide details about why you need to cancel..."
            type="text"
            fullWidth
            multiline
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5
              }
            }}
          />
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2, bgcolor: '#f9f9f9' }}>
          <Button 
            onClick={onClose} 
            color="inherit"
            variant="outlined"
            sx={{ borderRadius: 4, px: 3 }}
          >
            Go Back
          </Button>
          <Button
            onClick={handleSubmit}
            color="error"
            variant="contained"
            disabled={!reason.trim()}
            sx={{ 
              borderRadius: 4, 
              px: 3,
              boxShadow: 2,
              '&:hover': {
                boxShadow: 4
              }
            }}
          >
            Confirm Cancellation
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
export default CancelBookingModal