import { Card, CardContent, TextField, Typography, Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useState } from "react";
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
    const [error, setError] = useState("");
  
    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");
  
      try {
        const response = await axios.post("http://localhost:5000/api/users/register", formData);
        if (response.status === 201) {
          navigate('/otp-verification?role=user');
        }
        console.log(response);
        
      } catch (err: any) {
     
       
        toast.error(err.response?.data?.message || "Registration failed", {
          position: "top-center",
          autoClose: 2000,
        })
      } finally {
        setLoading(false);
      }
    };



  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-700 to-blue-300">
      <Card className="w-full max-w-md p-6 shadow-2xl bg-white/90 backdrop-blur-md">
        <CardContent>
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
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>

            {/* Google Sign Up */}
            <Button variant="outlined" fullWidth startIcon={<GoogleIcon />} className="mt-2">
              Sign Up with Google
            </Button>
          </form>
        </CardContent>
      </Card>
      <ToastContainer />
    </div>
  );
};

export default RegisterUser;
