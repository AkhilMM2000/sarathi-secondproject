import { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  IconButton,
  Tooltip,
  Chip,
  Typography,
  Box,
 
  
  Radio,
  Divider,
} from "@mui/material";

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VerifiedIcon from '@mui/icons-material/Verified';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { DriverData } from "../constant/types";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloseIcon from '@mui/icons-material/Close';
import { AppDispatch, RootState } from "../store/ReduxStore";
import { useDispatch, useSelector } from 'react-redux';
import { setDriver,changeBlockStatus,updateDriver } from "../store/slices/adminDriverSlice"; 
import { DriverBlockHandle, DriverStatusHandle, GetAllDriverAPi } from "../Api/driverService";
import { toast,ToastContainer } from "react-toastify";
const DriverManagement: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedDriver, setSelectedDriver] = useState<DriverData | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState<string >('');
  const drivers=  useSelector((state: RootState) => state.AllDrivers.drivers);
  const [selectedStatus, setSelectedStatus] = useState<"pending" | "rejected" | "approved">("pending");
  const dispatch = useDispatch<AppDispatch>();

  const openVerifyModal =(driverId: string,status:'rejected'|"approved"|"pending")=>{
    setSelectedDriverId(driverId)
    setSelectedStatus(status)
    setIsVerifyModalOpen(true);
   
  }
 
  
  const closeVerifyModal = () => setIsVerifyModalOpen(false);
  
  const handleViewDocuments = (driver: DriverData) => {
    setSelectedDriver(driver);
    setOpenModal(true);
  };
   const fetchDrivers = async () => {
    try {
      const driverData = await GetAllDriverAPi('admin');
      dispatch(setDriver(driverData));
     
    } catch (error) {
      console.error("Failed to fetch users", error);
     
    }
  };
  useEffect(() => {
      fetchDrivers(); 
    }, []);
    const handleBlockorUnblock = async ({ _id, isBlock }: Pick<DriverData, "_id" | "isBlock">) => {
      try {
        // Call API to update block status
       const response= await DriverBlockHandle('admin', { _id,isBlock}); 
        if(response.success){
          dispatch(changeBlockStatus({ userId: _id, status: !isBlock })); 
        }
        
       
      } catch (error) {
        console.error("Failed to update block status", error);
      }
    };
    const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedStatus(event.target.value as 'pending' | 'rejected' | 'approved');
    };
    
    const handleSubmit = async () => {
      if (!selectedDriverId) {
        toast.error("No driver selected!");
        return;
      }
    
      try {
        const response = await DriverStatusHandle("admin", {
          _id: selectedDriverId,
          status: selectedStatus,
          reason: selectedStatus === "rejected" ? rejectionReason : undefined,
        });
    
        dispatch(updateDriver(response.driver));
        closeVerifyModal();
        toast.success("Driver status updated successfully!");
      } catch (error: any) {
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Failed to update driver status. Please try again later.");
        }
      }
    };
    



    const filteredDrivers = drivers.filter(
        (driver) =>
          (filterStatus === "all" ||
            (filterStatus === "pending" && driver.status === "pending") ||
            (filterStatus === "approved" && driver.status === "approved") ||
            (filterStatus === "rejected" && driver.status === "rejected")) && // Added "rejected" status
          (driver.name.toLowerCase().includes(search.toLowerCase()) ||
            driver.email.toLowerCase().includes(search.toLowerCase()) ||
            driver.mobile.includes(search))
      );
      
  return (
    <div>
      {/* Filters & Search */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          size="small"
        >
          <MenuItem value="all">All</MenuItem>
         
          <MenuItem value="approved">Verified</MenuItem>
          <MenuItem value="pending">pending</MenuItem>
          <MenuItem value="rejected">rejected</MenuItem>
        </Select>
      </div>

      
<TableContainer 
  component={Paper} 
  elevation={2} 
  className="overflow-hidden rounded-lg border border-gray-200"
>
  <Table className="min-w-full">
    <TableHead>
      <TableRow className="bg-gray-50">
        <TableCell className="font-semibold">Profile</TableCell>
        <TableCell className="font-semibold">Name</TableCell>
        <TableCell className="font-semibold hidden md:table-cell">Email</TableCell>
        <TableCell className="font-semibold hidden sm:table-cell">Mobile</TableCell>
        <TableCell className="font-semibold">Status</TableCell>
        <TableCell className="font-semibold text-center">Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {filteredDrivers.map((driver) => (
        <TableRow 
          key={driver._id}
          hover
          className="border-b hover:bg-gray-50"
        >
          <TableCell>
            <Avatar 
              src={`${import.meta.env.VITE_IMAGEURL}/${driver.profileImage}`} 
              alt={driver.name}
              className="border-2 border-gray-200"
            />
          </TableCell>
          <TableCell>
            <Typography variant="body1" className="font-medium">{driver.name}</Typography>
            <Typography variant="body2" className="text-gray-500 md:hidden">
              {driver.email}
            </Typography>
            <Typography variant="body2" className="text-gray-500 sm:hidden">
              {driver.mobile}
            </Typography>
          </TableCell>
          <TableCell className="hidden md:table-cell">{driver.email}</TableCell>
          <TableCell className="hidden sm:table-cell">{driver.mobile}</TableCell>
          <TableCell>
            <Box className="flex flex-col gap-2">
            <Chip
  icon={
    driver.status === "approved" ? <CheckCircleIcon fontSize="small" /> : 
    driver.status === "pending" ? <HourglassEmptyIcon fontSize="small" /> : 
    driver.status === "rejected" ? <CancelIcon fontSize="small" /> : undefined
  }
  label={
    driver.status === "approved" ? "Verified" : 
    driver.status === "pending" ? "Pending" : 
    driver.status === "rejected" ? "Rejected" : "Unknown"
  }
  size="small"
  color={
    driver.status === "approved" ? "success" : 
    driver.status === "pending" ? "warning" : 
    driver.status === "rejected" ? "error" : "default"
  }
  variant="outlined"
/>


              <Chip
                label={driver.isBlock ? "Blocked" : "Active"}
                size="small"
                color={driver.isBlock ? "error" : "success"}
                variant="outlined"
              />
            </Box>
          </TableCell>
          <TableCell>
            <Box className="flex flex-col sm:flex-row gap-2 justify-center items-center">
              <Tooltip title="View Documents">
                <IconButton 
                  size="small" 
                  onClick={() => handleViewDocuments(driver)}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-600"
                >
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              
              <Tooltip title={driver.status === 'approved' ? "Unverify" : "Verify"}>
                <IconButton 
                
                 onClick={() => openVerifyModal(driver._id,driver.status)} 
                  size="small"
                  className={driver.status === 'approved' 
                    ? "bg-yellow-50 hover:bg-yellow-100 text-yellow-600" 
                    : "bg-green-50 hover:bg-green-100 text-green-600"}
                 
                >
                  <VerifiedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              
              <Tooltip title={driver.isBlock ? "Unblock" : "Block"} >
                <IconButton 
                  size="small"
                  className={driver.isBlock 
                    ? "bg-green-50 hover:bg-green-100 text-green-600" 
                    : "bg-red-50 hover:bg-red-100 text-red-600"} 
                    onClick={() => handleBlockorUnblock({ _id: driver._id, isBlock: driver.isBlock })}

                >
                  <BlockIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
{/* driver status change modal */}
<Dialog 
  open={isVerifyModalOpen} 
  onClose={closeVerifyModal}
  fullWidth
  maxWidth="sm"
  PaperProps={{
    elevation: 3,
    className: "rounded-lg"
  }}
>
  <DialogTitle className="bg-gray-50 px-6 py-4 flex justify-between items-center">
    <Typography variant="h6" className="font-medium">Change Driver Status</Typography>
    <IconButton onClick={closeVerifyModal} size="small" className="text-gray-500">
      <CloseIcon fontSize="small" />
    </IconButton>
  </DialogTitle>
  
  <DialogContent className="px-6 py-5">
    <Typography className="text-gray-600 mb-4">
      Please select the appropriate status for this driver
    </Typography>
    
    <Box className="flex flex-col sm:flex-row gap-4 mb-6">
      <Paper 
        elevation={0} 
        className={`border rounded-lg p-4 flex-1 cursor-pointer 
          ${selectedStatus === "approved" ? "border-green-500 bg-green-50" : "border-gray-200"}`}
        onClick={() => handleStatusChange({ target: { value: "approved" } } as React.ChangeEvent<HTMLInputElement>)}
      >
        <Box className="flex items-center gap-3">
          <Radio 
            checked={selectedStatus === "approved"} 
            value="approved"
            color="success"
            size="small"
          />
          <Box className="flex-1">
            <Box className="flex items-center gap-2">
              <CheckCircleOutlineIcon className="text-green-500" />
              <Typography variant="body1" className="font-medium">Approve</Typography>
            </Box>
            <Typography variant="body2" className="text-gray-500 ml-6">
              Driver will be verified and active
            </Typography>
          </Box>
        </Box>
      </Paper>
      
      <Paper 
        elevation={0} 
        className={`border rounded-lg p-4 flex-1 cursor-pointer 
          ${selectedStatus === "rejected" ? "border-red-500 bg-red-50" : "border-gray-200"}`}
        onClick={() => handleStatusChange({ target: { value: "rejected" } } as React.ChangeEvent<HTMLInputElement>)}
      >
        <Box className="flex items-center gap-3">
          <Radio 
            checked={selectedStatus === "rejected"} 
            value="rejected"
            color="error"
            size="small"
          />
          <Box className="flex-1">
            <Box className="flex items-center gap-2">
              <CancelOutlinedIcon className="text-red-500" />
              <Typography variant="body1" className="font-medium">Reject</Typography>
            </Box>
            <Typography variant="body2" className="text-gray-500 ml-6">
              Driver will be unable to login
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
    
    {/* Reason Input (Only for Rejected) */}
    {selectedStatus === "rejected" && (
      <Box className="mt-4 animate-fade-in">
        <Typography className="font-medium mb-2">Rejection Reason</Typography>
        <TextField
          fullWidth
          placeholder="Please provide a reason for rejection"
          variant="outlined"
          margin="dense"
          multiline
          rows={3}
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          className="bg-gray-50"
          required
        />
        <Typography variant="caption" className="text-gray-500 mt-1 block">
          This reason will be shared with the driver
        </Typography>
      </Box>
    )}
  </DialogContent>
  
  <Divider />
  
  <DialogActions className="px-6 py-4 flex justify-end">
    <Button 
      onClick={closeVerifyModal} 
      variant="outlined"
      className="mr-2"
    >
      Cancel
    </Button>
    <Button 
      onClick={handleSubmit} 
      variant="contained" 
      color={selectedStatus === "approved" ? "success" : "error"}
      disabled={selectedStatus === "rejected" && rejectionReason.trim() === ""}
    >
      {selectedStatus === "approved" ? "Approve Driver" : "Reject Driver"}
    </Button>
  </DialogActions>
</Dialog>

      {/* Document Modal */}
      <Dialog 
  open={openModal} 
  onClose={() => setOpenModal(false)}
  maxWidth="md"
  fullWidth
>
  <DialogTitle className="bg-gray-100 px-6 py-4 flex justify-between items-center border-b">
    <span className="text-xl font-semibold">Driver Documents</span>
    <IconButton onClick={() => setOpenModal(false)} size="small">
      <CloseIcon/>
    </IconButton>
  </DialogTitle>
  
  <DialogContent className="p-6">
    {selectedDriver && (
      <div className="space-y-6">
        {/* Location Information */}
        <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-3 mb-4">
          <LocationOnIcon className="text-blue-500" />
          <div>
            <p className="text-sm text-gray-500 mb-1">Current Location</p>
            <p className="font-medium">{selectedDriver.place || "123 Main Street, City"}</p>
          </div>
        </div>
        
        {/* Documents Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Aadhaar Card */}
          <div className="border rounded-lg overflow-hidden shadow-sm">
            <div className="bg-gray-50 p-3 border-b">
              <h3 className="font-medium">Aadhaar Card</h3>
              <p className="text-sm text-gray-500">{selectedDriver.aadhaarNumber}</p>
            </div>
            <div className="p-3">
              <img 
                src={`${import.meta.env.VITE_IMAGEURL}/${selectedDriver.aadhaarImage}`}
              
                alt="Aadhaar" 
                className="w-full h-auto rounded" 
              />
            </div>
          </div>
          
          {/* License */}
          <div className="border rounded-lg overflow-hidden shadow-sm">
            <div className="bg-gray-50 p-3 border-b">
              <h3 className="font-medium">Driver's License</h3>
              <p className="text-sm text-gray-500">{selectedDriver.licenseNumber}</p>
            </div>
            <div className="p-3">
              <img 
             src={`${import.meta.env.VITE_IMAGEURL}/${selectedDriver.licenseImage}`}
                alt="License" 
                className="w-full h-auto rounded" 
              />
            </div>
          </div>
        </div>
      </div>
    )}
  </DialogContent>
  
  <DialogActions className="p-4 border-t">
    <Button 
      onClick={() => setOpenModal(false)}
      variant="contained" 
      color="primary"
    >
      Close
    </Button>
  </DialogActions>
</Dialog>
<ToastContainer/>
    </div>
  );
};

export default DriverManagement;
