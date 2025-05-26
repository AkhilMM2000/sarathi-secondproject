// src/utils/api.ts
import { UserAPI,AdminAPI,DriverAPI } from "../Api/AxiosInterceptor"; 
import { UserRole } from "../constant/types";

export const getApiInstance = (role: UserRole) => {
  switch (role) {
    case "user":
      return UserAPI;
    case "driver":
      return DriverAPI ;
    case "admin":
      return AdminAPI;
    default:
      throw new Error("Invalid role");
  }
};
export const signUrl='http://localhost:5173/user'