import {  Routes, Route } from "react-router-dom";
import SarathiAdminLogin from "../Admin/AdminLogin";   
import AdminSidebar from "../Admin/AdminLayout";
import UserManagement from "../Admin/Usermanage";
import DriverManagement from "../Admin/Drivermanage";
import Ridelist from "../Admin/Ridelist";
import NotFound from "../components/NotFound";

const AdminRoute = () => {
  return (
    
   
      <Routes>
          <Route path="/admin" element={<SarathiAdminLogin/>}/>
          
          <Route path="/adminhome" element={<AdminSidebar />}>
          {/* Nested Routes - Only Right Side Content Changes */}
          {/* <Route index element={<Dashboards />} /> 
          <Route path="dashboard" element={< Dashboards  />} /> */}
           {<Route index element={< UserManagement  />} /> }
          {<Route path="users" element={< UserManagement  />} /> }
          {<Route path="drivers" element={< DriverManagement/>} /> }
          {<Route path="Rides" element={< Ridelist/>} /> }
            <Route path="*" element={<NotFound />} />
        </Route>
           
      </Routes>
    
  
  );
};

export default AdminRoute;
