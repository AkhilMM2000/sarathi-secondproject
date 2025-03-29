import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {  UserWithVehicleCount } from "../../constant/types"; 


interface UserState {
  user: UserWithVehicleCount[];
}

const initialState: UserState = {
  user: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserWithVehicleCount[]>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = [];
    },
    updateUser: (state, action: PayloadAction<UserWithVehicleCount>) => {
      const updatedUser = action.payload;
      state.user = state.user.map((u) => (u._id === updatedUser._id ? updatedUser : u));
    },
    changeBlockStatus: (state, action: PayloadAction<{ userId: string; status: boolean }>) => {
      const { userId, status } = action.payload;
      state.user = state.user.map((u) =>
        u._id === userId ? { ...u, isBlock: status } : u
      );
    },
  
  },
});

export const { setUser, clearUser, updateUser ,changeBlockStatus} = userSlice.actions;

export default userSlice.reducer;
