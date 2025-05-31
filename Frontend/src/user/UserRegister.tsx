import { Card, CardContent, TextField, Typography, Button } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ApiService from '../Api/ApiService'
import { useState } from "react";
import GoogleAuthButton from "../components/Googlesign";
const RegisterUser = () => {
    const navigate=useNavigate()
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      mobile: "",
      password: "",
      referralCode: "",
    });
    const [loading, setLoading] = useState(false);
    const validateForm = () => {
      const nameRegex = /^[A-Za-z\s]{3,}$/;
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const mobileRegex = /^[6-9]\d{9}$/; // Ensures starts with 6-9 and 10 digits
     
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      
    
      if (!nameRegex.test(formData.name)) {
        toast.error("Invalid name! Must be at least 3 letters.", { position: "top-center" });
        return false;
      }
      if (!emailRegex.test(formData.email)) {
        toast.error("Invalid email format!", { position: "top-center" });
        return false;
      }
      if (!mobileRegex.test(formData.mobile)) {
        toast.error("Invalid mobile number! Must be 10 digits.", { position: "top-center" });
        return false;
      }
      if (!passwordRegex.test(formData.password)) {
        toast.error(
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
          { position: "top-center" }
        );
        return false;
      }
      
      
    
      return true;
    };
 
  
    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
   
    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) return;
      setLoading(true);
      try {
     
      await ApiService.registerUser(formData, "users");
        
        localStorage.setItem("email", formData.email);
        navigate("/otp-verification?role=users");
      } catch (error: any) {
         console.log(error)
toast.dismiss()
        toast.error(`${error} please change it`  ,{ position: "top-center", autoClose: 2000 });
        
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-gradient-to-r from-blue-700 to-blue-300 p-4">
    <Card className="w-full max-w-md shadow-2xl bg-white/90 backdrop-blur-md">
      <CardContent className="p-6 md:p-8">
        <Typography variant="h5" className="text-center text-blue-700 font-bold mb-4">
          User Registration
        </Typography>
  
        {/* Input Fields */}
        <form className="space-y-3" onSubmit={handleSubmit}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            size="small"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            size="small"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            label="Phone Number"
            variant="outlined"
            fullWidth
            size="small"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            size="small"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <TextField
            label="Referral Code (Optional)"
            variant="outlined"
            fullWidth
            size="small"
            name="referralCode"
            value={formData.referralCode}
            onChange={handleChange}
          />
  
          {/* Sign Up Button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            disabled={loading}
            className="py-2 mt-2"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </Button>
  
          {/* Google Sign Up */}
        
       <GoogleAuthButton role="user"/>
          
          
          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          
          {/* Login Button */}
          <Button 
            variant="text" 
            color="primary" 
            fullWidth
            className="py-2"
            onClick={() => navigate('/login')}
          >
            Already have an account? Login
          </Button>
        </form>
      </CardContent>
    </Card>
    <ToastContainer />
  </div>
  );
};

export default RegisterUser;
