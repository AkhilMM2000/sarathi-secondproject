import { useState, useEffect } from "react";
import { TextField, Button, Typography, Card } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";

const DriverOTPVerification = () => {
  const navigate = useNavigate();
 
 

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [showResend, setShowResend] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    console.log("Stored Email:", email);
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      setError("No email found, please register again.");
      toast.error("No email found, please register again.");
    }
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setShowResend(true);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-900 to-gray-700 relative">
      {/* Background Shadow Text */}
      <h1 className="absolute text-[6rem] md:text-[8rem] font-extrabold text-gray-300 opacity-10 select-none top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
        DRIVER
      </h1>

      {/* OTP Card */}
      <Card className="p-6 shadow-2xl w-96 bg-gray-100/90 backdrop-blur-md border-l-4 border-yellow-500 relative z-10">
        <Typography variant="h5" className="text-center text-gray-900 font-bold mb-4">
          Driver OTP Verification
        </Typography>

        {/* OTP Input Boxes */}
        <div className="flex justify-center gap-2 mb-4">
          {otp.map((digit, index) => (
            <TextField
              key={index}
              id={`otp-${index}`}
              type="text"
              variant="outlined"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              inputProps={{ maxLength: 1, className: "text-center text-2xl w-12 h-12" }}
            />
          ))}
        </div>

        {error && <Typography className="text-red-500 text-sm text-center mb-2">{error}</Typography>}

        <Button variant="contained" sx={{ backgroundColor: "#ff9800", color: "white" }} fullWidth
        onClick={()=>navigate('/driver-location')}
        >
          Verify OTP
        </Button>

        {/* Timer or Resend OTP button */}
        <div className="text-center mt-4">
          {showResend ? (
            <Button variant="text" sx={{ color: "#ff9800" }}>
              Resend OTP
            </Button>
          ) : (
            <Typography variant="body2" className="text-gray-600">
              Resend OTP in <span className="text-yellow-500 font-semibold">{timer}s</span>
            </Typography>
          )}
        </div>
      </Card>
      <ToastContainer />
    </div>
  );
};

export default DriverOTPVerification;
