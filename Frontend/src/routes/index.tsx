import {  Routes, Route } from "react-router-dom";
import Home from "../user/Home";
import UserRegister from "../user/UserRegister";
import OTPVerification from "../user/OtpVerification";

import Body from "./Body";
import UserLogin from "../user/UserLogin";
import UserHome from "../components/UserHome";
import UserBody from "./UserBody";



import Dashboards from "../user/Dashboard";
import Vehicle from "../user/Vehicle";
import UserDashlayout from "../user/DashboardLayout";
import ResetPassword from "../components/ResetPassword";

import DriverListedPage from "../user/DriverListedPage";
import BookDriver from "../user/BookDriver";
import BookRides from "../user/BookRides";
import UserWallet from "../user/userWallet";

import VideoCallPage from "../components/VideoCall";
import { RideHistoryPage } from "../components/RideHistoryPage";
import { useSelector } from "react-redux";
import { RootState } from "../store/ReduxStore";
import PdfFilePreview from "../components/previewpdf";
import NotFound from "../components/NotFound";
const AppRoutes = () => {
 const Currentuser = useSelector((state: RootState) => state.authUser.user);

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
        <Route path="/drivers" element={<DriverListedPage/>}/>
        <Route path="/bookslot/:driverID" element={<BookDriver/>}/>
        </Route>
       
      
        <Route path="/userhome" element={<UserDashlayout />}>
          {/* Nested Routes - Only Right Side Content Changes */}
          <Route index element={<Dashboards />} /> {/* Default page: /driver */}
          <Route path="dashboard" element={< Dashboards  />} />
          <Route path="vehicle" element={< Vehicle  />} />
          <Route path="rides" element={< BookRides/>} />
          <Route path="wallet" element={<UserWallet />} />
       
          <Route path="call" element ={<VideoCallPage role="user" />}/>
          <Route path="pdf" element={<PdfFilePreview />}/>
          <Route path="ridehistory" element={<RideHistoryPage role="user" userId={Currentuser?._id!}/> }/>
            <Route path="*" element={<NotFound />} />
        </Route>
          
      </Routes>
    
    
  );
};

export default AppRoutes;
