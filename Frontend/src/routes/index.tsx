import {  Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import UserRegister from "../pages/UserRegister";

import OTPVerification from "../pages/OtpVerification";
import Navbar from "../pages/Navbar";
import Footer from "../pages/Footer";
import Body from "./Body";
import UserLogin from "../pages/UserLogin";
import UserHome from "../pages/UserHome";
import UserBody from "./UserBody";
import DriverRegister from "../driver/driverRegister";
import DriverOTPVerification from "../driver/VerifyOTP";
import ProfileLocation from "../driver/Location";
import DocumentsVerify from "../driver/Documents";


const AppRoutes = () => {
  return (
    // <Router>
    //   <Routes>
    //     <Route path="/" element={<Home/>} />
    //     <Route path="/foot" element={<Footer/>} />
    //     <Route path="/nav" element={<Navbar/>} />
    //     <Route path="/user" element={<UserRegister/>}/>
    //     <Route path="/otp-verification" element={<OTPVerification/>}/>
    //   </Routes>
    // </Router>
    <BrowserRouter basename="/">
      <Routes  >
        <Route path="/" element={<Body/>}>
        <Route path="/" element={<Home/>}/>
        </Route>
        <Route path="/user" element={<UserRegister/>}/>
        <Route path="/login" element={<UserLogin/>}/>
        <Route path="/otp-verification" element={<OTPVerification/>}/>
        
        <Route path="/" element={<UserBody/>}>
        <Route path="/home" element={<UserHome/>}/>
        </Route>

        <Route path="/driver" element={<DriverRegister/>}/>
        <Route path="/driver-location" element={<ProfileLocation/>}/>
        <Route path="/driver-otpverification" element={<DriverOTPVerification/>}/>
       
        <Route path="/docs" element={<DocumentsVerify/>}/>
      </Routes>
    
    </BrowserRouter>
  );
};

export default AppRoutes;
