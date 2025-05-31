import React, { useState, ChangeEvent,  useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  Grid, 
  Dialog, 
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Divider,
  
  Paper,
  Container,
  Stack,
  Fade,
  useMediaQuery,
  useTheme,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DescriptionIcon from '@mui/icons-material/Description';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from "@mui/x-date-pickers";
import { AppDispatch,RootState } from "../store/ReduxStore";
import { useDispatch ,useSelector} from 'react-redux';
import { addVehicle,editVehicle,setVehicles } from '../store/slices/userVehicle';

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { toast,ToastContainer } from 'react-toastify';
import { addVehicleApi, editVehicleApi, getVehiclesApi, VehiclePayload } from '../Api/vehicleService';
import ApiService from '../Api/ApiService';

interface Vehicle {
  Register_No: string;
  ownerName: string;
  vehicleName: string;
  vehicleType: string;
  polution_expire:Dayjs | null; // Changed from string to Date
}
interface VehicleData {
  _id?: string;
  userId?: string;
  vehicleImage: string;
  rcBookImage: string;
  Register_No: string;
  ownerName: string;
  vehicleName: string;
  vehicleType: string;
  polution_expire?:Date |  null|string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}



type modal='add'|'edit'
const Vehicle = () => {
  const MAX_FILE_SIZE = 3 * 1024 * 1024; // 2MB
  const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState<modal>("add");
  
  const [vehiclePreview, setVehiclePreview] = useState<string | null>(null);
  const [RcbookPreview,setRcbookpreview] = useState<string | null>(null);
   const [vehicleImage, setVehicleImage] = useState<File | null>(null);
   const [rcBookImage,setRcbookImage]=useState<File | null>(null);
   const [isLoading, setIsLoading] = useState(false);
   const dispatch = useDispatch<AppDispatch>(); // Type-safe dispatch
   const vehicles = useSelector((state: RootState) => state.userVehicle.vehicles);
   useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const vehilcesData= await getVehiclesApi("user");
    
         
          dispatch(setVehicles(vehilcesData)); 
    
      } catch (error) {
        console.error("Failed to fetch vehicles", error);
      }
    };

    fetchVehicles();
  }, [dispatch]); 
  
  
   
   
  // Form data state for the modal
  const [formData, setFormData] = useState<Vehicle>({
  Register_No: '',
  ownerName: '',
  vehicleName: '',
  vehicleType: '',
  polution_expire: null, 
  });
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleData | null>(null);

  
  const handleDateChange = (date: Dayjs | null) => {
    setFormData((prev) => ({
      ...prev,
      polution_expire: date, 
    }));
  };
 
  const validateForm = () => {
    const nameRegex = /^[A-Za-z\s]{3,}$/;
    const vehicleNumberRegex = /^[A-Z]{2}\d{2}[A-Z]{0,2}\d{4}$/;
  
    // Validate Vehicle Registration Number
    if (!formData.Register_No.trim()) {
      toast.error("Vehicle registration number is required", { position: "top-center" });
      return false;
    }
    if (!vehicleNumberRegex.test(formData.Register_No)) {
      toast.error("Invalid vehicle registration number format", { position: "top-center" });
      return false;
    }
  
    // Validate Owner Name
    if (!formData.ownerName.trim()) {
      toast.error("Owner name is required", { position: "top-center" });
      return false;
    }
    if (!nameRegex.test(formData.ownerName)) {
      toast.error("Owner name must be at least 3 letters and contain only alphabets", { position: "top-center" });
      return false;
    }
  
    // Validate Vehicle Name
    if (!formData.vehicleName.trim()) {
      toast.error("Vehicle name is required", { position: "top-center" });
      return false;
    }
    if (!nameRegex.test(formData.vehicleName)) {
      toast.error("Vehicle name must be at least 3 letters and contain only alphabets", { position: "top-center" });
      return false;
    }
    if(!formData.polution_expire){
      toast.error("polution_expire must be given", { position: "top-center" });
      return false;
    }
   
    return true;
  };
  
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
        toast.error(`${fileType} must be smaller than 3MB.`,{autoClose:1000});
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
  
const handleEditOpen=(type:modal,vehicle:VehicleData)=>{
  setSelectedVehicle(vehicle)
  setModalType(type);
  setFormData({
    Register_No:vehicle.Register_No,
    ownerName:vehicle.ownerName,
    polution_expire: vehicle.polution_expire ? dayjs(vehicle.polution_expire) : null,
    vehicleName:vehicle.vehicleName,
    vehicleType:vehicle.vehicleType,
    

  })
  setVehiclePreview(vehicle.vehicleImage?`${import.meta.env.VITE_IMAGEURL}/${vehicle.vehicleImage}`:"dd")
  setRcbookpreview(vehicle.vehicleImage?`${import.meta.env.VITE_IMAGEURL}/${vehicle.rcBookImage}`:"dd")

console.log(vehicle);
  setOpen(true);

}

  const handleOpen = (type:modal) =>{
    setModalType(type);
    
    

   
    
    setOpen(true);
  };
  
  const handleClose = () =>{ setOpen(false)
    setVehiclePreview('')
    setRcbookpreview('')
    setFormData({
      Register_No: '',
      ownerName: '',
      vehicleName: '',
      vehicleType: '',
      polution_expire: null, 
    });
  
  };
  
  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
 
  
  const handleSubmit =async () => {
    try {
      
    
    if (modalType == "add") {
      if (!validateForm()) return;
      setIsLoading(true);

      if (!vehicleImage || !rcBookImage) {
        throw new Error(
          "Uplod both rc book and vehicle image with view of numberplate"
        );
      }
      const vehicleSignedUrl = await ApiService.getSignedUrls(
        "image/png",
        "vehicle"
      );
      const rcbookSignedUrl = await ApiService.getSignedUrls(
        "image/png",
        "rcbook"
      );

      if (!vehicleSignedUrl || !rcbookSignedUrl) {
        throw new Error("Failed to retrieve signed upload URLs.");
      }

      //  Step 2: Upload files to Cloudinary using the signed URLs
      const [vehicleImageUrl, rcBookImageUrl] = await Promise.all([
        ApiService.uploadFile(vehicleImage, vehicleSignedUrl.signedUrl),
        ApiService.uploadFile(rcBookImage, rcbookSignedUrl.signedUrl),
      ]);

      const userVehicle: VehiclePayload = {
        ...formData,
        polution_expire: formData.polution_expire
          ? formData.polution_expire.toISOString()
          : null,
        vehicleImage: vehicleImageUrl,
        rcBookImage: rcBookImageUrl,
      };

      const response = await addVehicleApi("user", userVehicle);

      dispatch(addVehicle(response.data));
    } 
    else if (modalType === "edit" && selectedVehicle) {
      // 🚀 Handle Editing a Vehicle
      const updatedFields: Partial<VehicleData> = {};
            updatedFields._id=selectedVehicle._id
      // ✅ Upload new images if changed
      if (vehicleImage) {
        const vehicleSignedUrl = await ApiService.getSignedUrls("image/png", "vehicle");
        updatedFields.vehicleImage = await ApiService.uploadFile(vehicleImage, vehicleSignedUrl.signedUrl);
      }
      if (rcBookImage) {
        const rcbookSignedUrl = await ApiService.getSignedUrls("image/png", "rcbook");
        updatedFields.rcBookImage = await ApiService.uploadFile(rcBookImage, rcbookSignedUrl.signedUrl);
      }

      // ✅ Update only changed fields
      if (formData.Register_No !== selectedVehicle.Register_No) {
        updatedFields.Register_No = formData.Register_No;
      }
      if (formData.ownerName !== selectedVehicle.ownerName) {
        updatedFields.ownerName = formData.ownerName;
      }
      if (formData.vehicleType !== selectedVehicle.vehicleType) {
        updatedFields.vehicleType = formData.vehicleType;
      }
      if (formData.vehicleName !== selectedVehicle.vehicleName) {
        updatedFields.vehicleName = formData.vehicleName;
      }

      // ✅ Handle `polution_expire` properly
      const formExpireDate = formData.polution_expire ? formData.polution_expire.toISOString() : null;
      const selectedExpireDate =
        selectedVehicle.polution_expire instanceof Date
          ? selectedVehicle.polution_expire.toISOString()
          : selectedVehicle.polution_expire ?? null;

      if (formExpireDate !== selectedExpireDate) {
        updatedFields.polution_expire = formExpireDate;
      }

      console.log("Updated Fields:", updatedFields);

      if (Object.keys(updatedFields).length > 0) {
        // Call update API
        if (selectedVehicle?._id) {
          await editVehicleApi("user", selectedVehicle._id, updatedFields);
        } 
        dispatch(editVehicle(updatedFields));
      }
      
    }


      handleClose();
   

  }
    catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unknown error occurred');
      }
      
    }
    finally {
      setIsLoading(false); 
    }
  };

  return (
    <Container maxWidth="lg">
      <Box display="flex" flexDirection="column" alignItems="center" p={2} width="100%">
        <Box sx={{ 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3
        }}>
          <Typography variant="h5" component="h1" fontWeight="bold" color="primary">
            My Vehicles
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpen("add")}
            sx={{
              borderRadius: 8,
              textTransform: 'none',
              px: 3,
              py: 1,
              fontWeight: 'bold',
              boxShadow: 2,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4,
              },
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
          >
            Add Vehicle
          </Button>
        </Box>
        {vehicles.map((vehicle: VehicleData) => (
        <Card 
        key={vehicle._id} 
          sx={{
            width: '100%',
            maxWidth: 1200,
            boxShadow: 3,
            borderRadius: 2,
            p: { xs: 1, sm: 2 },
            mb: 3,
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: 6,
            }
          }}
        >
          <Grid container spacing={2} alignItems="stretch" flexWrap="wrap">
            {/* Vehicle Image */}
            <Grid item xs={12} sm={6} md={4}>
              <Paper 
                elevation={2} 
                sx={{ 
                  borderRadius: 2, 
                  overflow: 'hidden',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Box sx={{ position: 'relative', flexGrow: 1 }}>
                  <CardMedia
                    component="img"
                    height={isMobile ? "200" : "220"}
                    image={`${import.meta.env.VITE_IMAGEURL}/${vehicle.vehicleImage}`}

                    alt="Vehicle Image"
                    sx={{ 
                      width: '100%', 
                      objectFit: 'cover',
                      transition: 'transform 0.5s',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  />
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: 10, 
                      left: 10, 
                      bgcolor: 'rgba(0,0,0,0.6)', 
                      color: 'white', 
                      px: 1.5, 
                      py: 0.5, 
                      borderRadius: 10 
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Vehicle Photo</Typography>
                  </Box>
                </Box>
                <Box sx={{ 
                  p: 1.5, 
                  bgcolor: 'primary.main', 
                  color: 'white', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <DirectionsCarIcon sx={{ mr: 1 }} />
                  <Typography variant="body2" fontWeight="medium">Vehicle Image</Typography>
                </Box>
              </Paper>
            </Grid>
            
            {/* Vehicle Details */}
            <Grid item xs={12} sm={6} md={4}>
              <Paper 
                elevation={2} 
                sx={{ 
                  borderRadius: 2, 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <DirectionsCarIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6" fontWeight="bold" color="primary">Vehicle Details</Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Stack spacing={1.5}>
                      <Typography variant="body1">
                        <Typography component="span" fontWeight="bold">Reg.NO:{vehicle.Register_No} </Typography>
                     
                      </Typography>
                      <Typography variant="body1">
                        <Typography component="span" fontWeight="bold">Owner:{vehicle.ownerName}  </Typography>
                     
                      </Typography>
                      <Typography variant="body1">
                        <Typography component="span" fontWeight="bold">VehicleName:{vehicle.vehicleName}  </Typography>
                      
                      </Typography>
                      <Typography variant="body1">
                        <Typography component="span" fontWeight="bold" >VehicleType:{vehicle.vehicleType}  </Typography>
                      
                      </Typography>
                      <Typography variant="body1">
                        <Typography component="span" fontWeight="bold" >PolutionExpire:{vehicle.polution_expire ? dayjs(vehicle.polution_expire).format("DD/MM/YYYY") : "N/A"} </Typography>
                      
                      </Typography>
                    </Stack>
                    
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditOpen("edit",vehicle)}
                    fullWidth
                    sx={{
                      mt: 3,
                      py: 1,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 'bold',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 3,
                      },
                      transition: 'transform 0.2s'
                    }}
                  >
                    Edit Vehicle
                  </Button>
                </CardContent>
              </Paper>
            </Grid>
            
            {/* RC Book Image */}
            <Grid item xs={12} sm={6} md={4} sx={{ marginLeft: { xs: 0, sm: isTablet ? 'auto' : 0 }, marginRight: { xs: 0, sm: isTablet ? 'auto' : 0 } }}>
              <Paper 
                elevation={2} 
                sx={{ 
                  borderRadius: 2, 
                  overflow: 'hidden',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Box sx={{ position: 'relative', flexGrow: 1 }}>
                  <CardMedia
                    component="img"
                    height={isMobile ? "200" : "220"}
                    image={`${import.meta.env.VITE_IMAGEURL}/${vehicle.rcBookImage}`}
                    alt="RC Book Image"
                    sx={{ 
                      width: '100%', 
                      objectFit: 'cover',
                      transition: 'transform 0.5s',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  />
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: 10, 
                      left: 10, 
                      bgcolor: 'rgba(0,0,0,0.6)', 
                      color: 'white', 
                      px: 1.5, 
                      py: 0.5, 
                      borderRadius: 10 
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Registration Document</Typography>
                  </Box>
                </Box>
                <Box sx={{ 
                  p: 1.5, 
                  bgcolor: 'secondary.main', 
                  color: 'white', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <DescriptionIcon sx={{ mr: 1 }} />
                  <Typography variant="body2" fontWeight="medium">RC Book Image</Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Card>
          ))}
        
{/*----------------------------------------------------------------------------- ADDING EDIT MODAL START HERE------------------------------------------------------------------------- */}
        {/* Modal for Adding/Editing Vehicle----------------------------------------------------------------------------------------- */}
        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth
          maxWidth="md"
          fullScreen={isMobile}
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 500 }}
          disableEnforceFocus
          disableRestoreFocus
         
        >
          <DialogTitle sx={{ 
            m: 0, 
            p: 2, 
            bgcolor: modalType === 'add' ? 'primary.main' : 'secondary.main', 
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Box display="flex" alignItems="center">
              {modalType === 'add' ? <AddIcon sx={{ mr: 1 }} /> : <EditIcon sx={{ mr: 1 }} />}
              <Typography variant="h6">{modalType === 'add' ? 'Add New Vehicle' : 'Edit Vehicle'}</Typography>
            </Box>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Basic Information
                </Typography>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Register_NO"
                  name="Register_No"
                  value={formData.Register_No}
                  onChange={handleInputChange}
                  variant="outlined"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="OwnerName"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  variant="outlined"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="vehicleName"
                  name="vehicleName"
                  value={formData.vehicleName}
                  onChange={handleInputChange}
                  variant="outlined"
                /> 
                <FormControl fullWidth margin="normal">
                <InputLabel>Vehicle Type</InputLabel>
                <Select
              
                  required
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleSelectChange}
                  variant="outlined"
                >
                  <MenuItem value="four wheel">FourWheel</MenuItem>
                  <MenuItem value="Heavy">Heavy</MenuItem>
                </Select>
                </FormControl>
               <Typography variant="h6" color="primary" gutterBottom>
  Pollution Expiry Date
</Typography>
<LocalizationProvider dateAdapter={AdapterDayjs}>
<DatePicker
  label="Select Expiry Date"
  defaultValue={null}
  value={formData.polution_expire}
  onChange={handleDateChange}
  slotProps={{ textField: { fullWidth: true } }} // MUI v6+ approach
  shouldDisableDate={(date) => date.isBefore(dayjs(), "day")}
/>

</LocalizationProvider>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Vehicle Image
                </Typography>
                
                {/* Vehicle Image Upload with Preview */}
                <Box sx={{ mb: 3 }}>
      
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Clickable Upload Area */}
        <label htmlFor="vehicle-upload">
          <Paper
            elevation={2}
            sx={{
              width: "100%",
              height: 180,
              borderRadius: 2,
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              bgcolor: vehiclePreview ? "transparent" : "action.hover",
              cursor: "pointer",
            }}
            
          >
            {vehiclePreview ? (
              <img
                src={vehiclePreview}
                alt="Vehicle Preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Box sx={{ textAlign: "center", color: "text.secondary", p: 2 }}>
                <AddAPhotoIcon sx={{ fontSize: 40, mb: 1, color: "primary.main" }} />
                <Typography variant="body2">Click to upload vehicle photo</Typography>
              </Box>
            )}

            {/* Change Image Overlay */}
            {vehiclePreview && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  bgcolor: "rgba(0,0,0,0.5)",
                  color: "white",
                  p: 1,
                  textAlign: "center",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                  transition: "background-color 0.3s",
                }}
              >
                <Typography variant="caption">Click to change image</Typography>
              </Box>
            )}
          </Paper>
        </label>

        {/* Hidden File Input */}
        <input
          type="file"
      
          style={{ display: "none" }}
          id="vehicle-upload"
          accept="image/jpeg, image/png, application/pdf"
          onChange={(e) => handleFileChange(e, setVehicleImage, setVehiclePreview, "Vehicle")} 
        />
      </Box>
    </Box>
                
                {/* RC Book Image Upload with Preview */}
                
                <Box>
                  <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                    RC Book Photo
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <label htmlFor="rcbook-upload">
                    <Paper 
                      elevation={2} 
                      sx={{ 
                        width: '100%', 
                        height: 180, 
                        borderRadius: 2, 
                        overflow: 'hidden',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',
                        bgcolor: RcbookPreview? 'transparent' : 'action.hover'
                      }}
                     
                    >
                      {RcbookPreview? (
                        <img 
                          src={RcbookPreview} 
                          alt="RC Book Preview" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      ) : (
                        <Box sx={{ textAlign: 'center', color: 'text.secondary', p: 2 }}>
                          <AddAPhotoIcon sx={{ fontSize: 40, mb: 1, color: 'secondary.main' }} />
                          <Typography variant="body2">Click to upload RC book photo</Typography>
                        </Box>
                      )}
                      
                      {/* Change Image Overlay */}
                      {RcbookPreview && (
                        <Box 
                          sx={{ 
                            position: 'absolute', 
                            bottom: 0, 
                            left: 0, 
                            right: 0, 
                            bgcolor: 'rgba(0,0,0,0.5)', 
                            color: 'white',
                            p: 1,
                            textAlign: 'center',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                            transition: 'background-color 0.3s'
                          }}
                        >
                          <Typography variant="caption">Click to change image</Typography>
                        </Box>
                      )}
                    </Paper>
                   </label>
                    <input
                 
                 type="file"
      
                 style={{ display: "none" }}
                 id="rcbook-upload"
                 accept="image/jpeg, image/png, application/pdf"
                 onChange={(e) => handleFileChange(e, setRcbookImage, setRcbookpreview, "Vehicle")}
                   
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions sx={{ p: 2 }}>
            <Button 
              onClick={handleClose} 
              variant="outlined" 
              color="error"
              sx={{ borderRadius: 2, px: 3 }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              color={modalType === 'add' ? 'primary' : 'secondary'}
              sx={{ 
                borderRadius: 2, 
                px: 3,
                fontWeight: 'bold',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                },
                transition: 'transform 0.2s'

              }}
              disabled={isLoading}
            >
               {isLoading ? "Processing..." : modalType === "add" ? "Add Vehicle" : "Save Changes"}
            </Button>
          </DialogActions>
        </Dialog>
{/*----------------------------------------------------------------------------- ADDING EDIT MODAL END HERE------------------------------------------------------------------------- */}

      </Box>
   <ToastContainer/>
    </Container>
    
  );
};

export default Vehicle;