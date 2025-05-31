import React, { ChangeEvent, FormEvent, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import { Close, Email } from '@mui/icons-material';
import { toast } from 'react-toastify';

import axios, { AxiosError } from 'axios';
import { UserRole } from '../constant/types';

interface ErrorResponse {
  message: string;
}
interface ForgotPasswordModalProps {
  open: boolean;
  handleClose: () => void;
  loginType: UserRole;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ open, handleClose, loginType }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e:ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!email.trim()) {
      toast.info(`Please enter ${loginType} email address.`);
      return;
    }
  
    setLoading(true);
  
    try {
      
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/forgot-password`,
        { email,role:loginType } 
      );
  
      if (response.data.success) {
        toast.success(response.data.message);
        handleClose(); 
        setEmail(""); 
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

  // Check if the error has a response and message in response.data
  const errorMessage =
    axiosError?.response?.data?.message || axiosError.message || 'Something went wrong. Please try again.';

  toast.error(errorMessage); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      PaperProps={{
        sx: { 
          borderRadius: 2,
          width: '100%',
          maxWidth: '400px'
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" sx={{ color: loginType === 'driver' ? 'warning.dark' : 'primary.main' }}>
            Forgot Password
          </Typography>
          <IconButton size="small" onClick={handleClose} aria-label="close">
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 1, pb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter your email address below and we'll send you instructions to reset your password.
          </Typography>
          
          <TextField
            label="Email Address"
            variant="outlined"
            fullWidth
            size="small"
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
            InputProps={{
              startAdornment: <Email color="action" sx={{ mr: 1, fontSize: '1.1rem' }} />
            }}
          />
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleClose} 
            size="small"
            sx={{ 
              textTransform: 'none',
              color: 'text.secondary'
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color={loginType === 'driver' ? 'warning' : 'primary'}
            disabled={loading}
            sx={{ 
              textTransform: 'none',
              position: 'relative',
              minWidth: '100px'
            }}
          >
            {loading ? (
              <>
                <CircularProgress 
                  size={16} 
                  sx={{ 
                    color: 'white',
                    position: 'absolute',
                    left: 'calc(50% - 8px)'
                  }} 
                />
                <span style={{ visibility: 'hidden' }}>Submit</span>
              </>
            ) : (
              'Submit'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ForgotPasswordModal;