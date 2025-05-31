
import { UserAPI, DriverAPI, AdminAPI } from "./AxiosInterceptor";
import { UserRole } from "../constant/types";
import { getApiInstance } from "../constant/Api";


export interface VehiclePayload {
  Register_No: string;
  ownerName: string;
  vehicleName: string;
  vehicleType: string;
  polution_expire: string | null|Date;
  vehicleImage: string; 
  rcBookImage: string; 
}


export const addVehicleApi = async (role: UserRole, data: VehiclePayload) => {
  try {

    const apiInstance =
      role === "user" ? UserAPI : role === "driver" ? DriverAPI : AdminAPI;

    const response = await apiInstance.post("/vehicle", data, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error) {
    console.error(`Error adding vehicle for ${role}:`, error);
    throw error;
  }
};
export const getVehiclesApi = async (role: UserRole) => {
  try {
    const apiInstance =
      role === "user" ? UserAPI : role === "driver" ? DriverAPI : AdminAPI;

    const response = await apiInstance.get("/vehicle");
                
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching vehicles for ${role}:`, error);
    throw error;
  }
};

export const editVehicleApi = async (
  role: UserRole,
  vehicleId: string,
  updateData: Partial<VehiclePayload>
) => {
  try {
    const apiInstance =
      role === "user" ? UserAPI : role === "driver" ? DriverAPI : AdminAPI;

    const response = await apiInstance.put(`/vehicle/${vehicleId}`, updateData, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error) {
    console.error(`Error editing vehicle for ${role}:`, error);
    throw error;
  }

}


export const getVehiclesByUser= async (role: UserRole, userId:string) => {
  try {
    const apiInstance = getApiInstance(role);
    const response = await apiInstance.get(`/vehicles/${userId}`);

    return response.data;
  } catch (error) {
    console.error(`Error updating block status for role ${role}:`, error);
    throw error;
  }
};
