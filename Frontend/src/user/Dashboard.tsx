import {  useEffect, useState } from "react";
import LockIcon from '@mui/icons-material/Lock';
import { 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Grid, 
  Avatar, 
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Paper,
  Chip
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import { AppDispatch, RootState} from "../store/ReduxStore";
import { useDispatch,useSelector} from "react-redux";
import {setAuthUser,updateUser } from "../store/slices/AuthuserStore";
import LocationPicker from "../components/LocationPicker";
import { IUser } from "../constant/types";
import { getLoggedUserApi, updateLoggedUserApi } from "../Api/userService";
import { toast ,ToastContainer} from "react-toastify";
import ApiService from "../Api/ApiService";

import ChangePassword from "../components/ChangePassword";
import {
  WhatsappShareButton,
  FacebookShareButton,
  WhatsappIcon,
  FacebookIcon,
} from "react-share";
import { signUrl } from "../constant/Api";
// Define TypeScript interfaces


const UserDashboard = () => {
  
  // User data with location
   const dispatch = useDispatch<AppDispatch>(); // Type-safe dispatch
   const Currentuser = useSelector((state: RootState) => state.authUser.user);

const referralMessage = `Use my referral code ${Currentuser?.referralCode} to sign up on Sarathi!`;
const shareUrl = signUrl
   const [user, setUser] = useState<Partial<IUser>>({
     name: Currentuser?.name,
     email: Currentuser?.email,
     mobile: Currentuser?.mobile,
     referralCode: Currentuser?.referralCode,
     isBlock: Currentuser?.isBlock,
     role: Currentuser?.role,
     place: Currentuser?.place,
   });
   
  const [editState,seteditState]=useState<string|null>(null)
  const [openModal, setOpenModal] = useState(false);
  // const [editedUser, setEditedUser] = useState<Partial<IUser>>({ ...user });
  const [isEdit,setIsEdit]=useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
const [profilePreview, setProfilePreview] = useState<string | null>(null);

const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  if (event.target.files && event.target.files.length > 0) {
    const file = event.target.files[0];
    setProfileImageFile(file);
    setProfilePreview(URL.createObjectURL(file)); // Create a preview URL
  }
};

  // const [openMapModal, setOpenMapModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;

  } | null>(null);

  const handleOpenModal = () =>{
    seteditState(null)
    setOpenModal(true);
  }
  const handleCloseModal = () =>{
    setIsEdit(false)
    setOpenModal(false);
  } 
  
  const handleLocationSelect = (location: {
    lat: number;
    lng: number;
    address: string;
  }) => {
    setSelectedLocation(location);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value, // Update the field dynamically
    });
  };
  useEffect(() => {
    setUser({
      name: Currentuser?.name,
      email: Currentuser?.email,
      mobile: Currentuser?.mobile,
      referralCode: Currentuser?.referralCode,
      isBlock: Currentuser?.isBlock,
      role: Currentuser?.role,
      place: Currentuser?.place,
    });
  }, [Currentuser]); // Runs when Currentuser changes
  
  
  useEffect(() => {
    const fetchLoggedUser = async () => {
      try {
        const user = await getLoggedUserApi();
        console.log(user);
        
        dispatch(setAuthUser(user)); 
      } catch (error) {
        console.error("Failed to fetch logged user:", error);
      }
    };
  
    fetchLoggedUser();
  }, [dispatch]); 
  
//validation function below
const validateUserData = (name?: string, mobile?: string): boolean => {
  const nameRegex = /^[a-zA-Z\s]{3,}$/;
  const mobileRegex = /^[6-9]\d{9}$/;

  if (name !== undefined && !nameRegex.test(name)) {
    toast.error("❌ Invalid name! Must be at least 3 characters and contain only letters.", {
      position: "top-center",
    });
    return false;
  }

  if (mobile !== undefined && !mobileRegex.test(mobile)) {
    toast.error("❌ Invalid mobile number! Must start with 6-9 and be 10 digits.", {
      position: "top-center",
    });
    return false;
  }

  return true;
};

const handleSave = async () => {
  try {
    if (editState === "location") {
      setIsEdit(true);

      if (!selectedLocation) {
        toast.error("❌ Please select a location", { autoClose: 1000 });
        setIsEdit(false); // Reset edit state
        return;
      }

      const updateData = {
        place: selectedLocation.address,
        location: {
          latitude: selectedLocation.lat,
          longitude: selectedLocation.lng,
        },
        _id: Currentuser?._id,
      };

      const data = await updateLoggedUserApi(updateData);
      dispatch(updateUser(data));

      seteditState(null);
      setIsEdit(false); // Reset edit state after success
      handleCloseModal();
      return; // Return early to prevent running further code
    }

    // If editing profile data
    if (isEdit) return;

    let profileNew = "";
    let updateMessage: string[] = [];
    setIsEdit(true);

   
    if (profileImageFile) {
      const profileSignedUrl = await ApiService.getSignedUrls("image/png", "profile");
      profileNew = await ApiService.uploadFile(profileImageFile, profileSignedUrl.signedUrl);
      updateMessage.push("Profile image updated ✅");
    }

 
    const updatedData: Record<string, any> = {};
    updatedData._id = Currentuser?._id;

    if (profileNew) {
      updatedData.profile = profileNew;
    }

    
    if (user.name && user.name.trim() !== Currentuser?.name) {
      if (!validateUserData(user.name)) {
        setIsEdit(false);
        return;
      }
      updatedData.name = user.name.trim();
      updateMessage.push("Name updated ✅");
    }

    
    if (user.mobile && user.mobile.trim() !== Currentuser?.mobile) {
      if (!validateUserData(undefined, user.mobile)) {
        setIsEdit(false);
        return;
      }
      updatedData.mobile = user.mobile.trim();
      updateMessage.push("Mobile updated ✅");
    }

    
    if (Object.keys(updatedData).length <= 1) {
      toast.info("No changes detected.", { autoClose: 1000 });
      setIsEdit(false);
      return;
    }

   
    const data = await updateLoggedUserApi(updatedData);
    dispatch(updateUser(data));

  
    updateMessage.forEach((msg) => toast.success(msg, { autoClose: 1000 }));

    // Close modal after successful update
    handleCloseModal();
  } catch (error:any) {
    console.error("Error updating:", error);
    toast.error(`${error.response.data.message}`, { autoClose: 1000 });
    setIsEdit(false);
  }
};

  
  return (
    <Box sx={{ 
      p: { xs: 2, sm: 3, md: 4 }, 
      width: "100%", 
      bgcolor: "#f5f7fa",
      minHeight: "100vh"
    }}>
     <Paper 
  elevation={0} 
  sx={{ 
    py: 5, 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    mb: 4, 
    borderRadius: 3,
    background: "linear-gradient(135deg, #6b73ff 0%, #000dff 100%)",
    color: "white"
  }}
>
  {/* Location Section */}
  <Box sx={{ 
    display: "flex", 
    alignItems: "center", 
    mb: 3,
    px: 3,
    py: 1,
    borderRadius: 50,
    bgcolor: "rgba(255, 255, 255, 0.2)",
  }}>
    <LocationOnIcon sx={{ mr: 1 }} />
    <Typography variant="subtitle1">
      {Currentuser?.place}
    </Typography>
  </Box>
  
  <Avatar 
    sx={{ 
      width: 140,
      height: 140,
      border: "5px solid #f0f2f5",
      boxShadow: 3
    }}
    src={`${import.meta.env.VITE_IMAGEURL}/${Currentuser?.profile}`}
  />
  <Typography variant="h4" fontWeight="bold" gutterBottom>
    {Currentuser?.name}
  </Typography>
  <Chip 
    label="WELCOME" 
    sx={{ 
      bgcolor: "rgba(255, 255, 255, 0.2)", 
      color: "white",
      fontWeight: "bold",
      mb: 2  // Added margin bottom for spacing before the button
    }} 
  />
  
  {/* Change Password Button */}
  <Button
    variant="contained"
    startIcon={<LockIcon />}
    sx={{
      bgcolor: "rgba(255, 255, 255, 0.2)",
      color: "white",
      fontWeight: "bold",
      '&:hover': {
        bgcolor: "rgba(255, 255, 255, 0.3)"
      },
      px: 3,
      py: 1,
      borderRadius: 2
    }}
    onClick={() => setIsModalOpen(true)}
  >
    Change Password
  </Button>
  
</Paper>
      
      <Card sx={{ width: "100%", borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", overflow: "visible" }}>
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
            <Typography variant="h5" fontWeight="bold">Profile Information</Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleOpenModal}
              startIcon={<EditIcon />}
              
              sx={{ 
                px: 3, 
                py: 1, 
                borderRadius: "50px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                background: "linear-gradient(90deg, #6b73ff 0%, #000dff 100%)",
                '&:hover': {
                  boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
                }
              }}
            >
              Edit Profile
            </Button>
          </Box>
          
          <Grid container spacing={4}>
            {/* Location field */}
            <Grid item xs={12}>
              
      <Paper
  elevation={0}
  sx={{
    p: 2.5,
    borderRadius: 2,
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    alignItems: { xs: "stretch", sm: "center" },
    bgcolor: "#f9fafc",
    border: "1px solid #eaecf0",
    width: "100%",
    mb: 2
  }}
>
  {editState === "location" ? (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <LocationOnIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6" fontWeight="medium">
          Update Location
        </Typography>
      </Box>
    
      <Box 
        sx={{ 
          mt: 2, 
          width: "100%", 
          maxHeight: "300px",
          overflow: "auto",
          border: "1px solid #e0e0e0",
          borderRadius: 1,
          bgcolor: "#ffffff"
        }}
      >
        <LocationPicker 
          onLocationSelect={handleLocationSelect}
       defaultAddress={Currentuser?.place}
        />
      </Box>
      
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 1 }}>
        <Button 
          variant="outlined" 
          size="small" 
          onClick={() => seteditState(null)}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          size="small" 
          disabled={isEdit}
          onClick={handleSave}
          
        >
        {isEdit ? "Editing..." : "Edit"}
        </Button>
      </Box>
    </Box>
  ) : (
    <>
      <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
        <Box sx={{ mr: 2 }}>
          <LocationOnIcon color="primary" />
        </Box>
        <Box flexGrow={1}>
          <Typography variant="caption" color="text.secondary" fontWeight="medium">
            Location
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {Currentuser?.place}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ mt: { xs: 2, sm: 0 } }}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => seteditState("location")}
          startIcon={<EditIcon />}
        >
          Edit
        </Button>
      </Box>
    </>
  )}
</Paper>

</Grid>


            {/* Name field */}
            <Grid item xs={12} sm={6}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2.5, 
                  borderRadius: 2, 
                  display: "flex", 
                  alignItems: "center",
                  bgcolor: "#f9fafc",
                  border: "1px solid #eaecf0"
                }}
              >
                <Box sx={{ mr: 2 }}>
                  <PersonIcon color="primary" />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="medium">
                    Name
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {Currentuser?.name}
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Email field */}
            <Grid item xs={12} sm={6}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2.5, 
                  borderRadius: 2, 
                  display: "flex", 
                  alignItems: "center",
                  bgcolor: "#f9fafc",
                  border: "1px solid #eaecf0"
                }}
              >
                <Box sx={{ mr: 2 }}>
                  <EmailIcon color="primary" />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="medium">
                    Email
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                  {Currentuser?.email}
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Mobile field */}
            <Grid item xs={12} sm={6}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2.5, 
                  borderRadius: 2, 
                  display: "flex", 
                  alignItems: "center",
                  bgcolor: "#f9fafc",
                  border: "1px solid #eaecf0"
                }}
              >
     
                <Box sx={{ mr: 2 }}>
                  <PhoneIcon color="primary" />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="medium">
                    Mobile
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                  {Currentuser?.mobile}
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Referral Code field */}
            <Grid item xs={12} sm={6}>
  <Paper
    elevation={0}
    sx={{
      p: 2.5,
      borderRadius: 2,
      bgcolor: "#f9fafc",
      border: "1px solid #eaecf0",
    }}
  >
    {/* Flex container: Left side referral info, right side share buttons */}
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Referral Info */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <CardGiftcardIcon color="primary" sx={{ mr: 1.5 }} />
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight="medium">
            Referral Code
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {Currentuser?.referralCode}
          </Typography>
        </Box>
      </Box>

      {/* Share Buttons */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <WhatsappShareButton url={shareUrl} title={referralMessage}>
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
        <FacebookShareButton url={shareUrl} hashtag="#SarathiReferral">
          <FacebookIcon size={32} round />
        </FacebookShareButton>
      </Box>
    </Box>
  </Paper>
</Grid>


          </Grid>
        </CardContent>
      </Card>
      
      {/* Edit User Modal */}
      <Dialog 
        open={openModal} 
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
          }
        }}
      >
        <DialogTitle sx={{ m: 0, p: 3 }}>
          <Typography variant="h5" fontWeight="bold">Edit Profile</Typography>
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />




        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
            <Box sx={{ position: "relative" }}>
            <Avatar 
  sx={{ 
    width: 120, 
    height: 120,
    border: "4px solid #f0f2f5",
    boxShadow: 2
  }}
  src={profilePreview||`${import.meta.env.VITE_IMAGEURL}/${Currentuser?.profile}`} 

/>
<IconButton 
  size="small"
  component="label" 
  sx={{ 
    position: "absolute", 
    bottom: 0, 
    right: 0, 
    bgcolor: "primary.main",
    color: "white",
    '&:hover': {
      bgcolor: "primary.dark"
    }
  }}
>
  <EditIcon fontSize="small" />
  <input 
    type="file" 
    accept="image/*" 
    hidden 
    onChange={handleProfileImageChange} 
  />
</IconButton>

            </Box>
          </Box>
          <Grid container spacing={3}>
           

            {/* Name Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Name"
                value={user.name}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                InputProps={{
                  startAdornment: <Box sx={{ mr: 1, color: "text.secondary" }}><PersonIcon color="primary" /></Box>
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2
                  }
                }}
              />
            </Grid>

            {/* Email Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                name="email"
                label="Email"
                value={user.email}
                fullWidth
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: 1, color: "text.secondary" }}>
                      <EmailIcon color="primary" />
                    </Box>
                  ),
                  readOnly: true, // Email is now read-only
                }}
                 helperText="Email cannot be changed"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2
                  }
                }}
              />
            </Grid>

            {/* Mobile Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                name="mobile"
                label="Mobile"
                value={user.mobile}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                InputProps={{
                  startAdornment: <Box sx={{ mr: 1, color: "text.secondary" }}><PhoneIcon color="primary" /></Box>
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2
                  }
                }}
              />
            </Grid>

            {/* Referral Code Field (Read-only) */}
            <Grid item xs={12} sm={6}>
              <TextField
                name="referralCode"
                label="Referral Code"
                value={user.referralCode}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                InputProps={{
                  startAdornment: <Box sx={{ mr: 1, color: "text.secondary" }}><CardGiftcardIcon color="primary" /></Box>,
                  readOnly: true
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: "#f5f5f5"
                  }
                }}
                helperText="Referral code cannot be changed"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={handleCloseModal} 
            variant="outlined"
            sx={{ 
              borderRadius: "50px", 
              px: 3,
              borderColor: "#d0d5dd",
              color: "#344054",
              '&:hover': {
                borderColor: "#98a2b3",
                bgcolor: "#f9fafb"
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained"
            sx={{ 
              borderRadius: "50px", 
              px: 3,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              background: "linear-gradient(90deg, #6b73ff 0%, #000dff 100%)",
              '&:hover': {
                boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
              }
            }}
            disabled={isEdit}
          >
             {isEdit ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
      {isModalOpen && <ChangePassword role="user" onClose={() => setIsModalOpen(false)} />}
      <ToastContainer/>
    </Box>
  );
};

export default UserDashboard;