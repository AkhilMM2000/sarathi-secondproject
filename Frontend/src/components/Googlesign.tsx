import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast ,ToastContainer} from "react-toastify";


interface GoogleAuthButtonProps {
  role: "user" | "driver";
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ role}) => {
  const navigate=useNavigate()
  const handleSuccess = async (credentialRes: any) => {
    try {
      const credential = credentialRes?.credential;
console.log(role);

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/google/google-signin`,
        {
          googleToken: credential,
          role
        },
        {
          withCredentials: true, 
        }
      );
      console.log(res);
      
      if (res.status === 403) {
        toast.error(res.data.message); // Show toast message and stay on the same page
        return;
      }
      
      if (role === "user") {
        navigate("/userhome");
      } else if (role === "driver") {
        navigate("/driver");
      } else {
        navigate("/"); // Default fallback
      }
    
    } catch (error) {
      console.error("Google Auth Failed", error);
    }
  };

  const handleFailure = () => {
    console.error("Google Login Failed");
  };

  return (
    <>
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleFailure}
      theme="filled_blue"
      size="medium"
      text="signin_with"
      logo_alignment="center"
    
    />
    <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default GoogleAuthButton;
