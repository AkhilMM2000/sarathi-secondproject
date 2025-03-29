import {  Routes, Route, BrowserRouter } from "react-router-dom";
import DriverSidebar from "../driver/DriverLayout";
import DriverRegister from "../driver/driverRegister";
import ProfileLocation from "../driver/Location";
import DriverOTPVerification from "../driver/VerifyOTP";
import DocumentsVerify from "../driver/Documents";
import DriverDashboard from "../driver/Dashboard";


const DriverRoute = () => {
  return (

      <Routes>
        <Route path="/driver" element={<DriverRegister/>}/>
        <Route path="/driver-location" element={<ProfileLocation/>}/>
        <Route path="/driver-otpverification" element={<DriverOTPVerification/>}/>
       
        <Route path="/verify-documents" element={<DocumentsVerify/>}/>


     <Route path="/driverHome" element={<DriverSidebar/>}>
     <Route index element={<DriverDashboard/>} />
     <Route path="users" element=''/>

    </Route>

      </Routes>
    
  
  );
};

export default DriverRoute
