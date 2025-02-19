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
      </Routes>
    
    </BrowserRouter>
  );
};

export default AppRoutes;
