import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {  DriverData  } from "../../constant/types"; 


interface DriverState {
  drivers: DriverData[];
}

const initialState: DriverState = {
  drivers: [],
};

const driverSlice = createSlice({
    name: "adminUser",
  initialState,
  reducers: {
    setDriver: (state, action: PayloadAction<DriverData[]>) => {
        state.drivers = action.payload;
      },
      clearDriver: (state) => {
        state.drivers = [];
      },
      updateDriver: (state, action: PayloadAction<DriverData>) => {
        const updatedDriver = action.payload;
        state.drivers = state.drivers.map((d) =>
          d._id === updatedDriver._id ? updatedDriver : d
        );
      },
      
      changeBlockStatus: (state, action: PayloadAction<{ userId: string; status: boolean }>) => {
        const driver = state.drivers.find((d) => d._id === action.payload.userId);
        if (driver) {
          driver.isBlock = action.payload.status;
        }
      },
      
  },
});

export const { clearDriver,setDriver,updateDriver,changeBlockStatus} = driverSlice.actions


export default driverSlice.reducer