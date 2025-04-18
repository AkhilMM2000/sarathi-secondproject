import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/ReduxStore";
import { setNearbyDrivers } from "../store/slices/userside/nearbyDriversSlice";
import { GetDriverswithDistance } from "../Api/driverService";

export const useNearbyDrivers = (driverId?: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const drivers = useSelector((state: RootState) => state.NearDrivers.nearbyDrivers);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const data = await GetDriverswithDistance("user");
        dispatch(setNearbyDrivers(data.drivers));
      } catch (error) {
        console.error("Failed to fetch drivers:", error);
      }
    };

    fetchDrivers();
  }, [dispatch]);

  // If driverId is provided, return an array with the single driver (or an empty array if not found)
  if (driverId) {
    return drivers.filter((driver) => driver._id === driverId);
  }

  // Ensure the return type is always an array
  return drivers ?? [];
};
