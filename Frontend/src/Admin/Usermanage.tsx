import React, { useState, useEffect } from 'react';

import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Tooltip,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Avatar,
  DialogContent,
  DialogTitle,
  Dialog,
  DialogActions,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  DirectionsCar as VehicleIcon,
  Block as BlockIcon,
  CheckCircle as UnblockIcon,
 
} from '@mui/icons-material';
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import { AppDispatch, RootState } from "../store/ReduxStore";
import { useDispatch, useSelector } from 'react-redux';
import {  IVehicle, UserWithVehicleCount } from '../constant/types'; 
import { changeBlockStatus, setUser} from '../store/slices/userStore';
import { BlockUnblockApi, getUserApi } from '../Api/userService';
import { getVehiclesByUser } from '../Api/vehicleService';
import {toast } from 'react-toastify';
import usePreventBackNavigation from '../hooks/usePreventBackNavigation';

const UserManagement: React.FC = () => {
  usePreventBackNavigation()
  const [filteredUsers, setFilteredUsers] = useState<UserWithVehicleCount[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const [vehicleUserid,setVehicleUserid]=useState<string>('')
 const [openModal, setOpenModal] = useState<boolean>(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
const users = useSelector((state: RootState) => state.users.user);


   const dispatch = useDispatch<AppDispatch>();
   const fetchUsers = async () => {
    try {
      const userData = await getUserApi('admin');
      dispatch(setUser(userData));
      setLoading(false); 
    } catch (error) {
      console.error("Failed to fetch users", error);
      setLoading(false); 
    }
  };
  
  useEffect(() => {
    fetchUsers(); // Calling fetchUsers inside useEffect to run on initial render
  }, [dispatch]);
 
  useEffect(() => {
    // Filter users based on search term
    if(!users){
      return 
    }
    const results = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mobile.includes(searchTerm)
    );
    setFilteredUsers(results);
    setPage(0);
  }, [searchTerm, users]);

  useEffect(() => {
    if (openModal) {
      fetchVehicles();
    
    } else {
      setVehicles([]); 
   // Clear vehicles when modal closes
    }
  }, [openModal]);
 
  const fetchVehicles = async () => {
  
    try {
      const res = await getVehiclesByUser('admin',vehicleUserid)
      console.log(res);
      
      setVehicles(res.data);
    } catch (err:any) {
      err instanceof Error
      toast.error(err.message);
    }
   
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
     
    console.log(event)
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleRefresh = () => {
    setSearchTerm('');
    fetchUsers();
  };

  const handleToggleBlock = async (userId: string,status:boolean) => {
    try {
     
      const response=await BlockUnblockApi('admin',userId,!status)
     
     
      
       if(response.success){

      dispatch(changeBlockStatus({userId,status}))
      fetchUsers();
       }
    } catch (error) {
      console.error('Error toggling user block status:', error);
    }
  };

  const handleViewVehicles = (userId: string) => {
    setVehicleUserid(userId)
   setOpenModal(true)
    console.log(`View vehicles for user ${userId}`);
    
  };





  // Card view for mobile
  const renderMobileCards = () => (
    <Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredUsers.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">No users found</Typography>
        </Box>
      ) : (
        filteredUsers
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((user) => (
            <Card key={user._id} sx={{ mb: 2, borderRadius: 2 }}>
              <CardContent>
                <Grid container spacing={1}>
                  <Grid item xs={3} sm={2}>
                    <Avatar 
                     
                      src={`${import.meta.env.VITE_IMAGEURL}/${user.profile}`} 
                      alt={user.name}
                      sx={{ width: 60, height: 60 }}
                    >
                      {user.name.charAt(0)}
                    </Avatar>
                  </Grid>
                  <Grid item xs={9} sm={10}>
                    <Typography variant="h6" fontWeight="medium">{user.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                  </Grid>
                  <Grid item xs={12} sx={{ mt: 1 }}>
                    <Typography variant="body2">
                      <strong>Mobile:</strong> {user.mobile}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Vehicles:</strong> {user.vehicleCount}
                    </Typography>
                    <Typography variant="body2">
                      {/* <strong>Registered:</strong> {new Date(user.).toLocaleDateString()} */}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sx={{ mt: 1 }}>
                    <Chip
                      label={user.isBlock ? "Blocked" : "Active"}
                      color={user.isBlock ? "error" : "success"}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                      startIcon={user.isBlock ? <UnblockIcon /> : <BlockIcon />}
                      variant="outlined"
                      color={user.isBlock ? "success" : "error"}
                      size="small"
                      onClick={() => handleToggleBlock(user._id,user.isBlock)}
                      sx={{ mr: 1 }}
                    >
                      {user.isBlock ? "Unblock" : "Block"}
                    </Button>
                    <Button
                      startIcon={<VehicleIcon />}
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleViewVehicles(user._id)}
                      disabled={user.vehicleCount === 0}
                    >
                      Vehicles
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))
      )}
  
    </Box>
  );

  // Table view for tablet and desktop
  const renderTable = () => (
    <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <Table sx={{ minWidth: 650 }} aria-label="users table">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f7fa' }}>
            <TableCell sx={{ fontWeight: 'bold', width: '60px' }}>Image</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Mobile</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Vehicles</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                <CircularProgress size={30} />
              </TableCell>
            </TableRow>
          ) : filteredUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                <Typography color="text.secondary">No users found</Typography>
              </TableCell>
            </TableRow>
          ) : (
            filteredUsers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user._id} hover>
                  <TableCell>
                    <Avatar 
                       src={`${import.meta.env.VITE_IMAGEURL}/${user.profile}`} 
                      alt={user.name}
                      sx={{ width: 40, height: 40 }}
                    >
                      {user.name.charAt(0)}
                    </Avatar>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <Typography fontWeight="medium">{user.name}</Typography>
                    {!isTablet && (
                      <Typography variant="caption" color="text.secondary">
                        {/* Registered: {new Date(user.registeredDate).toLocaleDateString()} */}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.mobile}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.isBlock ? "Blocked" : "Active"}
                      color={user.isBlock ? "error" : "success"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.vehicleCount}
                      color={user.vehicleCount > 0 ? "info" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Tooltip title={user.isBlock ? "Unblock User" : "Block User"}>
                        <IconButton
                          color={user.isBlock ? "success" : "error"}
                          onClick={() => handleToggleBlock(user._id,user.isBlock)}
                          size="small"
                          sx={{ mr: 1 }}
                        >
                          {user.isBlock ? <UnblockIcon /> : <BlockIcon />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View Vehicles">
                        <span>
                          <IconButton
                            color="primary"
                            onClick={() => handleViewVehicles(user._id)}
                            size="small"
                            disabled={user.vehicleCount === 0}
                          >
                            <VehicleIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
        <Typography variant="h5" fontWeight="bold" color="primary.main">
          User Management
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', sm: 'auto' } }}>
          <TextField
            placeholder="Search users..."
            variant="outlined"
            size="small"
            fullWidth={isMobile}
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              )
            }}
            sx={{ width: { sm: '220px', md: '280px' } }}
          />
          <Tooltip title="Refresh">
            <IconButton 
              onClick={handleRefresh} 
              color="primary" 
              size="medium" 
              sx={{ border: '1px solid', borderColor: 'divider' }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : <RefreshIcon />}
            </IconButton>
          </Tooltip>
        </Box>
   
      </Box>

      {/* Show cards for mobile view and table for larger screens */}
      {isMobile ? renderMobileCards() : renderTable()}

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredUsers.length}
        rowsPerPage={rowsPerPage}
        page={filteredUsers.length === 0 ? 0 : page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
<Dialog open={openModal} onClick={() => setOpenModal(false)} maxWidth="sm" fullWidth>
  <DialogTitle className="bg-gray-100 px-6 py-4 flex justify-between items-center border-b">
    <span className="text-xl font-semibold">Vehicle Details</span>
    <IconButton onClick={() => setOpenModal(false)} size="small">
      <CloseIcon />
    </IconButton>
  </DialogTitle>

  <DialogContent className="p-6 space-y-4">
  {
      vehicles.map((vehicle, index) => (
        <div key={index} className="bg-blue-50 p-4 rounded-lg shadow-md space-y-4">
          {/* Vehicle Info */}
          <div>
            <p className="text-gray-700"><strong>Reg. No:</strong> {vehicle.Register_No}</p>
            <p className="text-gray-700"><strong>Owner:</strong> {vehicle.ownerName}</p>
            <p className="text-gray-700"><strong>Vehicle Name:</strong> {vehicle.vehicleName}</p>
            <p className="text-gray-700"><strong>Vehicle Type:</strong> {vehicle.vehicleType}</p>
            <p className="text-gray-700"><strong>Pollution Expiry:</strong> {vehicle.polution_expire}</p>
          </div>

          {/* Vehicle Images */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg overflow-hidden shadow-sm">
              <div className="bg-gray-50 p-3 border-b flex items-center gap-2">
                <ImageIcon className="text-blue-500" />
                <h3 className="font-medium">Vehicle Image</h3>
              </div>
              <img src={`${import.meta.env.VITE_IMAGEURL}/${vehicle.vehicleImage}`} alt="Vehicle" className="w-full h-auto rounded" />
            </div>

            <div className="border rounded-lg overflow-hidden shadow-sm">
              <div className="bg-gray-50 p-3 border-b flex items-center gap-2">
                <ImageIcon className="text-green-500" />
                <h3 className="font-medium">RC Book</h3>
              </div>
              <img src={`${import.meta.env.VITE_IMAGEURL}/${vehicle.rcBookImage}`} alt="RC Book" className="w-full h-auto rounded" />
            </div>
          </div>
        </div>
      
    ))}
  </DialogContent>

  <DialogActions className="p-4 border-t">
    <Button onClick={() => setOpenModal(false)} variant="contained" color="primary">
      Close
    </Button>
  </DialogActions>
</Dialog>

      
    </Box>
    
  );
};

export default UserManagement;