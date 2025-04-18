import {  Routes, Route, BrowserRouter } from "react-router-dom";
import DriverSidebar from "../driver/DriverLayout";
import DriverRegister from "../driver/driverRegister";
import ProfileLocation from "../driver/Location";
import DriverOTPVerification from "../driver/VerifyOTP";
import DocumentsVerify from "../driver/Documents";
import DriverDashboard from "../driver/Dashboard";
import DriverOnboardingComplete from "../driver/Onboarding";
import RidesDriver from "../driver/Rides";


const DriverRoute = () => {
  return (

      <Routes>
        <Route path="/driverReg" element={<DriverRegister/>}/>
        <Route path="/driver-location" element={<ProfileLocation/>}/>
        <Route path="/driver-otpverification" element={<DriverOTPVerification/>}/>
       
        <Route path="/verify-documents" element={<DocumentsVerify/>}/>


     <Route path="/driver" element={<DriverSidebar/>}>
     <Route index element={<DriverDashboard/>} />
     <Route path="onboard-success" element={<DriverOnboardingComplete />}/>
     <Route path="onboard-failure'" element={<DriverOnboardingComplete />}/>
      <Route path="rides" element={<RidesDriver/>} />
    </Route>

      </Routes>
    
  
  );
};

export default DriverRoute
