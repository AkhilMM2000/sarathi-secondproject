import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Vehicle {
  _id?: string;
  driverId: string;
  vehicleImage: string;
  rcBookImage: string;
  Register_No: string;
  ownerName: string;
  vehicleName: string;
  vehicleType: string;
  polution_expire: Date|string|null;
}

interface VehicleState {
  vehicles: Vehicle[];

}

const initialState: VehicleState = {
    vehicles: [],
  
};

const userVehicleSlice= createSlice({
  name: "driverVehicle",
  initialState,
  reducers: {
    addVehicle: (state, action: PayloadAction<Vehicle>) => {
        state.vehicles.push(action.payload);
      },
  
  
      editVehicle: (state, action: PayloadAction<Partial<Vehicle>>) => {
        if (!action.payload._id) return;
        state.vehicles = state.vehicles.map(v =>
          v._id === action.payload._id ? { ...v, ...action.payload } : v
        );
      },
      
  
      // Delete a vehicle
      deleteVehicle: (state, action: PayloadAction<string>) => {
        state.vehicles = state.vehicles.filter(vehicle => vehicle._id !== action.payload);
      },
      setVehicles: (state, action: PayloadAction<Vehicle[]>) => {
        state.vehicles = action.payload;  // ✅ Replaces the entire list
      },
    },
   

});

export const { addVehicle,editVehicle ,deleteVehicle,setVehicles} =userVehicleSlice.actions;

export default userVehicleSlice.reducer;
