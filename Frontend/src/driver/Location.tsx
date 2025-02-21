import { useState } from "react";
import { Button, Typography, Card, Avatar } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProfileLocation = () => {
  const navigate = useNavigate();

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null); 

  // Handle profile image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setProfileImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Dummy function to simulate location selection
  const handleSelectLocation = () => {
    setLocation("Selected Location: XYZ, City");
    toast.success("Location Selected Successfully!");
  };

  // Handle Next Step
  const handleNext = () => {
    if (!profileImage || !location) {
      toast.error("Please upload a profile image and select a location.");
      return;
    }
    navigate("/next-step");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-green-500 relative">
      <ToastContainer />
      <Card className="p-6 shadow-2xl w-96 bg-white/90 backdrop-blur-md relative z-10 border-l-4 border-blue-600">
        <Typography variant="h5" className="text-center text-blue-700 font-bold mb-4">
          Upload Profile & Select Location
        </Typography>

        {/* Profile Image Upload */}
        <div className="flex flex-col items-center">
          <label htmlFor="profile-upload" className="cursor-pointer">
            <Avatar src={preview || "/default-avatar.png"} sx={{ width: 100, height: 100 }} />
          </label>
          <input type="file" id="profile-upload" accept="image/*" className="hidden" onChange={handleImageUpload} />
          <Typography variant="body2" className="text-gray-600 mt-2">
            Click to upload profile picture
          </Typography>
        </div>

        {/* Location Selection */}
        <div className="mt-6 flex flex-col items-center">
          <Button variant="contained" sx={{ backgroundColor: "#0288d1", color: "white" }} onClick={handleSelectLocation}>
            Select Location
          </Button>
          {location && <Typography className="text-sm text-green-700 mt-2">{location}</Typography>}
        </div>

        {/* Next Button */}
        <Button variant="contained" sx={{ backgroundColor: "#ff9800", color: "white", marginTop: "20px" }} fullWidth onClick={handleNext}>
          Next
        </Button>
      </Card>
    </div>
  );
};

export default ProfileLocation;
