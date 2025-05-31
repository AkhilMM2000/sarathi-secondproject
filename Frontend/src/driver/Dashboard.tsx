import React, { ChangeEvent, MouseEvent, useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Box,
  TextField,
  Button,
  Alert,
  Chip,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import LocationOnIcon from '@mui/icons-material/LocationOn';

import LocationPicker from "../components/LocationPicker";
import { AppDispatch, RootState } from "../store/ReduxStore";
import { useDispatch, useSelector } from "react-redux";
import { handleDriverData } from "../Api/driverService";
import { setDriver, updateDriver } from "../store/slices/DriverStore";

import { ToastContainer,toast } from 'react-toastify';
import ApiService from "../Api/ApiService";

import RejectionNotification from "../components/Driverstatus";
import ChangePassword from "../components/ChangePassword";
import { DriverAPI } from "../Api/AxiosInterceptor";


import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import PaymentIcon from '@mui/icons-material/Payment';
import VerifiedIcon from '@mui/icons-material/CreditScore'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EnhancedAlerts from "../components/Alert";
const DriverDashboard: React.FC = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const MAX_FILE_SIZE = 7* 1024 * 1024; 
  const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [editingSection, setEditingSection] = useState<string | null>(null);
 const [refresh, setRefresh] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;

  } | null>(null);
  const driverState = useSelector(
    (state: RootState) => state.driverStore.driver
  );
 const [success,setSuccess]=useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [editedName, setEditedName] = useState(driverState?.name||'');
   const [profileImage, setProfileimage] = useState<File | null>(null);
   const fileInputRef = useRef<HTMLInputElement | null>(null);
   const [mobileNumber,setMobileNumber]=useState<string>(driverState?.mobile||'')
//below usestate hooks for document edit section
const [aadhaarImage, setAadhaarImage] = useState<File | null>(null);
const [aadhaarPreview, setAadhaarPreview] = useState<string | null>(null);
const [editedAadhaarNumber, setEditedAadhaarNumber] = useState(driverState?.aadhaarNumber || "");

const [licenseImage, setLicenseImage] = useState<File | null>(null);
const [licensePreview, setLicensePreview] = useState<string | null>(null);
const [editedLicenseNumber, setEditedLicenseNumber] = useState(driverState?.licenseNumber || "");



   const [isUpdating, setIsUpdating] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    setEditedName(driverState?.name || "");
    setEditedAadhaarNumber(driverState?.aadhaarNumber || "")
    setEditedLicenseNumber(driverState?.licenseNumber || "")
  }, [driverState?.name,driverState?.aadhaarNumber,driverState?.licenseNumber]);
  useEffect(() => {
    setMobileNumber(driverState?.mobile|| "");
  }, [driverState?.mobile]);
  //for image files set up functions 
const handleFileChange = (
      event: ChangeEvent<HTMLInputElement>,
      setFile: React.Dispatch<React.SetStateAction<File | null>>,
      setPreview: React.Dispatch<React.SetStateAction<string | null>>,
      fileType: string
    ) => {
      const file = event.target.files?.[0];
      if (!file) return;
    
      // Validate file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        toast.error(`${fileType} must be a JPEG, PNG, or PDF file.`,{autoClose:1000});
        setFile(null);
        setPreview(null);
        return;
      }
    
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${fileType} must be smaller than 7MB.`,{autoClose:1000});
        setFile(null);
        setPreview(null); // Prevent preview from being set
        return;
      }
    
      setFile(file);
    
      // Set preview only for images within allowed size
      if (file.type.startsWith("image/")) {
        setPreview(URL.createObjectURL(file));
      } else {
        setPreview(null); 
      }
    };
 
    const validateName = (name: string): boolean => {
      const nameRegex = /^[A-Za-z\s]+$/;
      return name.trim() !== "" && nameRegex.test(name.trim());
    };

  // Fetch Driver Data
  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const driverData = await handleDriverData("driver");
        dispatch(setDriver(driverData)); // Update Redux store
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "An unknown error occurred";

        toast.error(errorMessage);
      }
    };

    fetchDriver();
  }, [dispatch,refresh]);

  // Handle Input Change
 
 
  // Update Driver Data
  const handleUpdate = async (field: string) => {
    try {
      if (field === "place") {
        
     
        if (!selectedLocation) {
          toast.error("Please select a location");
          return;
        }
        {
       const updateData={  place: selectedLocation.address,
          location: {
            latitude: selectedLocation.lat,
            longitude: selectedLocation.lng,
          },
        _id:driverState?._id
        }
        // API call to update location
        const updatedData =  await handleDriverData("driver",updateData)
       
  
        // Update Redux store with new data
        dispatch(
          updateDriver({
            place: updatedData.place,
        
          })
        );
     
        
       
        setEditingSection(null);
      }
    }else if(field=='profile'){
    
      if (isUpdating) return;
  
      let profileNew = "";
      let updateMessage = [];
      setIsUpdating(true);
      // Upload profile image only if changed
      if (profileImage) {
        const profileSignedUrl = await ApiService.getSignedUrls("image/png", "profile");
        profileNew = await ApiService.uploadFile(profileImage, profileSignedUrl.signedUrl);
        updateMessage.push("Profile image updated ✅");
      }
    
      // Prepare updated fields
      const updatedData: Record<string, any> = {};
         updatedData._id=driverState?._id
      if (profileNew) {
        updatedData.profileImage = profileNew;
      }
     
       if(!validateName(editedName)){
        toast.error("❌ Invalid name! Only letters and spaces are allowed.", {
          position: "top-center",
        });
        setIsUpdating(false)
        return false;
       }


      if (editedName && editedName.trim() !== driverState?.name) {
      
        updatedData.name = editedName.trim();
        updateMessage.push("Name updated ✅");
      }
    
      if (Object.keys(updatedData).length > 0) {
        const driverData = await handleDriverData("driver", updatedData);
        dispatch(setDriver(driverData));
    
       

        if (updateMessage.length > 0) {
          toast.success(updateMessage.join(" | "), {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          });
        }
        setEditingSection(null);
        setProfileimage(null)
        setPreviewImage(null)
        setIsUpdating(false)
      }
    
    
    }else if(editingSection=='contact'){
      const mobileRegex = /^[6-9]\d{9}$/;
        
      // Validate mobile number
      if (!mobileRegex.test(mobileNumber)) {
        toast.error("❌ Invalid mobile number! Must be 10 digits.", {
          position: "top-center",
        });
        return;
      }
    
      setIsUpdating(true); 

     if(driverState?.mobile!==mobileNumber){

      const driverData = await handleDriverData("driver", {
        _id: driverState?._id,
        mobile: mobileNumber,
      });
      
      dispatch(setDriver(driverData));
    
      toast.success("📞 Mobile number updated successfully!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });

      setEditingSection(null);
      setIsUpdating(false); 
     }
     
     setEditingSection(null);
     setIsUpdating(false);
      
    }

    else if (editingSection=='document'){
          
      if (isUpdating) return;

      setIsUpdating(true);
      const updatedData: Record<string, any> = { _id: driverState?._id };
      let updateMessage = [];
    
      // Aadhaar Image Upload
      if (aadhaarImage) {
        const aadharSignedUrl = await ApiService.getSignedUrls("image/png", "aadhar");
        updatedData.aadhaarImage = await ApiService.uploadFile(aadhaarImage, aadharSignedUrl.signedUrl);
        updateMessage.push("Aadhaar image updated ✅");
      }
    
      // License Image Upload
      if (licenseImage) {
        const licenseSignedUrl = await ApiService.getSignedUrls("image/png", "license");
        updatedData.licenseImage = await ApiService.uploadFile(licenseImage, licenseSignedUrl.signedUrl);
        updateMessage.push("License image updated ✅");
      }
    
      // Aadhaar Number Update
      if (editedAadhaarNumber.trim() && editedAadhaarNumber.trim() !== driverState?.aadhaarNumber) {
        updatedData.aadhaarNumber = editedAadhaarNumber.trim();
        updateMessage.push("Aadhaar number updated ✅");
      }
    
      // License Number Update
      if (editedLicenseNumber.trim() && editedLicenseNumber.trim() !== driverState?.licenseNumber) {
        updatedData.licenseNumber = editedLicenseNumber.trim();
        updateMessage.push("License number updated ✅");
      }
    
      // Call API only if there's an update
      if (Object.keys(updatedData).length > 1) {
        
          const driverData = await handleDriverData("driver", updatedData);
          dispatch(setDriver(driverData));
          setIsUpdating(false);
          setEditingSection(null);
          setLicenseImage(null)
          setLicensePreview(null)
          setAadhaarImage(null)
       
          toast.success(updateMessage.join(" | "), {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          });

    }else{
      setIsUpdating(false);
      setEditingSection(null);
      setLicenseImage(null)
      setLicensePreview(null)
      setAadhaarImage(null)
    }
   

   
  
}}
  catch (error: any) {
      console.error("Failed to update location", error);
      const errorMessage =
        error?.response?.data?.message || error?.message || "Failed to update location";
      toast.error(errorMessage);
    }
  }
  
  const handleLocationSelect = (location: {
    lat: number;
    lng: number;
    address: string;
  }) => {
    setSelectedLocation(location);
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e:MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Make a POST request to your backend to create a Stripe account
      const response = await DriverAPI.post('/onboard', { driverId: driverState?._id,
        email: driverState?.email    });
        window.location.href = response.data.url;
    } catch (err) {
      setLoading(false);
      setError('Something went wrong. Please try again later.');
      console.error(err);
    }
  };
const VerifyPayment=async(_e:MouseEvent<HTMLButtonElement>)=>{
  try {
    await DriverAPI.post('/verify-account', { driverId: driverState?._id });
    setRefresh(prev => !prev);
        setSuccess(true) // trigger re-fetch of bookings
  } catch (error:any) {
    console.log(error)
    setRefresh(prev => !prev);
     setError(error?.response?.data?.error ||  "Failed to verify payment");
  }


}

  return (
    <Box sx={{ width: "100%", maxWidth: "800px", mx: "auto", p: 3 }}>
        <EnhancedAlerts
         success={success}
         error={error?error:''}
        setSuccess={setSuccess}
        setError={setError}
         successMessage="payment activation success"
         
         autoHideDuration={4000}
      />
     <RejectionNotification driverState={driverState} />
     <Card 
       elevation={4} 
       sx={{ 
         mb: 3, 
         borderRadius: 2,
         overflow: 'hidden',
         transition: 'all 0.3s ease',
         '&:hover': {
           boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
         },
         maxWidth: isMobile ? '100%' : '700px', // Increase from 500px to 700px
         margin: '0 auto'
       }}
    >
      {/* Profile Card Header */}
      <Box sx={{ 
        p: 2, 
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h5" fontWeight="bold">
          <AccountCircleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Driver Profile
        </Typography>
        <Button 
          variant="contained" 
          color="secondary" 
          size="small"
          onClick={() => setIsModalOpen(true)}
          sx={{ 
            borderRadius: 4,
            textTransform: 'none',
            fontWeight: 'bold'
          }}
        >
          Change Password
        </Button>
      </Box>

      {/* Important Alert Message */}
      <Alert 
        severity="info" 
        sx={{ 
          borderRadius: 0,
          fontWeight: 'medium'
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
        {!driverState?.stripeAccountId && (
  <Typography
    variant="body2"
    color="text.secondary"
    sx={{ mt: 1, fontStyle: 'italic' }}
  >
    Complete your onboarding to start receiving payments
  </Typography>
)}
         {driverState?.activePayment?
           <Alert 
           severity="success" 
           icon={<VerifiedIcon />} 
           sx={{ mt: 2, fontWeight: 'bold' }}
         >
           Your payment is active
         </Alert>:driverState?.stripeAccountId ? (
         
         
         <Button   variant="contained" 
            color="secondary" 
            size="small" 
            startIcon={<VerifiedIcon/>}
            onClick={VerifyPayment}
            sx={{ 
              borderRadius: 4,
              textTransform: 'none',
              fontWeight: 'bold',
              ml: 2
            }}>Verify Payment</Button>):(<Button 
           type="submit"
           onClick={handleSubmit}
           disabled={loading}
            variant="contained" 
            color="primary" 
            size="small" 
            startIcon={<PaymentIcon />}
            sx={{ 
              borderRadius: 4,
              textTransform: 'none',
              fontWeight: 'bold',
              ml: 2
            }}
          >
            Set Up Payment
          </Button>)}
        </Box>
      </Alert>

      <CardContent sx={{ p: 3 }}>
        {editingSection === "profile" ? (
          <Box className="flex flex-col items-center mt-2">
            {/* Profile Image Preview & Upload */}
            <Box 
              sx={{ 
                position: 'relative', 
                mb: 3, 
                cursor: 'pointer',
                '&:hover .overlay': {
                  opacity: 1
                }
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <Avatar
                src={previewImage || `${import.meta.env.VITE_IMAGEURL}/${driverState?.profileImage}`}
                sx={{ 
                  width: 150, 
                  height: 150, 
                  border: '4px solid white',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                }}
              />
              <Box 
                className="overlay"
                sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  bottom: 0, 
                  backgroundColor: 'rgba(0,0,0,0.5)', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  borderRadius: '50%',
                  opacity: 0,
                  transition: 'opacity 0.2s ease'
                }}
              >
                <Typography color="white" variant="body2">Change Photo</Typography>
              </Box>
            </Box>
            <input
              type="file"
              ref={fileInputRef}  
              style={{ display: "none" }}
              id="vehicle-upload"
              accept="image/jpeg, image/png, application/pdf"
              onChange={(e) => handleFileChange(e, setProfileimage, setPreviewImage, "user")}
            />
            {/* Name Input */}
            <TextField
              label="Full Name"
              variant="outlined"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center' }}>
            <Avatar
              src={`${import.meta.env.VITE_IMAGEURL}/${driverState?.profileImage}` || "/default-avatar.png"}
              sx={{ 
                width: 120, 
                height: 120, 
                mx: "auto", 
                mb: 2,
                border: '4px solid white',
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
              }}
            />
            <Typography variant="h5" fontWeight="bold" mb={1}>{driverState?.name}</Typography>
            <Chip 
              label="Active Driver" 
              color="success" 
              size="small" 
              sx={{ fontWeight: 'bold', mb: 2 }}
            />
            
            <Divider sx={{ my: 2 }} />
            
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                px: 2,
                py: 1,
                bgcolor: 'rgba(0,0,0,0.02)',
                borderRadius: 1
              }}
            >
              <Typography variant="body2" color="textSecondary">
                Account Status
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                <Chip 
                  label={driverState?.status} 
                  size="small" 
                  color="primary" 
                  sx={{ fontWeight: 'bold' }}
                />
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>

      {/* Card Footer */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          p: 2, 
          bgcolor: 'rgba(0,0,0,0.02)',
          borderTop: '1px solid rgba(0,0,0,0.05)'
        }}
      >
        {editingSection === "profile" ? (
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={() => handleUpdate("profile")}
            disabled={isUpdating}
            sx={{ 
              borderRadius: 4,
              px: 3,
              textTransform: 'none',
              fontWeight: 'bold'
            }}
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => setEditingSection("profile")}
            sx={{ 
              borderRadius: 4,
              px: 3,
              textTransform: 'none',
              fontWeight: 'bold'
            }}
          >
            {isUpdating ? "Updating..." : "Edit Profile"}
          </Button>
        )}
      </Box>
    </Card>



      {/* Location Section */}
      <Card 
      elevation={4} 
      sx={{ 
        mb: 3, 
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
        },
        maxWidth: isMobile ? '100%' : '700px', // Matching the profile card width
        margin: '0 auto'
      }}
    >
      {/* Location Card Header */}
      <Box sx={{ 
        p: 2, 
        background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)', // Different gradient for distinction
        color: 'white',
        display: 'flex',
        alignItems: 'center'
      }}>
        <LocationOnIcon sx={{ mr: 1 }} />
        <Typography variant="h5" fontWeight="bold">
          Location
        </Typography>
      </Box>

      <CardContent sx={{ p: 3 }}>
        {editingSection === "place" ? (
          <Box className="mt-2">
            <Typography variant="body2" color="textSecondary" mb={2}>
              Select your service area or primary location
            </Typography>
            <LocationPicker onLocationSelect={handleLocationSelect} defaultAddress={driverState?.place} />
          </Box>
        ) : (
          <Box>
            <Typography variant="body2" color="textSecondary" mb={1}>
              Current Location
            </Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                p: 2, 
                borderRadius: 1,
                bgcolor: 'rgba(0,0,0,0.02)',
                border: '1px solid rgba(0,0,0,0.05)'
              }}
            >
              <LocationOnIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">
                {driverState?.place || "No location set"}
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>

      {/* Card Footer */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          p: 2, 
          bgcolor: 'rgba(0,0,0,0.02)',
          borderTop: '1px solid rgba(0,0,0,0.05)'
        }}
      >
        {editingSection === "place" ? (
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={() => handleUpdate("place")}
            sx={{ 
              borderRadius: 4,
              px: 3,
              textTransform: 'none',
              fontWeight: 'bold'
            }}
          >
            Save Location
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<EditIcon />}
            onClick={() => setEditingSection("place")}
            sx={{ 
              borderRadius: 4,
              px: 3,
              textTransform: 'none',
              fontWeight: 'bold'
            }}
          >
            Edit Location
          </Button>
        )}
      </Box>
    </Card>

      {/* Contact Details Section ==============================================================*/}
      <Card sx={{ mb: 3, p: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" color="textSecondary">
            Contact Details
          </Typography>
          {editingSection === "contact" ? (
            <>   
               <TextField
       fullWidth
       variant="outlined"
      name="email"
       label="Email"
       defaultValue={driverState?.email}
       sx={{ mb: 2 }}
       InputProps={{
       readOnly: true,
    }}
     />
              <TextField
                fullWidth
                variant="outlined"
                name="mobile"
                label="Mobile"
                defaultValue={driverState?.mobile}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
            </>
          ) : (
            <>
              <Typography>
                <strong>Email:</strong> {driverState?.email}
              </Typography>
              <Typography>
                <strong>Mobile:</strong> {driverState?.mobile}
              </Typography>
            </>
          )}
        </CardContent>
        {editingSection === "contact" ? (
          <Button
            variant="contained"
            color="primary"
            sx={{ m: 2 }}
            onClick={() => handleUpdate("contact")}
            disabled={isUpdating} 
          >
            Save
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="secondary"
            sx={{ m: 2 }}
            onClick={() => setEditingSection("contact")}
          >
           {isUpdating ? "Updating..." : "Edit"}
          </Button>
        )}
          
      </Card>
     {/* Documents Section --------------------------------------------------------------------------*/}
     
     <Card sx={{ p: 2 }}>
  <Typography variant="subtitle1" color="textSecondary">
    Documents
  </Typography>

  {editingSection === "document" ? (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      {/* Aadhaar Card Edit */}
      <Grid item xs={12} sm={6}>
        <Card sx={{ 
          p: 1, 
          textAlign: "center",
          height: "100%",
          display: "flex",
          flexDirection: "column"
        }}>
          <input
            type="file"
            accept="image/jpeg, image/png, application/pdf"
            onChange={(e) => handleFileChange(e, setAadhaarImage, setAadhaarPreview, "aadhaar")}
            style={{ display: "none" }}
            id="aadhaar-upload"
          />
          <label 
            htmlFor="aadhaar-upload" 
            style={{ 
              display: "flex", 
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              flex: 1
            }}
          >
            <div style={{
              width: "100%",
              paddingTop: "70%", /* Maintain aspect ratio */
              position: "relative"
            }}>
              <img 
                src={aadhaarPreview || `${import.meta.env.VITE_IMAGEURL}/${driverState?.aadhaarImage}`} 
                alt="Aadhaar" 
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  borderRadius: "8px"
                }} 
              />
            </div>
          </label>
          <TextField
            label="Aadhaar Number"
            variant="outlined"
            fullWidth
            value={editedAadhaarNumber}
            onChange={(e) => setEditedAadhaarNumber(e.target.value)}
            sx={{ mt: 1 }}
                   helperText="Make sure the Adhar number matches exactly as shown in the image"
                   FormHelperTextProps={{
                    sx: {
                      color: '#f44336', // Warning/error red color
                      fontWeight: 'bold',
                      fontSize: '0.8rem',
                      mt: 0.5
                    }
                  }}
          />
        </Card>
      </Grid>

      {/* License Card Edit */}
      <Grid item xs={12} sm={6}>
        <Card sx={{ 
          p: 1, 
          textAlign: "center",
          height: "100%",
          display: "flex",
          flexDirection: "column"
        }}>
          <input
            type="file"
            accept="image/jpeg, image/png, application/pdf"
            onChange={(e) => handleFileChange(e, setLicenseImage, setLicensePreview, "license")}
            style={{ display: "none" }}
            id="license-upload"
          />
          <label 
            htmlFor="license-upload"
            style={{ 
              display: "flex", 
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              flex: 1
            }}
          >
            <div style={{
              width: "100%",
              paddingTop: "70%", /* Maintain aspect ratio */
              position: "relative"
            }}>
              <img 
                src={licensePreview || `${import.meta.env.VITE_IMAGEURL}/${driverState?.licenseImage}`} 
                alt="License" 
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  borderRadius: "8px"
                }} 
              />
            </div>
          </label>
          <TextField
            label="License Number"
            variant="outlined"
            fullWidth
            value={editedLicenseNumber}
            onChange={(e) => setEditedLicenseNumber(e.target.value)}
            sx={{ mt: 1 }}
            helperText="Make sure the license number matches exactly as shown in the image"
            FormHelperTextProps={{
             sx: {
               color: '#f44336', // Warning/error red color
               fontWeight: 'bold',
               fontSize: '0.8rem',
               mt: 0.5
             }
           }}
          />
        </Card>
      </Grid>

      <Grid item xs={12} sx={{ textAlign: "right", mt: 2 }}>
        <Button variant="contained" color="primary" onClick={() => handleUpdate("document")}   disabled={isUpdating} >
          Save
        </Button>
        <Button variant="outlined" color="secondary" sx={{ ml: 2 }} onClick={() => setEditingSection(null)}>
          Cancel
        </Button>
      </Grid>
    </Grid>
// currently working-----------------------------------------------------------------------------------------------------------------

  ) : (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      {/* Aadhaar Card */}
      <Grid item xs={12} sm={6}>
        <Card sx={{ 
          p: 1, 
          textAlign: "center",
          height: "100%",
          display: "flex",
          flexDirection: "column" 
        }}>
          <div style={{
            width: "100%",
            paddingTop: "70%", /* Maintain aspect ratio */
            position: "relative"
          }}>
            <img 
              src={ `${import.meta.env.VITE_IMAGEURL}/${driverState?.aadhaarImage}`} 
              alt="Aadhaar" 
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: "8px"
              }} 
            />
          </div>
          <Typography variant="body2" sx={{ mt: 1 }}>
            <strong>Aadhaar:</strong> {driverState?.aadhaarNumber}
          </Typography>
        </Card>
      </Grid>

      {/* License Card */}
      <Grid item xs={12} sm={6}>
        <Card sx={{ 
          p: 1, 
          textAlign: "center",
          height: "100%",
          display: "flex",
          flexDirection: "column" 
        }}>
          <div style={{
            width: "100%",
            paddingTop: "70%", /* Maintain aspect ratio */
            position: "relative"
          }}>
            <img 
              src={ `${import.meta.env.VITE_IMAGEURL}/${driverState?.licenseImage}`} 
              alt="License" 
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: "8px"
              }} 
            />
          </div>
          <Typography variant="body2" sx={{ mt: 1 }}>
            <strong>License:</strong> {driverState?.licenseNumber}
          </Typography>
        </Card>
      </Grid>

      <Grid item xs={12} sx={{ textAlign: "right", mt: 2 }}>
        <Button variant="outlined" color="secondary" onClick={() => setEditingSection("document")}>
          Edit
        </Button>
      </Grid>
    </Grid>
  )}
</Card>
{isModalOpen && <ChangePassword role="driver" onClose={() => setIsModalOpen(false)} />}
      <ToastContainer/>
    </Box>
    
  );
};

export default DriverDashboard;
