import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import UserRegister from "../pages/UserRegister";
import OTPVerification from "../pages/OtpVerification";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Routes without Layout (no header) */}
        <Route path="/" element={<Home/>} />
        <Route path="/user" element={<UserRegister/>}/>
        <Route path="/otp-verification" element={<OTPVerification/>}/>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
