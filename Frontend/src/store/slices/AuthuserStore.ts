import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../constant/types";

interface UserState {
  user: IUser| null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false, 
};

const AuthUserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true; 
    },
    updateUser: (state, action: PayloadAction<Partial<IUser>>) => {
      if (state.user) {
        Object.assign(state.user, action.payload); 
      }
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false; 
    },
  },
});

export const { clearUser, setAuthUser, updateUser } = AuthUserSlice.actions;

export default AuthUserSlice.reducer;
