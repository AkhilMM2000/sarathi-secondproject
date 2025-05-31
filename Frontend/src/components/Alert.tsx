import {  forwardRef, SyntheticEvent } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { Slide, SlideProps } from '@mui/material';
import { CheckCircle, XCircle, X } from 'lucide-react';

// Custom Alert component with enhanced styling
const Alert = forwardRef<HTMLDivElement, AlertProps>((props, ref) => {
  return (
    <MuiAlert
      elevation={6}
      ref={ref}
      variant="filled"
      {...props}
      sx={{
        borderRadius: '8px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        width: '100%',
        '& .MuiAlert-icon': {
          display: 'flex',
          alignItems: 'center',
          padding: '0 8px 0 0',
        },
        '& .MuiAlert-message': {
          fontWeight: 500,
          fontSize: '0.95rem',
          padding: '12px 0',
        },
        ...props.sx
      }}
    />
  );
});

// Slide transition from top
const SlideTransition = (props: SlideProps) => {
  return <Slide {...props} direction="down" />;
};

interface EnhancedAlertsProps {
  success: boolean;
  error: string;
  setSuccess: (value: boolean) => void;
  setError: (value: string) => void;
  successMessage?: string;
  autoHideDuration?: number;
}

const EnhancedAlerts = ({
  success,
  error,
  setSuccess,
  setError,
  successMessage = "Status updated successfully!",
  autoHideDuration = 4000
}: EnhancedAlertsProps) => {
  
  
  const handleSuccessClose = (_event?: SyntheticEvent | Event, reason?: string) => {
  if (reason === 'clickaway') return;
  setSuccess(false);
};
  
  const handleErrorClose = (_event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setError('');
  };
  
  return (
    <>
      {/* Success Alert */}
      <Snackbar
        open={success}
        autoHideDuration={autoHideDuration}
        onClose={handleSuccessClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={SlideTransition}
        sx={{ 
          top: '24px',
          width: { xs: '90%', sm: '400px' }
        }}
      >
        <Alert 
          onClose={handleSuccessClose} 
          severity="success"
          icon={<CheckCircle size={24} />}
          action={
            <button
              aria-label="close"
              className="p-1 rounded-full hover:bg-green-700 transition-colors"
              onClick={handleSuccessClose}
            >
              <X size={18} />
            </button>
          }
          sx={{
            bgcolor: 'rgb(34, 154, 22)',
            '& .MuiAlert-action': { 
              paddingTop: 0, 
              color: 'white',
              alignItems: 'center'
            }
          }}
        >
          <div className="flex items-center">
            {successMessage}
          </div>
        </Alert>
      </Snackbar>

      {/* Error Alert */}
      <Snackbar
        open={!!error}
        autoHideDuration={autoHideDuration}
        onClose={handleErrorClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={SlideTransition}
        sx={{ 
          top: '24px',
          width: { xs: '90%', sm: '400px' }
        }}
      >
        <Alert 
          onClose={handleErrorClose} 
          severity="error"
          icon={<XCircle size={24} />}
          action={
            <button
              aria-label="close"
              className="p-1 rounded-full hover:bg-red-700 transition-colors"
              onClick={handleErrorClose}
            >
              <X size={18} />
            </button>
          }
          sx={{
            bgcolor: 'rgb(211, 47, 47)',
            '& .MuiAlert-action': { 
              paddingTop: 0, 
              color: 'white',
              alignItems: 'center'
            }
          }}
        >
          <div className="flex items-center">
            {error}
          </div>
        </Alert>
      </Snackbar>
    </>
  );
};

export default EnhancedAlerts;