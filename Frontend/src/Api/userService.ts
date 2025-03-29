import { getApiInstance } from "../constant/Api"; 
import { IUser, UserRole, UserWithVehicleCount } from "../constant/types";


export const getUserApi = async (role: UserRole): Promise<UserWithVehicleCount[]> => {
  try {
    const apiInstance = getApiInstance(role);
    const response = await apiInstance.get("/user");
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching user for ${role}:`, error);
    throw error;
  }
};


export const BlockUnblockApi = async (role: UserRole, id: string, isBlock: boolean) => {
  try {
    const apiInstance = getApiInstance(role);
    const response = await apiInstance.put(`/update-user-status/${id}`, { isBlock });
    return response.data;
  } catch (error) {
    console.error(`Error updating user block status for ${role}:`, error);
    throw error;
  }
};
export const getLoggedUserApi = async (): Promise<IUser> => {
  try {
    const apiInstance = getApiInstance("user"); 
    const response = await apiInstance.get("/profile");
    console.log(response.data.user);
    
    return response.data.user;
  } catch (error) {
    console.error("Error fetching logged-in user:", error);
    throw error;
  }
};

export const updateLoggedUserApi = async (
  updateData: Partial<IUser> 
): Promise<IUser> => {
  try {
    const apiInstance = getApiInstance("user");
    const response = await apiInstance.patch(`/profile/${updateData._id}`, updateData);
    return response.data.user;
  } catch (error) {
    console.error("Error updating logged-in user:", error);
    throw error;
  }
};