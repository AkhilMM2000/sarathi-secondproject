import { getApiInstance } from "../constant/Api";
import { UserRole, DriverData } from "../constant/types";

export const handleDriverData = async (
  role: UserRole,
  data?: Partial<DriverData> // Optional for update
): Promise<DriverData> => {
  try {
    const apiInstance = getApiInstance(role);

    let response;
    if (data) {
      // If data is provided → Update
      response = await apiInstance.put(`/driver/${data._id}`, data);
    } else {
      // If no data → Fetch
      response = await apiInstance.get("/driver");
    }

    return response.data.driver;
  } catch (error) {
    console.error(`Error handling driver data for ${role}:`, error);
    throw error;
  }
};

export const GetAllDriverAPi = async (role: UserRole) => {
  try {

    const apiInstance = getApiInstance(role);
const response=await apiInstance.get('/driver')
return response.data
  } catch (error) {
    console.error(`Error handling driver data for ${role}:`, error);
    throw error;
  }

};

export const DriverBlockHandle = async (role: UserRole, { _id, isBlock }: Pick<DriverData, "_id" | "isBlock">) => {
  try {
    const apiInstance = getApiInstance(role);
    const response = await apiInstance.patch(`/driver/blockstatus/${_id}`, { isBlock: !isBlock });

    return response.data;
  } catch (error) {
    console.error(`Error updating block status for role ${role}:`, error);
    throw error;
  }
};

export const DriverStatusHandle = async (
  role: UserRole,
  { _id, status, reason }: Pick<DriverData, "_id" | "status" | "reason">
) => {
  try {
    const apiInstance = getApiInstance(role);

    const payload: { status: string; reason?: string } = { status };
    if (status === "rejected" && reason) {
      payload.reason = reason;
    }

  
    const response = await apiInstance.put(`/driver/status/${_id}`, payload);

    return response.data;
  } catch (error) {
    console.error(`Error updating driver status for role ${role}:`, error);
    throw error;
  }
};

export const GetDriverswithDistance=async(  role: UserRole)=>{
      try {
        const apiInstance = getApiInstance(role);
        const response = await apiInstance.get(`/nearby`);

        return response.data;
      } catch (error) {
        throw error
      }

}