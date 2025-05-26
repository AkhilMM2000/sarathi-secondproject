import { useState, useEffect } from "react";
import { TextField, Button, Typography, Card } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ApiService from '../Api/ApiService'
import { toast, ToastContainer } from "react-toastify";
const OTPVerification = () => {
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const role = (params.get("role") as "users" | "drivers") || "users"; // Default to "users"


  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30); 
  const [showResend, setShowResend] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  useEffect(() => {
    let storedEmail = localStorage.getItem("Driveremail");

    // If 'Driveremail' doesn't exist, check for 'email' (normal user case)
    if (!storedEmail) {
      storedEmail = localStorage.getItem("email");
    }
  
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
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

  // Handle OTP input change
  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // Allow only numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);


    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  // Handle OTP submission
  const handleSubmit = async () => {
    const otpValue = otp.join("");
  
    try {
      const response = await ApiService.verifyOtp(otpValue, email, role);
  console.log(response.user.role);
 
  
      if (response.success) {
        if (response.success) {
          if (response.user.role === "driver") {
            localStorage.removeItem("Driveremail");
            toast.info("Please wait for admin verification.", {
              position: "top-center",
              autoClose: 2000,
            });
            navigate("/login?type=driver");
        } else {
          localStorage.removeItem("email");
  localStorage.setItem(`user_accessToken`,response.accessToken)
          toast.success("Your registration was successful!", {
            position: "top-center",
            autoClose: 2000,
          });
          navigate("/userhome");
        }
      } else {
        setError("Invalid OTP. Please try again.");
      }
    }
  } catch (error: any) {
    let errorMessage = "An unexpected error occurred.";
      console.log(error)
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.error || "Server error occurred.";
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    toast.error(errorMessage, { position: "top-center", autoClose: 2000 });
  }
}
  

  // Handle Resend OTP
  const handleResend = async () => {
  
    try {
      await axios.post("http://localhost:3000/api/users/resend-otp", { role:"user" ,email});

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
          {role === "drivers" ? "Driver OTP Verification" : "User OTP Verification"}
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
              Resend OTPs
            </Button>
          ) : (
            <Typography variant="body2" className="text-gray-600">
              Resend OTP in <span className="text-blue-600 font-semibold">{timer}s</span>
            </Typography>
          )}
        </div>
      </Card>
      <ToastContainer />
    </div>
  );
};

export default OTPVerification;
