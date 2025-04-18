import { configureStore } from "@reduxjs/toolkit";
import userVehicleReducer from './slices/userVehicle' // Adjust the path based on your project structure
import userReducer from './slices/userStore'
import driverReducer from './slices/DriverStore'
import authuserReducer from './slices/AuthuserStore'
import AdminDriverReducer from './slices/adminDriverSlice'
import NearByDrivers from './slices/userside/nearbyDriversSlice'
export const store = configureStore({
  reducer: {
    userVehicle: userVehicleReducer,
    users:userReducer,
    driverStore:driverReducer,
    authUser:authuserReducer,
    AllDrivers:AdminDriverReducer,
    NearDrivers:NearByDrivers
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
