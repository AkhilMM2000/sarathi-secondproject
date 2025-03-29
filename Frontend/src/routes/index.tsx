import {  Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "../user/Home";
import UserRegister from "../user/UserRegister";
import OTPVerification from "../user/OtpVerification";
import Navbar from "../user/Navbar";
import Footer from "../user/Footer";
import Body from "./Body";
import UserLogin from "../user/UserLogin";
import UserHome from "../user/UserHome";
import UserBody from "./UserBody";


import { Dashboard } from "@mui/icons-material";
import Dashboards from "../user/Dashboard";
import Vehicle from "../user/Vehicle";
import UserDashlayout from "../user/DashboardLayout";
import ResetPassword from "../components/ResetPassword";

const AppRoutes = () => {
  return (
    
    
      <Routes  >
        <Route path="/" element={<Body/>}>
        <Route path="/" element={<Home/>}/>
        </Route>
        <Route path="/user" element={<UserRegister/>}/>
        <Route path="/login" element={<UserLogin/>}/>
        <Route path="/reset-password" element={<ResetPassword/>}/>
        <Route path="/otp-verification" element={<OTPVerification/>}/>
        
        <Route path="/" element={<UserBody/>}>
        <Route path="/home" element={<UserHome/>}/>
        </Route>

      
        <Route path="/userhome" element={<UserDashlayout />}>
          {/* Nested Routes - Only Right Side Content Changes */}
          <Route index element={<Dashboards />} /> {/* Default page: /driver */}
          <Route path="dashboard" element={< Dashboards  />} />
          <Route path="vehicle" element={< Vehicle  />} />
        </Route>
      </Routes>
    
  );
};

export default AppRoutes;
