import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/index";
import AdminRoute from "./routes/AdminRoute";
import DriverRoute from "./routes/DriverRoute";

function App() {
 return ( 
 
 <BrowserRouter basename="/">

  <AppRoutes />
 <AdminRoute/>
 <DriverRoute/>
</BrowserRouter>
  )
}

export default App;
