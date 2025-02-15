import { useState, useEffect } from "react";
import { TextField, Button, Typography, Card } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OTPVerification = () => {
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const role = params.get("role");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30); // 30-second countdown
  const [showResend, setShowResend] = useState(false);
  const [error, setError] = useState("");

  // Countdown timer effect
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setShowResend(true); // Show resend button when timer hits 0
    }
  }, [timer]);

  // Handle OTP input change
  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // Allow only numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus to next field
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  // Handle OTP submission
  const handleSubmit = async () => {
    const otpValue = otp.join("");

    try {
      const response = await axios.post("http://localhost:5000/api/users/verify-otp", {
        otp: otpValue,
        role,
      });

      if (response.data.success) {
        // Store tokens & navigate to home
        navigate("/");
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  // Handle Resend OTP
  const handleResend = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/resend-otp", { role });

      // Reset states
      setOtp(["", "", "", "", "", ""]);
      setTimer(30);
      setShowResend(false);
      setError("");
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 relative">
      {/* Background Shadow Text */}
      <h1 className="absolute text-[6rem] md:text-[8rem] font-extrabold text-white opacity-10 select-none top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
        SARATHI
      </h1>

      {/* OTP Card */}
      <Card className="p-6 shadow-2xl w-96 bg-white/90 backdrop-blur-md relative z-10">
        <Typography variant="h5" className="text-center text-blue-700 font-bold mb-4">
          {role === "driver" ? "Driver OTP Verification" : "User OTP Verification"}
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

        {/* Show error message if OTP is incorrect */}
        {error && <Typography className="text-red-500 text-sm text-center mb-2">{error}</Typography>}

        <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
          Verify OTP
        </Button>

        {/* Timer or Resend OTP button */}
        <div className="text-center mt-4">
          {showResend ? (
            <Button variant="text" color="primary" onClick={handleResend}>
              Resend OTP
            </Button>
          ) : (
            <Typography variant="body2" className="text-gray-600">
              Resend OTP in <span className="text-blue-600 font-semibold">{timer}s</span>
            </Typography>
          )}
        </div>
      </Card>
    </div>
  );
};

export default OTPVerification;
