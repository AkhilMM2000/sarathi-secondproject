import { BrowserRouter } from "react-router-dom";

import AppRoutes from "./routes/index";
import AdminRoute from "./routes/AdminRoute";
import DriverRoute from "./routes/DriverRoute";
import { useSocketListener } from "./hooks/useSocketListener";
import { Alert, Snackbar } from "@mui/material";

function App() {
  const { message, open, setOpen } = useSocketListener();
console.log(message, open, "message from socket")
 return ( 
 
 <BrowserRouter basename="/">

  <AppRoutes />
 <AdminRoute/>
 <DriverRoute/>

 {/* Snackbar for notification */}
 <Snackbar
  open={open}
  autoHideDuration={6000}
  onClose={() => setOpen(false)}
  anchorOrigin={{ vertical: "top", horizontal: "center" }}
  sx={{
    width: '100%',
    maxWidth: '500px',
    top: '40px !important', // Add some spacing from the top
    left: '50% !important',
    transform: 'translateX(-50%) !important'
  }}
>
  <Alert 
    onClose={() => setOpen(false)} 
    severity="info" 
    variant="filled"
    sx={{ 
      width: '100%',
      fontSize: '1rem',
      padding: '16px 24px',
      borderRadius: '8px',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
      '& .MuiAlert-icon': {
        fontSize: '24px'
      },
      '& .MuiAlert-message': {
        fontWeight: 500
      }
    }}
  >
    {message}
  </Alert>
</Snackbar>
</BrowserRouter>
  )
}

export default App;
