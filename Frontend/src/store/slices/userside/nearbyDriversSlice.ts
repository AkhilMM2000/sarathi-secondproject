import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DriverData } from "../../../constant/types"; 

interface NearbyDriverState {
  nearbyDrivers: (DriverData & { distance: number })[];
}

const initialState: NearbyDriverState = {
  nearbyDrivers: [],
};

const nearbyDriversSlice = createSlice({
  name: "nearbyDrivers",
  initialState,
  reducers: {
    setNearbyDrivers: (state, action: PayloadAction<(DriverData & { distance: number })[]>) => {
      state.nearbyDrivers = action.payload;
    },
    clearNearbyDrivers: (state) => {
      state.nearbyDrivers = [];
    }
  },
});

export const { setNearbyDrivers, clearNearbyDrivers } = nearbyDriversSlice.actions;
export default nearbyDriversSlice.reducer;
