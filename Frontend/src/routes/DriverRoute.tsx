import {  Routes, Route } from "react-router-dom";
import DriverSidebar from "../driver/DriverLayout";
import DriverRegister from "../driver/driverRegister";
import ProfileLocation from "../driver/Location";
import DriverOTPVerification from "../driver/VerifyOTP";
import DocumentsVerify from "../driver/Documents";
import DriverDashboard from "../driver/Dashboard";
import DriverOnboardingComplete from "../driver/Onboarding";
import RidesDriver from "../driver/Rides";
import VideoCallPage from "../components/VideoCall";
import { RideHistoryPage } from "../components/RideHistoryPage";
import { useSelector } from "react-redux";
import { RootState } from "../store/ReduxStore";
import NotFound from "../components/NotFound";


const DriverRoute = () => {
    const driverState = useSelector(
    (state: RootState) => state.driverStore.driver
  );
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
       <Route path="call" element ={<VideoCallPage role="driver"/>}/>
         <Route path="history" element={<RideHistoryPage role="driver" userId={driverState?._id!}/> }/>
           <Route path="*" element={<NotFound />} />
    </Route>
      
      </Routes>
    
  
  );
};

export default DriverRoute
