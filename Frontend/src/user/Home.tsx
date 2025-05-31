import { Button, Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person"; // Icon for User Login
import DriveEtaIcon from "@mui/icons-material/DriveEta";

const Home = () => {
  const navigate = useNavigate();

  
  return (
    
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 relative">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30 z-0"></div>

      {/* Large Company Name in Background */}
      <h1 className="absolute text-[8rem] md:text-[10rem] font-extrabold text-white opacity-10 select-none top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
        SARATHI
      </h1>

      {/* Registration Cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
        {/* User Registration Card */}
        <Card className="p-6 shadow-2xl hover:scale-105 transition transform duration-300 cursor-pointer bg-white/80 backdrop-blur-md">
          <CardContent>
            <Typography variant="h5" className="text-center text-blue-700 font-bold">
           
              <Button 
              variant="contained" 
              color="primary" 
              startIcon={<PersonIcon />} 
              onClick={() => navigate("/user")}
            >
              Go to User Registration
            </Button>
            </Typography>
          </CardContent>
        </Card>

        {/* Driver Registration Card */}
        <Card className="p-6 shadow-2xl hover:scale-105 transition transform duration-300 cursor-pointer bg-white/80 backdrop-blur-md">
          <CardContent>
            <Typography variant="h5" className="text-center text-green-700 font-bold">
            <Button 
              variant="contained" 
              color="secondary" 
              startIcon={<DriveEtaIcon />}
              onClick={() => navigate("/driverReg")}
            >
              Go to Driver Registration
            </Button>
            </Typography>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
