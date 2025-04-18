import React from "react";
import NavBar from "../components/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../user/Footer";

const UserBody = () => {
  const location = useLocation();
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar (Fixed at the Top) */}
      <NavBar />

      <div className="pt-16">  {/* Adjust height based on navbar size */}
  <Outlet />
</div>


      {/* Footer (Sticks to Bottom) */}
     
      {!["/drivers"].includes(location.pathname) && !location.pathname.startsWith("/bsookslot") && <Footer />}

      
    </div>
  );
};

export default UserBody;
