import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DriverData } from '../../constant/types';

interface DriverState {
  driver: DriverData | null;
}

const initialState: DriverState = {
  driver: null,
};

const driverSlice = createSlice({
  name: 'driver',
  initialState,
  reducers: {
    setDriver: (state, action: PayloadAction<DriverData>) => {
      state.driver = action.payload;
    },
    updateDriver: (state, action: PayloadAction<Partial<DriverData>>) => {
      if (state.driver) {
        state.driver = { ...state.driver, ...action.payload };
      }
    },
    clearDriver: (state) => {
      state.driver = null;
    },
  },
});

export const { setDriver, updateDriver, clearDriver } = driverSlice.actions;

export default driverSlice.reducer;
